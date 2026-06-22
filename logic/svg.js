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
        'withdraw3',
        'diagram'
        ]

function loadSVGs() {
  const loads = svgs.map(s =>
    fetch('assets/' + s + '.svg')
      .then(r => r.text())
      .then(svg => {
        const container = document.getElementById(s);
        if (!container) return;
        container.innerHTML = svg;
        if (s == 'diagram') {
            initAnimation()
        }
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

window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    loadSVGs();
  }, 150);
});

window.addEventListener('resize', event => {
    setTimeout(() => {
        loadSVGs();
    }, 100);
});

window.addEventListener('pageshow', event => {
    setTimeout(() => {
        loadSVGs();
    }, 100);
});