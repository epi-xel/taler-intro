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
        document.getElementById(s).innerHTML = svg;
    });
});