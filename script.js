/* ============================================================
   ROBOTICO TEAM — سكربت مشترك لكل الصفحات
   ============================================================ */

/* ---------- ١) الثيم: تلقائي حسب الوقت + زر يدوي ---------- */
(function initTheme(){
  let saved = null;
  try { saved = localStorage.getItem('robotico-theme'); } catch(e){}
  let theme;
  if (saved === 'day' || saved === 'night') {
    theme = saved;                       // اختيار المستخدم له الأولوية
  } else {
    const h = new Date().getHours();     // تلقائي: نهاري من 6 صباحًا حتى 6 مساءً
    theme = (h >= 6 && h < 18) ? 'day' : 'night';
  }
  document.documentElement.setAttribute('data-theme', theme);
})();

function toggleTheme(){
  const root = document.documentElement;
  const next = root.getAttribute('data-theme') === 'day' ? 'night' : 'day';
  root.setAttribute('data-theme', next);
  try { localStorage.setItem('robotico-theme', next); } catch(e){}
  updateThemeIcon();
}

function updateThemeIcon(){
  const btn = document.getElementById('themeBtn');
  if(!btn) return;
  const isDay = document.documentElement.getAttribute('data-theme') === 'day';
  btn.innerHTML = isDay
    ? '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';
  btn.setAttribute('aria-label', isDay ? 'التبديل للوضع الليلي' : 'التبديل للوضع النهاري');
}

/* ---------- ٢) انتقال الصفحات المتحرك ---------- */
function navigateTo(url){
  const wipe = document.getElementById('pageWipe');
  if(!wipe || matchMedia('(prefers-reduced-motion: reduce)').matches){
    location.href = url; return;
  }
  wipe.classList.add('enter');
  setTimeout(()=>{ location.href = url; }, 560);
}

document.addEventListener('DOMContentLoaded', ()=>{
  updateThemeIcon();

  // عند فتح الصفحة: ستارة خروج
  const wipe = document.getElementById('pageWipe');
  if (wipe && sessionStorage_get('robotico-nav') === '1'){
    wipe.classList.add('leave');
    setTimeout(()=>wipe.classList.remove('leave'), 900);
  }
  sessionStorage_set('robotico-nav','0');

  // اعتراض روابط التنقل الداخلية
  document.querySelectorAll('a[data-nav]').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      sessionStorage_set('robotico-nav','1');
      navigateTo(a.getAttribute('href'));
    });
  });

  /* ---------- ٣) الظهور عند التمرير ---------- */
  const io = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, {threshold:.14});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  /* ---------- ٤) قائمة الموبايل ---------- */
  const burger = document.getElementById('burger');
  const links = document.getElementById('navLinks');
  if(burger && links){
    burger.addEventListener('click', ()=>{
      const open = links.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
    });
  }

  /* ---------- ٥) النافذة الجانبية ---------- */
  const sideTab = document.getElementById('sideTab');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const sideClose = document.getElementById('sideClose');
  function openSide(){ sidebar.classList.add('open'); overlay.classList.add('show'); }
  function closeSide(){ sidebar.classList.remove('open'); overlay.classList.remove('show'); }
  if(sideTab && sidebar && overlay){
    sideTab.addEventListener('click', openSide);
    overlay.addEventListener('click', closeSide);
    if(sideClose) sideClose.addEventListener('click', closeSide);
    document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeSide(); });
  }
});

/* sessionStorage آمن (لا يكسر الصفحة إذا كان محجوبًا) */
function sessionStorage_get(k){ try{ return sessionStorage.getItem(k); }catch(e){ return null; } }
function sessionStorage_set(k,v){ try{ sessionStorage.setItem(k,v); }catch(e){} }
