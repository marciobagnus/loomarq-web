(function () {
  const button = document.querySelector('[data-menu]');
  const nav = document.querySelector('[data-nav]');

  if (button && nav) {
    const closeMenu = () => {
      nav.classList.remove('open');
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-label', 'Abrir menú');
    };

    button.hidden = false;
    nav.classList.add('nav--collapsible');
    button.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        closeMenu();
        button.focus();
      }
    });
    document.addEventListener('click', event => {
      if (!nav.contains(event.target) && !button.contains(event.target)) closeMenu();
    });
    const mobile = window.matchMedia('(max-width: 900px)');
    mobile.addEventListener('change', closeMenu);
  }

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  const form = document.querySelector('[data-contact-form]');
  if (!form || !window.fetch || !window.AbortController) return;

  const submit = form.querySelector('button[type="submit"]');
  const status = form.querySelector('[data-form-status]');
  const fields = form.querySelector('[data-form-fields]');
  const unavailable = form.querySelector('[data-form-unavailable]');
  if (!submit || !status || !fields) return;

  let sending = false;
  let submitted = false;

  const showStatus = (message, state) => {
    status.textContent = message;
    status.dataset.state = state;
    status.hidden = false;
  };

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || submitted || !form.reportValidity()) return;

    // Capture all values before disabling controls, including Netlify's hidden fields.
    const body = new URLSearchParams(new FormData(form)).toString();
    const controls = Array.from(form.elements, control => ({ control, disabled: control.disabled }));
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);

    sending = true;
    controls.forEach(({ control }) => { control.disabled = true; });
    submit.textContent = 'Enviando consulta…';
    form.setAttribute('aria-busy', 'true');
    showStatus('Estamos enviando tu consulta…', 'sending');

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
        mode: 'same-origin',
        redirect: 'error',
        signal: controller.signal
      });

      // A redirect or a static page served as HTTP 200 does not confirm a submission.
      if (!response.ok || response.redirected) throw new Error('Submission not confirmed');
      const reply = new DOMParser().parseFromString(await response.text(), 'text/html');
      if (reply.querySelector('form[name="evaluacion"], link[href$="/assets/css/styles.css"]')) {
        throw new Error('Static site response');
      }

      submitted = true;
      form.reset();
      fields.hidden = true;
      showStatus('Gracias por escribirnos. Tu consulta se envió correctamente. Vamos a revisarla para responderte.', 'success');
    } catch {
      showStatus('No pudimos confirmar el envío. Tus datos siguen en el formulario. Podés volver a intentar o escribirnos por WhatsApp.', 'error');
    } finally {
      window.clearTimeout(timeout);
      sending = false;
      form.setAttribute('aria-busy', 'false');
      if (!submitted) {
        controls.forEach(({ control, disabled }) => { control.disabled = disabled; });
        submit.textContent = 'Enviar consulta';
      }
      status.focus();
    }
  });

  // Enable submission only after the handler is ready; otherwise offer WhatsApp.
  submit.disabled = false;
  if (unavailable) unavailable.hidden = true;
})();
