import confetti from 'canvas-confetti';

export function triggerConfettiBurst() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#FFC72C', '#FF5964', '#35A7FF', '#70E000'],
  });
  fire(0.2, {
    spread: 60,
    colors: ['#FF8C42', '#D81159', '#0066FF', '#FFFFFF'],
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    colors: ['#FFE100', '#FF0055', '#00E5FF'],
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

export function triggerSideCannons() {
  const duration = 3 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#FFD166', '#FF4D8D', '#06D6A0', '#118AB2'],
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#FF8C42', '#35A7FF', '#70E000', '#FFC72C'],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

export function triggerFloatingEmoji(emoji: string, x: number, y: number) {
  const element = document.createElement('div');
  element.innerText = emoji;
  element.className = 'fixed pointer-events-none text-3xl z-50 animate-bounce select-none';
  element.style.left = `${x - 15}px`;
  element.style.top = `${y - 15}px`;
  element.style.transition = 'all 1s ease-out';
  document.body.appendChild(element);

  setTimeout(() => {
    element.style.transform = 'translateY(-100px) scale(1.5)';
    element.style.opacity = '0';
  }, 20);

  setTimeout(() => {
    if (document.body.contains(element)) {
      document.body.removeChild(element);
    }
  }, 1000);
}
