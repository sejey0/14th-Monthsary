/**
 * 14th Monthsary Letter Website Scripts
 * Strictly Icon-Based (No Emojis), Purple & Pink Aesthetic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // State
  let isUnlocked = false;
  let isLetterOpen = false;
  let isPlaying = false;
  let currentVolume = 0.7; // Default 70%
  const PASSCODE = "14";

  // Elements
  const lockScreen = document.getElementById('lockScreen');
  const lockIconContainer = document.getElementById('lockIconContainer');
  const pinInputs = document.querySelectorAll('.pin-digit');
  const unlockBtn = document.getElementById('unlockBtn');
  const directUnlockBtn = document.getElementById('directUnlockBtn');
  const hintBtn = document.getElementById('hintBtn');
  const hintText = document.getElementById('hintText');
  const pinErrorMessage = document.getElementById('pinErrorMessage');

  // Envelope & Letter Elements
  const envelopeFlap = document.getElementById('envelopeFlap');
  const envelopeLetter = document.getElementById('envelopeLetter');
  const waxSeal = document.getElementById('waxSeal');
  const openLetterBtn = document.getElementById('openLetterBtn');
  const letterModal = document.getElementById('letterModal');
  const closeLetterBtn = document.getElementById('closeLetterBtn');

  // Music Player Elements
  const bgAudio = document.getElementById('bgAudio');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const playPauseIcon = document.getElementById('playPauseIcon');
  const volumeSlider = document.getElementById('volumeSlider');
  const volumeUpBtn = document.getElementById('volumeUpBtn');
  const volumeDownBtn = document.getElementById('volumeDownBtn');
  const volumeIcon = document.getElementById('volumeIcon');
  const eqVisualizer = document.getElementById('eqVisualizer');
  const trackStatus = document.getElementById('trackStatus');

  // -------------------------------------------------------------
  // Ambient Romantic Audio Synthesizer Fallback (Web Audio API)
  // Ensures audio plays sweetly even before user adds music.mp3
  // -------------------------------------------------------------
  let audioCtx = null;
  let synthGain = null;
  let synthTimer = null;
  let usingSynthFallback = false;

  const notes = [
    261.63, // C4
    293.66, // D4
    329.63, // E4
    392.00, // G4
    440.00, // A4
    523.25, // C5
    587.33, // D5
    659.25  // E5
  ];

  function initSynthAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
      synthGain = audioCtx.createGain();
      synthGain.gain.setValueAtTime(currentVolume * 0.15, audioCtx.currentTime);
      synthGain.connect(audioCtx.destination);
    }
  }

  function playGentleBell(freq) {
    if (!audioCtx || audioCtx.state === 'suspended') return;
    try {
      const osc = audioCtx.createOscillator();
      const noteGain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      const now = audioCtx.currentTime;
      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(0.2, now + 0.08);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

      osc.connect(noteGain);
      noteGain.connect(synthGain);

      osc.start(now);
      osc.stop(now + 2.5);
    } catch (e) {
      console.warn("Synth tone note:", e);
    }
  }

  let chordIndex = 0;
  const melodyPattern = [
    [329.63, 523.25], // E4, C5
    [392.00, 659.25], // G4, E5
    [440.00, 523.25], // A4, C5
    [349.23, 587.33], // F4, D5
    [329.63, 440.00], // E4, A4
    [392.00, 523.25]  // G4, C5
  ];

  function startSynthMelody() {
    initSynthAudio();
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    usingSynthFallback = true;
    if (synthTimer) clearInterval(synthTimer);

    // Play first chord immediately
    playGentleBell(melodyPattern[chordIndex][0]);
    setTimeout(() => playGentleBell(melodyPattern[chordIndex][1]), 180);

    synthTimer = setInterval(() => {
      chordIndex = (chordIndex + 1) % melodyPattern.length;
      playGentleBell(melodyPattern[chordIndex][0]);
      setTimeout(() => playGentleBell(melodyPattern[chordIndex][1]), 220);
    }, 2400);
  }

  function stopSynthMelody() {
    if (synthTimer) {
      clearInterval(synthTimer);
      synthTimer = null;
    }
  }

  // -------------------------------------------------------------
  // Lock Screen Logic
  // -------------------------------------------------------------
  // Focus first PIN input
  if (pinInputs.length > 0) {
    pinInputs[0].focus();
  }

  pinInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      if (pinErrorMessage) pinErrorMessage.classList.add('hidden');
      if (e.target.value.length >= 1) {
        if (index < pinInputs.length - 1) {
          pinInputs[index + 1].focus();
        } else {
          // Auto submit when last digit entered
          checkPasscode();
        }
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && index > 0) {
        pinInputs[index - 1].focus();
      }
      if (e.key === 'Enter') {
        checkPasscode();
      }
    });
  });

  if (unlockBtn) {
    unlockBtn.addEventListener('click', checkPasscode);
  }

  if (directUnlockBtn) {
    directUnlockBtn.addEventListener('click', () => {
      unlockWebsite();
    });
  }

  if (hintBtn && hintText) {
    hintBtn.addEventListener('click', () => {
      hintText.classList.toggle('hidden');
    });
  }

  function checkPasscode() {
    let entered = "";
    pinInputs.forEach(input => entered += input.value);
    
    // Accept either "14" or "1414"
    if (entered.trim() === PASSCODE || entered.trim() === "1414" || entered.trim() === "14") {
      unlockWebsite();
    } else {
      if (pinErrorMessage) {
        pinErrorMessage.classList.remove('hidden');
      }
      // Shake effect
      const pinContainer = document.getElementById('pinContainer');
      if (pinContainer) {
        pinContainer.classList.add('animate-bounce');
        setTimeout(() => pinContainer.classList.remove('animate-bounce'), 600);
      }
      pinInputs.forEach(inp => inp.value = '');
      if (pinInputs[0]) pinInputs[0].focus();
    }
  }

  function unlockWebsite() {
    if (isUnlocked) return;
    isUnlocked = true;

    // Visual unlock transition
    if (lockIconContainer) {
      lockIconContainer.innerHTML = '<i data-lucide="unlock" class="w-10 h-10 text-pink-400 animate-pulse"></i>';
      if (window.lucide) window.lucide.createIcons();
    }

    // Play subtle unlock chime
    initSynthAudio();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    playGentleBell(523.25);
    setTimeout(() => playGentleBell(659.25), 150);

    setTimeout(() => {
      lockScreen.classList.add('opacity-0', 'pointer-events-none', 'transition-opacity', 'duration-700');
      setTimeout(() => {
        lockScreen.style.display = 'none';
      }, 700);
    }, 400);
  }



  // -------------------------------------------------------------
  // Envelope & Letter Opening Logic
  // -------------------------------------------------------------
  function openLetter() {
    if (isLetterOpen) return;
    isLetterOpen = true;

    // Break seal animation
    if (waxSeal) {
      waxSeal.classList.add('breaking');
    }

    // Open flap
    setTimeout(() => {
      if (envelopeFlap) {
        envelopeFlap.classList.add('open');
      }
    }, 250);

    // Slide letter up from inside envelope pocket
    setTimeout(() => {
      if (envelopeLetter) {
        envelopeLetter.classList.add('slide-up');
      }
    }, 550);

    // Show full reading letter modal
    setTimeout(() => {
      if (letterModal) {
        letterModal.classList.remove('hidden');
        letterModal.classList.add('flex');
        // Trigger reflow for smooth transition
        void letterModal.offsetWidth;
        letterModal.classList.remove('opacity-0');
        letterModal.classList.add('opacity-100');
      }

      // Re-trigger icon rendering inside the letter
      if (window.lucide) window.lucide.createIcons();

      // Automatically play music when opening the letter
      startMusicPlayback();
    }, 1100);
  }

  function closeLetter() {
    if (!isLetterOpen) return;
    isLetterOpen = false;

    if (letterModal) {
      letterModal.classList.remove('opacity-100');
      letterModal.classList.add('opacity-0');
      setTimeout(() => {
        letterModal.classList.add('hidden');
        letterModal.classList.remove('flex');
      }, 500);
    }

    // Slide letter back down into envelope
    if (envelopeLetter) {
      envelopeLetter.classList.remove('slide-up');
    }

    // Fold flap back down
    setTimeout(() => {
      if (envelopeFlap) {
        envelopeFlap.classList.remove('open');
      }
    }, 350);

    // Restore wax seal
    setTimeout(() => {
      if (waxSeal) {
        waxSeal.classList.remove('breaking');
      }
    }, 650);
  }

  if (waxSeal) waxSeal.addEventListener('click', openLetter);
  if (openLetterBtn) openLetterBtn.addEventListener('click', openLetter);
  if (closeLetterBtn) closeLetterBtn.addEventListener('click', closeLetter);

  // Close letter when clicking modal backdrop
  if (letterModal) {
    letterModal.addEventListener('click', (e) => {
      if (e.target === letterModal) {
        closeLetter();
      }
    });
  }

  // -------------------------------------------------------------
  // Music Player Controller
  // -------------------------------------------------------------
  function startMusicPlayback() {
    isPlaying = true;
    updatePlayPauseUI(true);

    if (bgAudio && bgAudio.src && !bgAudio.src.endsWith('undefined')) {
      const playPromise = bgAudio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            usingSynthFallback = false;
            if (trackStatus) trackStatus.textContent = "Now Playing: Special Song for You";
          })
          .catch((err) => {
            console.log("No audio file found or autoplay blocked, activating ambient melody fallback:", err);
            startSynthMelody();
            if (trackStatus) trackStatus.textContent = "Melody Playing (Add music.mp3 anytime)";
          });
      }
    } else {
      startSynthMelody();
      if (trackStatus) trackStatus.textContent = "Melody Playing (Add music.mp3 anytime)";
    }
  }

  function pauseMusicPlayback() {
    isPlaying = false;
    updatePlayPauseUI(false);

    if (bgAudio) {
      bgAudio.pause();
    }
    stopSynthMelody();
    if (trackStatus) trackStatus.textContent = "Music Paused";
  }

  function toggleMusic() {
    if (isPlaying) {
      pauseMusicPlayback();
    } else {
      startMusicPlayback();
    }
  }

  function updatePlayPauseUI(playing) {
    if (eqVisualizer) {
      if (playing) {
        eqVisualizer.classList.remove('eq-paused');
      } else {
        eqVisualizer.classList.add('eq-paused');
      }
    }

    if (playPauseBtn) {
      playPauseBtn.innerHTML = playing 
        ? '<i data-lucide="pause" class="w-4 h-4 text-pink-300"></i>'
        : '<i data-lucide="play" class="w-4 h-4 text-pink-300 ml-0.5"></i>';
      if (window.lucide) window.lucide.createIcons();
    }
  }

  function setVolume(vol) {
    currentVolume = Math.max(0, Math.min(1, vol));

    if (bgAudio) {
      bgAudio.volume = currentVolume;
    }
    if (synthGain && audioCtx) {
      synthGain.gain.setValueAtTime(currentVolume * 0.15, audioCtx.currentTime);
    }
    if (volumeSlider) {
      volumeSlider.value = currentVolume;
    }

    // Update volume icon
    if (volumeIcon) {
      let iconName = 'volume-2';
      if (currentVolume === 0) iconName = 'volume-x';
      else if (currentVolume < 0.4) iconName = 'volume-1';

      volumeIcon.innerHTML = `<i data-lucide="${iconName}" class="w-4 h-4 text-pink-300"></i>`;
      if (window.lucide) window.lucide.createIcons();
    }
  }

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', toggleMusic);
  }

  if (volumeSlider) {
    volumeSlider.value = currentVolume;
    volumeSlider.addEventListener('input', (e) => {
      setVolume(parseFloat(e.target.value));
    });
  }

  if (volumeUpBtn) {
    volumeUpBtn.addEventListener('click', () => {
      setVolume(currentVolume + 0.1);
    });
  }

  if (volumeDownBtn) {
    volumeDownBtn.addEventListener('click', () => {
      setVolume(currentVolume - 0.1);
    });
  }

  // Check if audio file fails to load
  if (bgAudio) {
    bgAudio.addEventListener('error', () => {
      console.log("music.mp3 not found yet; fallback melody will play smoothly when opened.");
    });
  }

  // -------------------------------------------------------------
  // "14 Reasons" Accordion / Interactive Tabs
  // -------------------------------------------------------------
  const reasonCards = document.querySelectorAll('.reason-card');
  reasonCards.forEach(card => {
    card.addEventListener('click', () => {
      const detail = card.querySelector('.reason-detail');
      const arrow = card.querySelector('.reason-arrow');
      if (detail) {
        detail.classList.toggle('hidden');
      }
      if (arrow) {
        arrow.classList.toggle('rotate-180');
      }
    });
  });

  // -------------------------------------------------------------
  // Ambient Romantic Particle Canvas (Dreamy soft bokeh / stardust)
  // -------------------------------------------------------------
  const canvas = document.getElementById('ambientCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 28;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.8 + 1.2;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = -(Math.random() * 0.4 + 0.2); // Float upwards
        this.alpha = Math.random() * 0.5 + 0.15;
        this.hue = Math.random() > 0.5 ? 325 : 275; // Blend Pink (325) & Purple (275)
        this.pulsateSpeed = Math.random() * 0.02 + 0.01;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha += Math.sin(Date.now() * this.pulsateSpeed * 0.05) * 0.005;

        // Reset if moved out of view
        if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
          this.reset();
          this.y = canvas.height + 10;
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 85%, 72%, ${Math.max(0.1, this.alpha)})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(${this.hue}, 90%, 65%, 0.8)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }
});
