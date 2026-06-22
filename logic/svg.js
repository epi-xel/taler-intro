svgs = ['coin-struc', 
        'payment1',
        'payment2',
        'cheat1',
        'cheat2',
        'cheat3',
        'reobtain-coin', // cointains HTML, cannot be loaded only as a svg
        'streaming',
        'blind-sig1',
        'blind-sig2',
        'blind-sig3',
        'withdraw1',
        'withdraw2',
        'withdraw3'
        ]

function applySVGStyles(container) {
  container.querySelectorAll('svg').forEach(el => {
    el.style.display = 'block';
    el.style.setProperty('width', 'auto', 'important');
    el.style.setProperty('height', '100%', 'important');
    el.style.setProperty('max-width', '100%', 'important');
    el.style.setProperty('max-height', '100%', 'important');
    el.style.setProperty('object-fit', 'contain', 'important');
  });
}

function loadSVGs() {
  const loads = svgs.map(s =>
    fetch('assets/' + s + '.svg')
      .then(r => r.text())
      .then(svg => {
        const container = document.getElementById(s);
        if (!container) return;
        container.innerHTML = svg;
        applySVGStyles(container);
      })
  );

  Promise.all(loads).then(() => {
    if (window.Reveal) {
      Reveal.layout();
      Reveal.sync();
    }
  });
}

// Initial load
loadSVGs();

// Reload and re-sync on orientation change / window resize / reload/back-forward restore
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    applySVGStyles(document.body);
    if (window.Reveal) {
      Reveal.layout();
      Reveal.sync();
    }
  }, 100);
});

window.addEventListener('resize', () => {
  if (window.Reveal) {
    Reveal.layout();
    Reveal.sync();
  }
});

window.addEventListener('pageshow', event => {
  if (window.Reveal) {
    applySVGStyles(document.body);
    Reveal.layout();
    Reveal.sync();
  }
});