/* -------------------------------------------------------------------------- */
/* SPIDER-TECH PRODUCT DETAIL PAGE (PDP) - MAIN LOGIC                         */
/* -------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 0. THEME SWITCHER LOGIC (DARK -> LIGHT -> CYBER NEON)
  // --------------------------------------------------------------------------
  const themeBtn = document.getElementById('theme-toggle-btn');
  const themes = ['dark', 'light', 'cyber'];
  let currentThemeIndex = 0;

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      currentThemeIndex = (currentThemeIndex + 1) % themes.length;
      const newTheme = themes[currentThemeIndex];
      document.documentElement.setAttribute('data-theme', newTheme);

      if (newTheme === 'dark') {
        themeBtn.innerHTML = '<span id="theme-icon">🌙</span> Dark';
      } else if (newTheme === 'light') {
        themeBtn.innerHTML = '<span id="theme-icon">☀️</span> Light';
      } else {
        themeBtn.innerHTML = '<span id="theme-icon">⚡</span> Cyber';
      }

      playPopSound();
    });
  }

  // --------------------------------------------------------------------------
  // 1. UNIFORM GALLERY THUMBNAIL SELECTOR (PURE PRODUCT IMAGES)
  // --------------------------------------------------------------------------
  const thumbnails = document.querySelectorAll('.thumb-item');
  const mainImg = document.getElementById('pdp-main-img');

  thumbnails.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      thumbnails.forEach((t) => t.classList.remove('active'));
      thumb.classList.add('active');

      const src = thumb.getAttribute('data-src');
      playPopSound();

      if (mainImg && src) {
        mainImg.style.opacity = '0.4';
        setTimeout(() => {
          mainImg.src = src;
          mainImg.style.opacity = '1';
        }, 120);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 2. PINCODE CHECKER & AUTO-FETCH CITY & STATE API
  // --------------------------------------------------------------------------
  const pincodeBtn = document.getElementById('pincode-btn');
  const pincodeInputPDP = document.getElementById('pincode-input');
  const pincodeMsgPDP = document.getElementById('pincode-msg');

  if (pincodeBtn) {
    pincodeBtn.addEventListener('click', () => {
      const code = pincodeInputPDP.value.trim();
      if (code.length >= 6) {
        pincodeMsgPDP.textContent = `✓ FREE Delivery to ${code} by Tomorrow, 3 PM! Cash on Delivery Available.`;
        pincodeMsgPDP.style.color = '#22c55e';
        playPopSound();
      } else {
        pincodeMsgPDP.textContent = '❌ Please enter a valid 6-digit Pincode.';
        pincodeMsgPDP.style.color = '#ff3366';
      }
    });
  }

  // AUTO-FETCH CITY & STATE IN ORDER MODAL FORM (INDIA POST API)
  const formPincode = document.getElementById('form-pincode');
  const formCity = document.getElementById('form-city');
  const formState = document.getElementById('form-state');
  const pincodeLoader = document.getElementById('pincode-loader');

  if (formPincode) {
    formPincode.addEventListener('input', async () => {
      const code = formPincode.value.trim();
      if (code.length === 6 && /^\d+$/.test(code)) {
        if (pincodeLoader) {
          pincodeLoader.textContent = '🔍 Fetching...';
          pincodeLoader.style.color = '#00d2ff';
          pincodeLoader.style.display = 'inline';
        }
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${code}`);
          const data = await res.json();
          if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
            const po = data[0].PostOffice[0];
            if (formCity) formCity.value = po.District || po.Block || po.Name;
            if (formState) formState.value = po.State;
            if (pincodeLoader) {
              pincodeLoader.textContent = '✓ City & State Auto-filled!';
              pincodeLoader.style.color = '#22c55e';
            }
            playPopSound();
          } else {
            if (pincodeLoader) {
              pincodeLoader.textContent = '❌ Invalid Pincode';
              pincodeLoader.style.color = '#ff3366';
            }
          }
        } catch (err) {
          console.error('Error fetching pincode:', err);
          if (pincodeLoader) pincodeLoader.style.display = 'none';
        }
      } else {
        if (pincodeLoader) pincodeLoader.style.display = 'none';
      }
    });
  }

  // Quantity Selector Pricing (1 Set: 499, 2 Sets: 599, 3 Sets: 699)
  const qtySelect = document.getElementById('qty-selector');
  const orderPriceDisplay = document.getElementById('order-price-display');
  const orderTotalDisplay = document.getElementById('order-total-display');

  if (qtySelect) {
    qtySelect.addEventListener('change', () => {
      const qty = parseInt(qtySelect.value);
      let total = 499;
      if (qty === 2) total = 599;
      if (qty === 3) total = 699;

      if (orderPriceDisplay) orderPriceDisplay.textContent = `₹${total}`;
      if (orderTotalDisplay) orderTotalDisplay.textContent = `₹${total}`;
      playPopSound();
    });
  }

  // --------------------------------------------------------------------------
  // 3. TABS SWITCHER (SPECS / DESC / SAFETY)
  // --------------------------------------------------------------------------
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('active'));
      tabContents.forEach((c) => c.style.display = 'none');

      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      const targetContent = document.getElementById(tabId);
      if (targetContent) targetContent.style.display = 'block';
      playPopSound();
    });
  });

  // --------------------------------------------------------------------------
  // 4. WEB AUDIO SYNTHESIZER FOR SOUND EFFECTS
  // --------------------------------------------------------------------------
  let soundEnabled = true;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
  }

  function playThwipSound() {
    if (!soundEnabled) return;
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const now = audioCtx.currentTime;
    
    const bufferSize = audioCtx.sampleRate * 0.15;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(3200, now + 0.12);
    filter.Q.setValueAtTime(3, now);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    whiteNoise.start(now);

    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.12);

    oscGain.gain.setValueAtTime(0.3, now);
    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(oscGain);
    oscGain.connect(audioCtx.destination);
    osc.start(now);
  }

  function playPopSound() {
    if (!soundEnabled) return;
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);

    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
  }

  const soundBtn = document.getElementById('sound-toggle-btn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      const icon = document.getElementById('sound-icon');
      if (soundEnabled) {
        icon.textContent = '🔊';
        soundBtn.innerHTML = '<span id="sound-icon">🔊</span> ON';
        playPopSound();
      } else {
        soundBtn.innerHTML = '<span id="sound-icon">🔇</span> OFF';
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. TARGET SHOOTER GAME CANVAS
  // --------------------------------------------------------------------------
  const gameContainer = document.getElementById('game-container');
  const gameCanvas = document.getElementById('game-canvas');
  if (gameContainer && gameCanvas) {
    const gCtx = gameCanvas.getContext('2d');
    let gWidth = (gameCanvas.width = gameContainer.clientWidth);
    let gHeight = (gameCanvas.height = gameContainer.clientHeight);

    let score = 0;
    let dartsFired = 0;
    const scoreEl = document.getElementById('game-score');
    const dartsEl = document.getElementById('darts-fired');

    const targets = [
      { x: 80, y: 100, vx: 2, vy: 1, radius: 28, label: '🟢 GOBLIN', color: '#22c55e' },
      { x: gWidth - 100, y: 140, vx: -2.2, vy: -1.2, radius: 32, label: '🕷️ VENOM', color: '#a855f7' },
      { x: gWidth / 2, y: 80, vx: 1.8, vy: -1.5, radius: 26, label: '🐙 DOC OCK', color: '#eab308' }
    ];

    const flyingDarts = [];
    const stuckDarts = [];

    function fireDartAtTarget(targetX, targetY) {
      const startX = gWidth / 2;
      const startY = gHeight;
      playThwipSound();
      dartsFired++;
      if (dartsEl) dartsEl.textContent = dartsFired;

      flyingDarts.push({ x: startX, y: startY, targetX, targetY, progress: 0, speed: 0.08 });
    }

    gameCanvas.addEventListener('click', (e) => {
      const rect = gameCanvas.getBoundingClientRect();
      fireDartAtTarget(e.clientX - rect.left, e.clientY - rect.top);
    });

    gameCanvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        const rect = gameCanvas.getBoundingClientRect();
        fireDartAtTarget(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
      }
    }, { passive: true });

    function updateGame() {
      gCtx.clearRect(0, 0, gWidth, gHeight);

      targets.forEach((t) => {
        t.x += t.vx;
        t.y += t.vy;
        if (t.x - t.radius < 0 || t.x + t.radius > gWidth) t.vx *= -1;
        if (t.y - t.radius < 40 || t.y + t.radius > gHeight - 100) t.vy *= -1;

        gCtx.save();
        gCtx.beginPath();
        gCtx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
        gCtx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        gCtx.fill();
        gCtx.lineWidth = 3;
        gCtx.strokeStyle = t.color;
        gCtx.stroke();

        gCtx.font = 'bold 11px Orbitron, sans-serif';
        gCtx.fillStyle = t.color;
        gCtx.textAlign = 'center';
        gCtx.textBaseline = 'middle';
        gCtx.fillText(t.label, t.x, t.y);
        gCtx.restore();
      });

      for (let i = flyingDarts.length - 1; i >= 0; i--) {
        const d = flyingDarts[i];
        d.progress += d.speed;

        const curX = d.x + (d.targetX - d.x) * d.progress;
        const curY = d.y + (d.targetY - d.y) * d.progress;

        gCtx.beginPath();
        gCtx.moveTo(d.x, d.y);
        gCtx.lineTo(curX, curY);
        gCtx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        gCtx.lineWidth = 2;
        gCtx.stroke();

        gCtx.beginPath();
        gCtx.arc(curX, curY, 7, 0, Math.PI * 2);
        gCtx.fillStyle = '#00d2ff';
        gCtx.fill();
        gCtx.strokeStyle = '#fff';
        gCtx.stroke();

        targets.forEach((t) => {
          const dist = Math.hypot(curX - t.x, curY - t.y);
          if (dist < t.radius + 8) {
            playPopSound();
            score += 100;
            if (scoreEl) scoreEl.textContent = score;
            t.vx *= -1.2;
            t.vy *= -1.2;
            stuckDarts.push({ x: curX, y: curY, alpha: 1.0 });
            flyingDarts.splice(i, 1);
          }
        });

        if (d.progress >= 1.0) {
          playPopSound();
          stuckDarts.push({ x: d.targetX, y: d.targetY, alpha: 1.0 });
          flyingDarts.splice(i, 1);
        }
      }

      for (let i = stuckDarts.length - 1; i >= 0; i--) {
        const s = stuckDarts[i];
        s.alpha -= 0.015;
        if (s.alpha <= 0) {
          stuckDarts.splice(i, 1);
          continue;
        }

        gCtx.save();
        gCtx.globalAlpha = s.alpha;
        gCtx.beginPath();
        gCtx.arc(s.x, s.y, 9, 0, Math.PI * 2);
        gCtx.fillStyle = 'rgba(0, 210, 255, 0.85)';
        gCtx.fill();
        gCtx.lineWidth = 2;
        gCtx.strokeStyle = '#ffffff';
        gCtx.stroke();
        gCtx.restore();
      }

      requestAnimationFrame(updateGame);
    }
    updateGame();
  }

  // --------------------------------------------------------------------------
  // 6. STICKY BAR & DIRECT WHATSAPP CHECKOUT FORM (NUMBER: 9328856046)
  // --------------------------------------------------------------------------
  const stickyBar = document.getElementById('sticky-buy-bar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) stickyBar.classList.add('visible');
    else stickyBar.classList.remove('visible');
  });

  const modal = document.getElementById('order-modal');
  const closeBtn = document.getElementById('close-modal');
  const modalTriggers = document.querySelectorAll('.trigger-order-modal');

  modalTriggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      modal.classList.add('active');
      playThwipSound();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  const payOpts = document.querySelectorAll('.payment-option');
  payOpts.forEach((opt) => {
    opt.addEventListener('click', () => {
      payOpts.forEach((o) => o.classList.remove('selected'));
      opt.classList.add('selected');
      playPopSound();
    });
  });

  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formName = document.getElementById('form-name');
      const formPhone = document.getElementById('form-phone');
      const formPincode = document.getElementById('form-pincode');
      const formCity = document.getElementById('form-city');
      const formState = document.getElementById('form-state');
      const formAddress = document.getElementById('form-address');

      const name = formName ? formName.value.trim() : 'Customer';
      const phone = formPhone ? formPhone.value.trim() : 'N/A';
      const pincode = formPincode ? formPincode.value.trim() : 'N/A';
      const city = formCity ? formCity.value.trim() : 'N/A';
      const state = formState ? formState.value.trim() : 'N/A';
      const address = formAddress ? formAddress.value.trim() : 'N/A';
      
      const selectedPay = document.querySelector('.payment-option.selected');
      const payMethod = selectedPay ? selectedPay.textContent.trim() : '💵 Cash on Delivery';
      
      const qtySelect = document.getElementById('qty-selector');
      const qtyText = qtySelect ? qtySelect.options[qtySelect.selectedIndex].text : '1 Set - ₹499';
      
      const orderTotalDisplay = document.getElementById('order-total-display');
      const total = orderTotalDisplay ? orderTotalDisplay.textContent.trim() : '₹499';

      const waNumber = '919328856046';
      
      const message = `🛒 *NEW ORDER RECEIVED - SPIDER-MAN STORE* 🕷️\n\n` +
        `👤 *Customer Name:* ${name}\n` +
        `📞 *Mobile Number:* ${phone}\n` +
        `📍 *Address:* ${address}\n` +
        `🏙️ *City/District:* ${city}\n` +
        `🗺️ *State:* ${state}\n` +
        `📌 *Pincode:* ${pincode}\n` +
        `📦 *Product:* Spider Web Shooter Hero Launcher Set\n` +
        `🔢 *Quantity:* ${qtyText}\n` +
        `💵 *Total Amount:* ${total} (${payMethod})\n\n` +
        `⚡ *Please confirm my order and send dispatch details!*`;

      const encodedMsg = encodeURIComponent(message);
      const waUrl = `https://wa.me/${waNumber}?text=${encodedMsg}`;

      if (window.confetti) {
        confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });
      }
      playThwipSound();

      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 400);

      modal.classList.remove('active');
      checkoutForm.reset();
      if (pincodeLoader) pincodeLoader.style.display = 'none';
    });
  }

});
