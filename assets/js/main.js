(function(){
  const btn=document.querySelector('[data-menu]');
  const nav=document.querySelector('[data-nav]');
  if(btn&&nav){
    btn.addEventListener('click',()=>{
      const open=nav.classList.toggle('open');
      btn.setAttribute('aria-expanded',String(open));
    });
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');btn.setAttribute('aria-expanded','false')}));
  }
  const y=document.querySelector('[data-year]'); if(y) y.textContent=new Date().getFullYear();
})();
