/* -------------------------------------------------------------------------- */
/* SPIDER-TECH PRODUCT DETAIL PAGE (PDP) - MAIN LOGIC                         */
/* -------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 0. BACKGROUND INTERACTIVE ANIMATED CRAWLING SPIDERS CANVAS SYSTEM
  // --------------------------------------------------------------------------
  const spiderBgCanvas = document.getElementById('spider-bg-canvas');
  if (spiderBgCanvas) {
    const sCtx = spiderBgCanvas.getContext('2d');
    let width = (spiderBgCanvas.width = window.innerWidth);
    let height = (spiderBgCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = (spiderBgCanvas.width = window.innerWidth);
      height = (spiderBgCanvas.height = window.innerHeight);
    });

    const spiders = [];
    const spiderCount = window.innerWidth < 768 ? 22 : 38;

    for (let i = 0; i < spiderCount; i++) {
      spiders.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.6,
        vy: (Math.random() - 0.5) * 1.6,
        size: Math.random() * 8 + 14,
        angle: Math.random() * Math.PI * 2,
        legPhase: Math.random() * 10,
        color: Math.random() > 0.4 ? '#ff0033' : '#00d2ff',
        hasWebLine: Math.random() > 0.4
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function drawSpider(s) {
      sCtx.save();
      sCtx.translate(s.x, s.y);
      sCtx.rotate(s.angle + Math.PI / 2);

      if (s.hasWebLine && s.y > 0) {
        sCtx.save();
        sCtx.rotate(-(s.angle + Math.PI / 2));
        sCtx.beginPath();
        sCtx.moveTo(0, 0);
        sCtx.lineTo(0, -s.y);
        sCtx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
        sCtx.lineWidth = 0.9;
        sCtx.stroke();
        sCtx.restore();
      }

      sCtx.shadowBlur = 14;
      sCtx.shadowColor = s.color;

      sCtx.beginPath();
      sCtx.moveTo(0, s.size * 0.65);
      sCtx.lineTo(-s.size * 0.4, s.size * 0.2);
      sCtx.lineTo(-s.size * 0.45, -s.size * 0.2);
      sCtx.lineTo(0, -s.size * 0.55);
      sCtx.lineTo(s.size * 0.45, -s.size * 0.2);
      sCtx.lineTo(s.size * 0.4, s.size * 0.2);
      sCtx.closePath();

      sCtx.fillStyle = s.color === '#ff0033' ? 'rgba(230, 0, 45, 0.95)' : 'rgba(0, 210, 255, 0.95)';
      sCtx.fill();
      sCtx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      sCtx.lineWidth = 1.2;
      sCtx.stroke();

      sCtx.beginPath();
      sCtx.moveTo(0, -s.size * 0.35);
      sCtx.lineTo(-s.size * 0.18, 0);
      sCtx.lineTo(0, s.size * 0.35);
      sCtx.lineTo(s.size * 0.18, 0);
      sCtx.closePath();
      sCtx.fillStyle = '#ffffff';
      sCtx.fill();

      const eyeColor = s.color === '#ff0033' ? '#00d2ff' : '#ff0033';
      sCtx.fillStyle = eyeColor;
      sCtx.beginPath();
      sCtx.arc(-s.size * 0.15, -s.size * 0.5, s.size * 0.07, 0, Math.PI * 2);
      sCtx.arc(s.size * 0.15, -s.size * 0.5, s.size * 0.07, 0, Math.PI * 2);
      sCtx.arc(-s.size * 0.3, -s.size * 0.42, s.size * 0.05, 0, Math.PI * 2);
      sCtx.arc(s.size * 0.3, -s.size * 0.42, s.size * 0.05, 0, Math.PI * 2);
      sCtx.fill();

      sCtx.shadowBlur = 0;

      s.legPhase += 0.18;
      for (let side = -1; side <= 1; side += 2) {
        for (let i = 0; i < 4; i++) {
          const legOffset = i * 0.28;
          const legSwing = Math.sin(s.legPhase + legOffset) * 0.42;
          const baseAngle = (i - 1.5) * 0.42 + legSwing;

          const kneeX = side * (s.size * 1.0) * Math.cos(baseAngle);
          const kneeY = (s.size * 0.55) * Math.sin(baseAngle) + (i - 1.5) * (s.size * 0.2);

          const ankleX = side * (s.size * 1.5) * Math.cos(baseAngle + 0.3 * side);
          const ankleY = (s.size * 0.9) * Math.sin(baseAngle + 0.3 * side) + (i - 1.5) * (s.size * 0.1);

          sCtx.beginPath();
          sCtx.moveTo(0, (i - 1.5) * (s.size * 0.18));
          sCtx.lineTo(kneeX, kneeY);
          sCtx.lineTo(ankleX, ankleY);
          sCtx.strokeStyle = s.color;
          sCtx.lineWidth = 1.8;
          sCtx.stroke();

          sCtx.beginPath();
          sCtx.arc(kneeX, kneeY, s.size * 0.08, 0, Math.PI * 2);
          sCtx.fillStyle = '#ffffff';
          sCtx.fill();
        }
      }

      sCtx.restore();
    }

    function animateSpiders() {
      sCtx.clearRect(0, 0, width, height);

      spiders.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.angle = Math.atan2(s.vy, s.vx);

        if (Math.random() < 0.025) {
          s.vx += (Math.random() - 0.5) * 0.7;
          s.vy += (Math.random() - 0.5) * 0.7;
          
          const speed = Math.hypot(s.vx, s.vy);
          if (speed > 2.0) {
            s.vx = (s.vx / speed) * 2.0;
            s.vy = (s.vy / speed) * 2.0;
          }
        }

        const dx = s.x - mouseX;
        const dy = s.y - mouseY;
        const dist = Math.hypot(dx, dy);
        if (dist < 140) {
          s.vx += (dx / dist) * 0.45;
          s.vy += (dy / dist) * 0.45;
        }

        if (s.x < 10 || s.x > width - 10) s.vx *= -1;
        if (s.y < 10 || s.y > height - 10) s.vy *= -1;

        drawSpider(s);
      });

      requestAnimationFrame(animateSpiders);
    }

    animateSpiders();
  }

  // --------------------------------------------------------------------------
  // 1. THEME SWITCHER LOGIC (DARK -> LIGHT -> CYBER NEON)
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
  // 2. UNIFORM GALLERY THUMBNAIL SELECTOR (PURE PRODUCT IMAGES)
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
  // 3. PINCODE CHECKER & AUTO-FETCH CITY & STATE API
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

  // --------------------------------------------------------------------------
  // 4. STRICT INDIAN MOBILE NUMBER VALIDATION LOGIC
  // --------------------------------------------------------------------------
  const formPhone = document.getElementById('form-phone');
  const phoneValidationMsg = document.getElementById('phone-validation-msg');

  function isValidIndianMobile(mobile) {
    const cleanNum = mobile.trim();
    if (!/^\d+$/.test(cleanNum)) return false;
    if (cleanNum.length !== 10) return false;
    if (/^(\d)\1{9}$/.test(cleanNum)) return false;
    if (cleanNum === '1234567890' || cleanNum === '0123456789') return false;
    return /^[6-9]\d{9}$/.test(cleanNum);
  }

  if (formPhone) {
    formPhone.addEventListener('input', () => {
      const val = formPhone.value.trim();
      if (val.length === 0) {
        if (phoneValidationMsg) phoneValidationMsg.style.display = 'none';
        return;
      }

      if (isValidIndianMobile(val)) {
        if (phoneValidationMsg) {
          phoneValidationMsg.textContent = '✓ Valid Mobile';
          phoneValidationMsg.style.color = '#22c55e';
          phoneValidationMsg.style.display = 'inline';
        }
      } else {
        if (phoneValidationMsg) {
          phoneValidationMsg.textContent = '❌ Invalid Mobile (Start with 6-9)';
          phoneValidationMsg.style.color = '#ff3366';
          phoneValidationMsg.style.display = 'inline';
        }
      }
    });
  }

  // Quantity Selector Pricing for Pack of 2 (1 Pair: 599, 2 Pairs: 999, 3 Pairs: 1399)
  const qtySelect = document.getElementById('qty-selector');
  const orderPriceDisplay = document.getElementById('order-price-display');
  const orderTotalDisplay = document.getElementById('order-total-display');

  if (qtySelect) {
    qtySelect.addEventListener('change', () => {
      const qty = parseInt(qtySelect.value);
      let total = 599;
      if (qty === 2) total = 999;
      if (qty === 3) total = 1399;

      if (orderPriceDisplay) orderPriceDisplay.textContent = `₹${total}`;
      if (orderTotalDisplay) orderTotalDisplay.textContent = `₹${total}`;
      playPopSound();
    });
  }

  // --------------------------------------------------------------------------
  // 5. TABS SWITCHER (SPECS / DESC / SAFETY)
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
  // 6. ORIGINAL SPIDER-MAN "THWIP!" SOUND (AUTHENTIC TONE, TIGHT STOP, NO VIBRATION)
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
    const duration = 0.08;
    
    const bufferSize = Math.floor(audioCtx.sampleRate * duration);
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
    filter.frequency.exponentialRampToValueAtTime(3200, now + 0.07);
    filter.Q.setValueAtTime(3, now);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    
    whiteNoise.start(now);
    whiteNoise.stop(now + 0.08);

    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.07);

    oscGain.gain.setValueAtTime(0.25, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(oscGain);
    oscGain.connect(audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + 0.08);
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
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.05);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + 0.05);
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
  // 7. TARGET SHOOTER GAME CANVAS
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
  // 8. STICKY BAR & DIRECT FAST WHATSAPP CHECKOUT FORM
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
      const formPhoneInput = document.getElementById('form-phone');
      const formPincode = document.getElementById('form-pincode');
      const formCity = document.getElementById('form-city');
      const formState = document.getElementById('form-state');
      const formAddress = document.getElementById('form-address');

      const phoneVal = formPhoneInput ? formPhoneInput.value.trim() : '';
      
      // STRICT MOBILE NUMBER VALIDATION CHECK
      if (!isValidIndianMobile(phoneVal)) {
        alert('❌ INVALID MOBILE NUMBER!\n\nPlease enter a valid 10-digit Indian Mobile Number starting with 6, 7, 8, or 9.');
        if (formPhoneInput) formPhoneInput.focus();
        return;
      }

      const name = formName ? formName.value.trim() : 'Customer';
      const phone = phoneVal;
      const pincode = formPincode ? formPincode.value.trim() : 'N/A';
      const city = formCity ? formCity.value.trim() : 'N/A';
      const state = formState ? formState.value.trim() : 'N/A';
      const address = formAddress ? formAddress.value.trim() : 'N/A';
      
      const selectedPay = document.querySelector('.payment-option.selected');
      const payMethod = selectedPay ? selectedPay.textContent.trim() : '💵 Cash on Delivery';
      
      const qtySelect = document.getElementById('qty-selector');
      const qtyText = qtySelect ? qtySelect.options[qtySelect.selectedIndex].text : '1 Pair (Pack of 2 - Both Hands) - ₹599';
      
      const orderTotalDisplay = document.getElementById('order-total-display');
      const total = orderTotalDisplay ? orderTotalDisplay.textContent.trim() : '₹599';

      const waNumber = '919328856046';
      
      const message = `🛒 *NEW ORDER RECEIVED - SPIDER-MAN STORE* 🕷️\n\n` +
        `👤 *Customer Name:* ${name}\n` +
        `📞 *Mobile Number:* ${phone}\n` +
        `📍 *Address:* ${address}\n` +
        `🏙️ *City/District:* ${city}\n` +
        `🗺️ *State:* ${state}\n` +
        `📌 *Pincode:* ${pincode}\n` +
        `📦 *Product:* Spider Web Shooter Dual Launcher Set (Pack of 2 - Both Hands)\n` +
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
      if (phoneValidationMsg) phoneValidationMsg.style.display = 'none';
      if (pincodeLoader) pincodeLoader.style.display = 'none';
    });
  }

});
