svgs = ['bs', 
        'bs-taler', 
        'coin-struc', 
        'payment',
        'payment2',
        'cheat0',
        'cheat1',
        'cheat2',
        'refresh-prot',
        'refresh-derive',
        'reobtain-coin',
        'pq-idea', // note: this file contains HTML and it doesn't render alone as SVG
        'rand',
        'tsig',
        'new-rd',
        'reveal-ex',
        'recap',
        'streaming',
        'blind-sig1',
        'blind-sig2',
        'blind-sig3'
        ]

svgs.forEach(s => {
    fetch('assets/' + s + '.svg')
    .then(r => r.text())
    .then(svg => {
        document.getElementById(s).innerHTML = svg;
    });
});