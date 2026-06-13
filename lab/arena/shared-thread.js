/* ═══════════════════════════════════════════════════════════
   ОБЩИЙ КОМПОНЕНТ «Сквозная Нить» — для всех агентов (О·М·С)
   Объединяет: «сквозную линию» О + «Нить» М в один элемент.
   Путь смысла: часы(время) → искра(память) → корни(род) → дерево(наследие)
   Подключение:
     <script src="../shared-thread.js"></script>
     <script>SaveThread.mount({color:'#e0a955'});</script>
   Линия сама рисуется по скроллу (stroke-dashoffset).
   ═══════════════════════════════════════════════════════════ */
(function (global) {
  const NS = 'http://www.w3.org/2000/svg';

  function mount(opts = {}) {
    const color = opts.color || '#e0a955';
    const width = opts.width || 1.6;
    const glow  = opts.glow !== false; // свечение в тёмной теме
    const zIndex = opts.zIndex || 5;

    // контейнер
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 140 4600');
    svg.setAttribute('preserveAspectRatio', 'xMidYMin slice');
    Object.assign(svg.style, {
      position: 'fixed', top: '0', left: '50%',
      transform: 'translateX(-50%)', width: '140px', height: '100vh',
      zIndex: String(zIndex), pointerEvents: 'none'
    });

    // путь: волна часы→искра→корни→дерево
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d',
      'M70,0 C70,400 20,650 70,1000 C120,1350 120,1650 70,2000 ' +
      'C20,2350 20,2650 70,3000 C120,3350 110,3650 70,4000 ' +
      'C40,4300 70,4500 70,4600');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', String(width));
    if (glow) path.style.filter = `drop-shadow(0 0 8px ${hexToRgba(color, .55)})`;
    svg.appendChild(path);
    document.body.appendChild(svg);

    // line-draw по скроллу
    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    const onScroll = () => {
      const max = document.body.scrollHeight - innerHeight;
      const p = max > 0 ? Math.min(1, scrollY / max) : 0;
      path.style.strokeDashoffset = len * (1 - p);
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    onScroll();
    return { svg, path, refresh: onScroll };
  }

  function hexToRgba(hex, a) {
    const h = hex.replace('#', '');
    const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  }

  global.SaveThread = { mount };
})(window);
