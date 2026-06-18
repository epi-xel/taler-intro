const stepQueue = [];
let isProcessing = false;

function initAnimation() {

    Reveal.on('fragmentshown', e => enqueueStep(e));

    Reveal.on('fragmenthidden', () => {
        const slide = Reveal.getCurrentSlide();

        if (
            slide.querySelector("#diagram") ||
            slide.querySelector("#signed-letter")
        ) {
            resetDiagram();
        }
    });

    Reveal.on('slidechanged', e => {
        if (
            e.currentSlide.querySelector("#diagram") ||
            e.currentSlide.querySelector("#signed-letter")
        ) {
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

    // ---- OLD DIAGRAM ----
    const coin = document.getElementById("coin");
    const anon = document.getElementById("anon-coin");

    // ---- BLINDSIG ----
    const envelope = document.getElementById("signed-letter");
    const cert = document.getElementById("signed-cert");
    const sigBlind = document.getElementById("sig-on-blinded");
    const sigFinal = document.getElementById("bank-sig-final");
    const pen = document.getElementById("pen");

    gsap.killTweensOf("*");

    // reset old diagram
    if (coin && anon) {
        gsap.set([coin, anon], { x: 0, y: 0 });
        gsap.set(coin, { opacity: 1 });
        gsap.set(anon, { opacity: 0 });
        gsap.set("#wallet-overlay", { opacity: 0 });
    }

    // reset blind signature
    if (envelope) {
        gsap.set(envelope, { x: 0, y: 0 });
        gsap.set(cert, { opacity: 1 });
        gsap.set(sigBlind, { opacity: 0 });
        gsap.set(sigFinal, { opacity: 0 });
        gsap.set(pen, { opacity: 0 });
    }

    stepQueue.length = 0;
    isProcessing = false;

    const { h, v } = Reveal.getIndices();
    Reveal.slide(h, v, -1);
}

async function handleStep(event) {

    const step = event.fragment.dataset.step;
    const slide = event.fragment.closest("section");

    // =========================================================
    // ✅ OLD DIAGRAM (UNCHANGED)
    // =========================================================
    if (slide.querySelector("#diagram")) {

        const coin = document.getElementById("coin");
        const anon = document.getElementById("anon-coin");

        switch (step) {

            case "wire-money1":
                await move(coin, "Reserve");
                return;

            case "withdraw":
                showWallet();
                await move(anon, "exchange", 0);
                await move(coin, "exchange");
                await crossfade(coin, anon);
                await move(anon, "wallet-group");
                return;

            case "pay":
                await move(anon, "merchant");
                return;

            case "deposit":
                await move(anon, "exchange");
                return;

            case "wire-money2":
                await crossfade(anon, coin);
                await move(coin, "bankm");
                return;
        }
    }

    // =========================================================
    // ✅ BLIND SIGNATURE FLOW (NEW)
    // =========================================================
    if (slide.querySelector("#signed-letter")) {

        const envelope = document.getElementById("signed-letter");
        const cert = document.getElementById("signed-cert");
        const sigBlind = document.getElementById("sig-on-blinded");
        const sigFinal = document.getElementById("bank-sig-final");
        const pen = document.getElementById("pen");

        switch (step) {

            // 1️⃣ CERT → BLINDED
            case "blind":
                await new Promise(res => {
                    gsap.timeline({ onComplete: res })
                        .to(cert, {
                            scale: 0.7,
                            opacity: 0,
                            duration: 0.5
                        })
                        .to(envelope, {
                            scale: 1.05,
                            duration: 0.3
                        }, "<")
                        .to(envelope, {
                            scale: 1,
                            duration: 0.2
                        });
                });
                return;

            // 2️⃣ SEND TO BANK
            case "send":
                await move(envelope, "bank");
                return;

            // 3️⃣ SIGN
            case "sign":
                gsap.set(pen, { opacity: 1 });

                await new Promise(res => {
                    gsap.to(sigBlind, {
                        opacity: 1,
                        duration: 0.6,
                        onComplete: res
                    });
                });
                return;

            // 4️⃣ RETURN
            case "return":
                await move(envelope, "customer");
                return;

            // 5️⃣ OPEN ENVELOPE
            case "open":
                await crossfade(sigBlind, sigFinal);
                return;
        }
    }
}

// =========================================================
// ✅ SHARED HELPERS (UNCHANGED)
// =========================================================

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

function crossfade(a, b, duration = 1.2) {
    return new Promise(res => {
        gsap.timeline({ onComplete: res })
            .to(a, { opacity: 0, duration }, 0)
            .to(b, { opacity: 1, duration }, 0);
    });
}

function showWallet() {
    gsap.set("#wallet-overlay", { opacity: 1 });
}