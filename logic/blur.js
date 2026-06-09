Reveal.on('fragmentshown', e => {
    const target = e.fragment.dataset.target;

    if (target === "anon") {
        document.querySelector('#anon-block .box')
        .classList.add('blurred');
    }

    if (target === "aml") {
        document.querySelector('#aml-block .box')
        .classList.add('blurred');
    }
});

Reveal.on('fragmenthidden', e => {
    const target = e.fragment.dataset.target;

    if (target === "anon") {
        document.querySelector('#anon-block .box')
        .classList.remove('blurred');
    }

    if (target === "aml") {
        document.querySelector('#aml-block .box')
        .classList.remove('blurred');
    }
});