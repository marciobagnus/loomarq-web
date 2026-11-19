import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const script = readFileSync(new URL('../assets/js/main.js', import.meta.url), 'utf8');
const home = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const legacyPage = readFileSync(new URL('../gracias.html', import.meta.url), 'utf8');

function createForm(send, valid = true) {
  const controls = [
    { name: 'form-name', value: 'evaluacion', disabled: false },
    { name: 'bot-field', value: '', disabled: false },
    { name: 'nombre', value: 'María Pérez', disabled: false },
    { name: 'privacidad', value: 'on', disabled: false }
  ];
  const button = { disabled: true, textContent: 'Enviar consulta' };
  const status = { hidden: true, dataset: {}, focus() { this.focused = true; } };
  const fields = { hidden: false };
  const unavailable = { hidden: false };
  const nodes = {
    'button[type="submit"]': button,
    '[data-form-status]': status,
    '[data-form-fields]': fields,
    '[data-form-unavailable]': unavailable
  };
  const requests = [];
  let onSubmit;
  let onTimeout;
  let timeoutCleared = false;
  let resets = 0;
  const form = {
    action: 'https://getloomarq.com/',
    elements: [...controls, button],
    attributes: {},
    querySelector: selector => nodes[selector],
    addEventListener: (name, callback) => { if (name === 'submit') onSubmit = callback; },
    setAttribute(name, value) { this.attributes[name] = value; },
    reportValidity: () => valid,
    reset() { resets++; controls.find(control => control.name === 'nombre').value = ''; }
  };
  const fetch = (url, options) => {
    requests.push({ url, options });
    return send(url, options);
  };
  runInNewContext(script, {
    document: { querySelector: selector => selector === '[data-contact-form]' ? form : null },
    window: {
      fetch,
      AbortController,
      setTimeout(callback, duration) { assert.equal(duration, 20000); onTimeout = callback; return 1; },
      clearTimeout() { timeoutCleared = true; }
    },
    fetch,
    AbortController,
    URLSearchParams,
    FormData: class {
      constructor() { return controls.filter(control => !control.disabled).map(control => [control.name, control.value]); }
    }
  });
  return {
    form, controls, button, status, fields, requests,
    submit: () => onSubmit({ preventDefault() {} }),
    expire: () => onTimeout(),
    get resets() { return resets; },
    get timeoutCleared() { return timeoutCleared; }
  };
}

function assertFailure(view) {
  assert.equal(view.status.dataset.state, 'error');
  assert.equal(view.fields.hidden, false);
  assert.equal(view.controls.find(control => control.name === 'nombre').value, 'María Pérez');
  assert.equal(view.controls.find(control => control.name === 'privacidad').value, 'on');
  assert.ok(view.controls.every(control => !control.disabled));
  assert.equal(view.button.disabled, false);
  assert.equal(view.resets, 0);
  assert.equal(view.form.attributes['aria-busy'], 'false');
  assert.equal(view.status.focused, true);
  assert.equal(view.timeoutCleared, true);
}

for (const [name, body] of [['home HTML', home], ['custom page HTML', legacyPage], ['empty body', '']]) {
  test(`Netlify HTTP 200 with ${name} confirms the POST without parsing its body`, async () => {
    const view = createForm(async () => new Response(body, { status: 200 }));
    await view.submit();
    assert.equal(view.status.dataset.state, 'success');
    assert.equal(view.fields.hidden, true);
    assert.equal(view.resets, 1);
    assert.equal(view.controls.find(control => control.name === 'nombre').value, '');
    assert.equal(view.status.focused, true);
    assert.equal(view.form.attributes['aria-busy'], 'false');
    assert.equal(view.timeoutCleared, true);
    await view.submit();
    assert.equal(view.requests.length, 1, 'success cannot be submitted again');
  });
}

test('invalid fields prevent a request', async () => {
  const view = createForm(() => assert.fail('must not send invalid data'), false);
  await view.submit();
  assert.equal(view.requests.length, 0);
  assert.equal(view.status.hidden, true);
});

test('pending request locks controls and prevents duplicate submissions', async () => {
  let accept;
  const view = createForm(() => new Promise(resolve => { accept = resolve; }));
  const pending = view.submit();
  assert.equal(view.status.dataset.state, 'sending');
  assert.equal(view.button.disabled, true);
  assert.ok(view.controls.every(control => control.disabled));
  assert.equal(view.resets, 0);
  await view.submit();
  assert.equal(view.requests.length, 1);
  const { url, options } = view.requests[0];
  assert.equal(url, 'https://getloomarq.com/');
  assert.equal(options.method, 'POST');
  assert.equal(options.mode, 'same-origin');
  assert.equal(options.redirect, 'error');
  assert.equal(options.headers['Content-Type'], 'application/x-www-form-urlencoded');
  const data = new URLSearchParams(options.body);
  assert.equal(data.get('form-name'), 'evaluacion');
  assert.equal(data.get('nombre'), 'María Pérez');
  assert.equal(data.get('privacidad'), 'on');
  assert.equal(data.get('bot-field'), '');
  accept(new Response(home, { status: 200 }));
  await pending;
  assert.equal(view.status.dataset.state, 'success');
});

for (const status of [400, 404, 422, 429, 500]) {
  test(`HTTP ${status} preserves input and does not confirm submission`, async () => {
    const view = createForm(async () => new Response('Error', { status }));
    await view.submit();
    assertFailure(view);
  });
}

test('network failure preserves input and allows a deliberate retry', async () => {
  let attempts = 0;
  const view = createForm(async () => {
    if (++attempts === 1) throw new TypeError('Network error');
    return new Response(home, { status: 200 });
  });
  await view.submit();
  assertFailure(view);
  assert.equal(view.requests.length, 1, 'no automatic retry');
  await view.submit();
  assert.equal(view.requests.length, 2);
  assert.equal(view.status.dataset.state, 'success');
});

test('timeout aborts the request and preserves input', async () => {
  const view = createForm((url, options) => new Promise((resolve, reject) => {
    options.signal.addEventListener('abort', () => reject(new Error('Aborted')));
  }));
  const pending = view.submit();
  view.expire();
  await pending;
  assertFailure(view);
});

test('a redirected response does not count as confirmation', async () => {
  const view = createForm(async () => ({ ok: true, redirected: true }));
  await view.submit();
  assertFailure(view);
});
