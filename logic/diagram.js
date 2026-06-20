fetch('assets/diagram.svg')
    .then(r => r.text())
    .then(svg => {
        document.getElementById('diagram').innerHTML = svg;
        initAnimation();
});

const stepQueue = [];
let isProcessing = false;

function initAnimation() {
    Reveal.on('fragmentshown', e => enqueueStep(e));

    Reveal.on('fragmenthidden', () => {
        if (Reveal.getCurrentSlide().querySelector("#diagram")) {
        resetDiagram();
        }
    });

    Reveal.on('slidechanged', e => {
        if (e.currentSlide.querySelector("#diagram")) {
        resetDiagram();
        }
    });
}

function enqueueStep(event) {
    stepQueue.push(event);
    processQueue();
}

async function processQueue() {
    if (isProcessing) return;
    isProcessing = true;

    while (stepQueue.length) {
        await handleStep(stepQueue.shift());
    }

    isProcessing = false;
}

function resetDiagram() {
    const coin = document.getElementById("coin");
    const anon = document.getElementById("anon-coin");

    if (!coin || !anon) return;

    gsap.killTweensOf("*");
    gsap.set([coin, anon], { x: 0, y: 0 });
    gsap.set(coin, { opacity: 1 });
    gsap.set(anon, { opacity: 0 });
    gsap.set("#wallet-overlay", { opacity: 0 });

    stepQueue.length = 0;
    isProcessing = false;

    const { h, v } = Reveal.getIndices();
    Reveal.slide(h, v, -1);
}

async function handleStep(event) {
    const step = event.fragment.dataset.step;
    const coin = document.getElementById("coin");
    const anon = document.getElementById("anon-coin");

    switch (step) {

        case "wallet":
            showWallet();
            break;

        case "wire-money1":
            await move(coin, "Reserve");
            break;

        case "withdraw":
            await move(anon, "exchange", 0);
            await move(coin, "exchange");
            await crossfade(coin, anon);
            await move(anon, "wallet-group");
            break;

        case "pay":
            await move(anon, "merchant");
            break;

        case "deposit":
            await move(anon, "exchange");
            break;

        case "wire-money2":
            await crossfade(anon, coin);
            await move(coin, "bankm");
            break;
    }
}

function getCenter(el) {
    const b = el.getBBox();
    return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
}

function move(el, targetId, duration = 0.8) {
    return new Promise(res => {
        const t = document.getElementById(targetId);
        if (!t) return res();

        const c1 = getCenter(el);
        const c2 = getCenter(t);

        gsap.to(el, {
        duration,
        x: c2.x - c1.x,
        y: c2.y - c1.y,
        ease: "power2.inOut",
        onComplete: res
        });
    });
}

function crossfade(a, b, duration = 1.5) {
    return new Promise(res => {
        gsap.timeline({ onComplete: res })
        .to(a, { opacity: 0, duration }, 0)
        .to(b, { opacity: 1, duration }, 0);
    });
}

function showWallet() {
    gsap.set("#wallet-overlay", { opacity: 1});
}