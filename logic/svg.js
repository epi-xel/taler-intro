svgs = ['coin-struc', 
        'payment1',
        'payment2',
        'cheat1',
        'cheat2',
        'cheat3',
        'reobtain-coin',
        'streaming',
        'blind-sig1',
        'blind-sig2',
        'blind-sig3',
        'withdraw1',
        'withdraw2',
        'withdraw3'
        ]

svgs.forEach(s => {
    fetch('assets/' + s + '.svg')
    .then(r => r.text())
    .then(svg => {
        const container = document.getElementById(s);
        container.innerHTML = svg;

        container.querySelectorAll('svg').forEach(el => {
            el.style.display = 'block';
            el.style.setProperty('width', 'auto', 'important');
            el.style.setProperty('height', '100%', 'important');
            el.style.setProperty('max-width', '100%', 'important');
            el.style.setProperty('max-height', '100%', 'important');
            el.style.setProperty('object-fit', 'contain', 'important');
        });
    });
});