/* ═══════════════════════════════════════════════════════════════
   NOEL DIGITAL AGENCY — CREATIVE FEATURES ENGINE
   Page transitions, Easter eggs, sound, chat, games, and more
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const $ = (s, p) => (p || document).querySelector(s);
  const $$ = (s, p) => [...(p || document).querySelectorAll(s)];

  /* ═══════════════════════════════════════════════════════════════
     1. PAGE MORPH TRANSITIONS — REMOVED (caused navigation failures)
     ═══════════════════════════════════════════════════════════════ */
  const pageTransition = {
    init() {}
  };

  /* ═══════════════════════════════════════════════════════════════
     2. EASTER EGG TERMINAL
     ═══════════════════════════════════════════════════════════════ */
  const terminal = {
    active: false,
    el: null,
    input: null,
    output: null,
    buffer: '',

    commands: {
      help: 'Available: help, about, projects, skills, contact, clear, surprise, matrix, exit',
      about: 'Noel Chakwenya — Digital Solutions Specialist from Zimbabwe.\nBuilding digital experiences since 2021.',
      projects: '4 Major Projects:\n1. Mimie\'s Hair — E-commerce Platform\n2. Extreme Fire Design — Agency Site\n3. SkyPath Airport UI — Airport Experience\n4. C.N. Cube Consulting — Business Platform',
      skills: 'React, Node.js, Python, UI/UX, Flutter, Firebase, PostgreSQL, Tailwind, Figma, Git',
      contact: 'Email: chakwenyanoel0@gmail.com\nPhone: +263 77 127 3169\nGitHub: noeljaywolf-create',
      surprise: '🎉 You found the secret terminal! You\'re clearly a person of culture. Want to work together? Hit that Contact button!',
      clear: '__CLEAR__',
      matrix: '__MATRIX__',
      exit: '__EXIT__'
    },

    init() {
      // Listen for "secret" typed anywhere
      document.addEventListener('keydown', e => {
        if (this.active && e.key !== 'F12' && !e.ctrlKey && !e.altKey && !e.metaKey) return;
        this.buffer += e.key.toLowerCase();
        if (this.buffer.length > 20) this.buffer = this.buffer.slice(-20);
        if (this.buffer.includes('secret')) {
          this.buffer = '';
          this.toggle();
        }
      });
    },

    toggle() {
      if (this.active) { this.close(); return; }
      this.active = true;

      this.el = document.createElement('div');
      this.el.className = 'ee-terminal';
      this.el.innerHTML = `
        <div class="ee-term-bar">
          <span class="ee-term-title">noel@agency:~</span>
          <button class="ee-term-close">&times;</button>
        </div>
        <div class="ee-term-output">
          <div class="ee-term-line accent">╔══════════════════════════════════╗</div>
          <div class="ee-term-line accent">║   NOEL DIGITAL AGENCY TERMINAL  ║</div>
          <div class="ee-term-line accent">║   Type 'help' for commands      ║</div>
          <div class="ee-term-line accent">╚══════════════════════════════════╝</div>
          <div class="ee-term-line">&nbsp;</div>
        </div>
        <div class="ee-term-input-row">
          <span class="ee-term-prompt">guest@noel:~$</span>
          <input class="ee-term-input" type="text" autofocus spellcheck="false" autocomplete="off">
        </div>
      `;
      document.body.appendChild(this.el);

      this.output = this.el.querySelector('.ee-term-output');
      this.input = this.el.querySelector('.ee-term-input');

      this.el.querySelector('.ee-term-close').addEventListener('click', () => this.close());
      this.input.addEventListener('keydown', e => {
        if (e.key === 'Enter') this.execute();
        if (e.key === 'Escape') this.close();
      });

      setTimeout(() => this.input.focus(), 100);
    },

    execute() {
      const cmd = this.input.value.trim().toLowerCase();
      this.input.value = '';
      this.addLine(`guest@noel:~$ ${cmd}`, 'cmd');

      if (!cmd) return;

      const result = this.commands[cmd];
      if (result === '__CLEAR__') {
        this.output.innerHTML = '';
      } else if (result === '__EXIT__') {
        this.close();
      } else if (result === '__MATRIX__') {
        this.addLine('Initializing matrix...', 'info');
        this.matrixEffect();
      } else if (result) {
        this.addLine(result, 'result');
      } else {
        this.addLine(`Command not found: ${cmd}. Type 'help' for available commands.`, 'error');
      }

      this.output.scrollTop = this.output.scrollHeight;
    },

    addLine(text, type) {
      const div = document.createElement('div');
      div.className = 'ee-term-line ' + type;
      div.textContent = text;
      this.output.appendChild(div);
    },

    matrixEffect() {
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()';
      let count = 0;
      const interval = setInterval(() => {
        let line = '';
        for (let i = 0; i < 40; i++) {
          line += chars[Math.floor(Math.random() * chars.length)];
        }
        this.addLine(line, 'matrix');
        count++;
        if (count > 15) clearInterval(interval);
        this.output.scrollTop = this.output.scrollHeight;
      }, 80);
    },

    close() {
      this.active = false;
      if (this.el) { this.el.remove(); this.el = null; }
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     3. DYNAMIC TIME-OF-DAY THEME
     ═══════════════════════════════════════════════════════════════ */
  const timeTheme = {
    init() {
      const hour = new Date().getHours();
      const root = document.documentElement;

      let phase, accentHue, bgTint;
      if (hour >= 5 && hour < 8) {
        phase = 'dawn'; accentHue = 30; bgTint = 'rgba(251,146,60,0.03)';
      } else if (hour >= 8 && hour < 17) {
        phase = 'day'; accentHue = 220; bgTint = 'rgba(59,130,246,0.02)';
      } else if (hour >= 17 && hour < 20) {
        phase = 'sunset'; accentHue = 25; bgTint = 'rgba(245,158,11,0.03)';
      } else {
        phase = 'night'; accentHue = 260; bgTint = 'rgba(192,200,216,0.02)';
      }

      root.setAttribute('data-time', phase);

      // Subtle accent shift
      if (phase === 'dawn' || phase === 'sunset') {
        root.style.setProperty('--accent', `hsl(${accentHue}, 80%, 60%)`);
        root.style.setProperty('--accent-l', `hsl(${accentHue}, 80%, 70%)`);
      }

      // Phase badge
      const badge = document.createElement('div');
      badge.className = 'time-badge';
      badge.textContent = { dawn: '🌅 Dawn Edition', day: '☀️ Daytime Mode', sunset: '🌇 Sunset Mode', night: '🌙 Night Mode' }[phase];
      badge.style.cssText = 'position:fixed;top:100px;right:16px;z-index:996;font-size:.6rem;padding:5px 10px;border-radius:100px;background:rgba(0,22,45,.7);backdrop-filter:blur(12px);color:var(--silver);border:1px solid rgba(255,255,255,.06);opacity:0;animation:badgeIn .5s 3s forwards;pointer-events:none;';
      document.body.appendChild(badge);

      const style = document.createElement('style');
      style.textContent = '@keyframes badgeIn{to{opacity:.7}}';
      document.head.appendChild(style);
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     4. BEFORE/AFTER PROJECT SLIDERS
     ═══════════════════════════════════════════════════════════════ */
  const beforeAfter = {
    init() {
      $$('.ba-slider').forEach(slider => {
        const before = slider.querySelector('.ba-before');
        const after = slider.querySelector('.ba-after');
        const handle = slider.querySelector('.ba-handle');
        if (!before || !after || !handle) return;

        let dragging = false;

        const update = (pct) => {
          const p = Math.max(0, Math.min(100, pct));
          before.style.clipPath = `inset(0 ${100 - p}% 0 0)`;
          handle.style.left = p + '%';
        };

        handle.addEventListener('mousedown', () => dragging = true);
        handle.addEventListener('touchstart', () => dragging = true);
        document.addEventListener('mouseup', () => dragging = false);
        document.addEventListener('touchend', () => dragging = false);

        const onMove = (x) => {
          if (!dragging) return;
          const rect = slider.getBoundingClientRect();
          const pct = ((x - rect.left) / rect.width) * 100;
          update(pct);
        };

        document.addEventListener('mousemove', e => onMove(e.clientX));
        document.addEventListener('touchmove', e => onMove(e.touches[0].clientX));

        // Click to jump
        slider.addEventListener('click', e => {
          const rect = slider.getBoundingClientRect();
          update(((e.clientX - rect.left) / rect.width) * 100);
        });

        update(50);
      });
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     5. INTERACTIVE PRICING ESTIMATOR
     ═══════════════════════════════════════════════════════════════ */
  const pricing = {
    init() {
      const section = $('#pricing-estimator');
      if (!section) return;

      const sliders = $$('.price-slider', section);
      const totalEl = $('.price-total', section);
      const breakdown = $('.price-breakdown', section);

      const services = {
        web: { label: 'Web Development', base: 40, per: 50 },
        app: { label: 'App Development', base: 120, per: 80 },
        design: { label: 'UI/UX Design', base: 50, per: 30 },
        marketing: { label: 'Digital Marketing', base: 40, per: 25 },
        writing: { label: 'Professional Writing', base: 20, per: 15 }
      };

      const update = () => {
        let total = 0;
        let html = '';
        sliders.forEach(slider => {
          const key = slider.dataset.service;
          const val = parseInt(slider.value);
          const svc = services[key];
          if (!svc) return;
          const cost = svc.base + svc.per * val;
          total += cost;
          const fill = ((val - slider.min) / (slider.max - slider.min)) * 100;
          slider.style.setProperty('--fill', fill + '%');
          // Update the adjacent price value
          const valEl = slider.parentElement.querySelector('.price-val');
          if (valEl) valEl.textContent = '$' + cost.toLocaleString();
          html += `<div class="price-row"><span>${svc.label}</span><span>$${cost.toLocaleString()}</span></div>`;
        });
        if (totalEl) totalEl.textContent = '$' + total.toLocaleString();
        if (breakdown) breakdown.innerHTML = html;
      };

      sliders.forEach(s => s.addEventListener('input', update));
      update();
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     6. SOUND DESIGN
     ═══════════════════════════════════════════════════════════════ */
  const sound = {
    ctx: null,
    enabled: true,

    init() {
      // Create toggle button
      const btn = document.createElement('button');
      btn.className = 'sound-toggle';
      btn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path class="sound-wave" d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';
      btn.style.cssText = 'position:fixed;bottom:28px;right:94px;z-index:998;width:44px;height:44px;background:var(--corp-navy);border:1px solid rgba(255,255,255,.06);border-radius:12px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--silver);transition:all .3s';
      btn.addEventListener('click', () => {
        this.enabled = !this.enabled;
        btn.style.opacity = this.enabled ? '1' : '.4';
        btn.querySelector('.sound-wave').style.display = this.enabled ? '' : 'none';
      });
      document.body.appendChild(btn);

      // Init AudioContext on first interaction
      const initAudio = () => {
        if (this.ctx) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        document.removeEventListener('click', initAudio);
      };
      document.addEventListener('click', initAudio);

      // Hover sounds
      $$('.btn, a, button, .svc-card, .port-card').forEach(el => {
        el.addEventListener('mouseenter', () => this.play('hover'));
      });

      // Click sounds
      document.addEventListener('click', e => {
        if (e.target.closest('.ee-terminal')) return;
        this.play('click');
      });
    },

    play(type) {
      if (!this.enabled || !this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      if (type === 'hover') {
        osc.frequency.value = 800;
        gain.gain.value = 0.02;
        osc.type = 'sine';
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
        osc.stop(this.ctx.currentTime + 0.08);
      } else if (type === 'click') {
        osc.frequency.value = 600;
        gain.gain.value = 0.03;
        osc.type = 'sine';
        osc.start();
        osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
        osc.stop(this.ctx.currentTime + 0.1);
      }
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     7. 3D PROJECT SHOWCASE
     ═══════════════════════════════════════════════════════════════ */
  const showcase3d = {
    init() {
      $$('.port-card').forEach(card => {
        card.style.transformStyle = 'preserve-3d';
        card.style.perspective = '1000px';

        const img = card.querySelector('img');
        const overlay = card.querySelector('.port-overlay');

        card.addEventListener('mousemove', e => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;

          const rx = y * -15;
          const ry = x * 15;

          card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.04)`;

          if (img) {
            img.style.transform = `translateZ(20px) scale(1.05)`;
          }
          if (overlay) {
            overlay.style.transform = `translateZ(30px)`;
          }

          // Dynamic shadow
          const shadowX = -ry * 3;
          const shadowY = rx * 3;
          card.style.boxShadow = `${shadowX}px ${shadowY}px 60px rgba(0,0,0,0.4), ${shadowX/2}px ${shadowY/2}px 20px rgba(192,200,216,0.1)`;
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
          card.style.boxShadow = '';
          if (img) img.style.transform = '';
          if (overlay) overlay.style.transform = '';
        });
      });
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     8. LIVE CHAT WIDGET
     ═══════════════════════════════════════════════════════════════ */
  const chat = {
    el: null,
    open: false,

    responses: {
      'hello': 'Hey there! 👋 Welcome to Noel Digital Agency. How can we help you today?',
      'hi': 'Hi! Thanks for reaching out. What project do you have in mind?',
      'price': 'Our projects typically range from $500 - $5,000 depending on scope. Want a custom quote?',
      'quote': 'I\'d love to give you a quote! Head to our Contact page or WhatsApp us at +263771273169 📱',
      'services': 'We offer: Web Dev, App Dev, UI/UX Design, Digital Marketing, and Professional Writing. All under one roof! 🏠',
      'portfolio': 'Check out our latest work: Mimie\'s Hair, Extreme Fire Design, SkyPath Airport UI, and C.N. Cube Consulting!',
      'contact': 'Reach us at chakwenyanoel0@gmail.com or WhatsApp +263771273169. We respond within 24 hours!',
      'help': 'I can tell you about our services, pricing, portfolio, or help you get a quote. Just ask!',
      'default': 'Great question! For detailed info, visit our Contact page or WhatsApp us directly. We\'d love to chat! 💬'
    },

    init() {
      this.el = document.createElement('div');
      this.el.className = 'chat-widget';
      this.el.innerHTML = `
        <div class="chat-bubble" id="chatBubble">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div class="chat-window" id="chatWindow">
          <div class="chat-header">
            <div class="chat-avatar-wrap">
              <img src="loggo.png" alt="Noel" class="chat-avatar">
              <span class="chat-online"></span>
            </div>
            <div>
              <div class="chat-name">Noel Digital Agency</div>
              <div class="chat-status">Usually replies instantly</div>
            </div>
            <button class="chat-close" id="chatClose">&times;</button>
          </div>
          <div class="chat-messages" id="chatMessages">
            <div class="chat-msg bot">
              <div class="chat-msg-text">Hey there! 👋 Welcome to Noel Digital Agency. How can we help you today?</div>
            </div>
          </div>
          <div class="chat-input-row">
            <input type="text" class="chat-input" id="chatInput" placeholder="Type a message..." autocomplete="off">
            <button class="chat-send" id="chatSend">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(this.el);

      const bubble = $('#chatBubble');
      const win = $('#chatWindow');
      const close = $('#chatClose');
      const input = $('#chatInput');
      const send = $('#chatSend');
      const messages = $('#chatMessages');

      bubble.addEventListener('click', () => {
        this.open = !this.open;
        win.classList.toggle('open', this.open);
        if (this.open) input.focus();
      });

      close.addEventListener('click', () => {
        this.open = false;
        win.classList.remove('open');
      });

      const respond = (text) => {
        const lower = text.toLowerCase();
        let response = this.responses.default;
        for (const [key, val] of Object.entries(this.responses)) {
          if (key !== 'default' && lower.includes(key)) {
            response = val;
            break;
          }
        }
        // Typing indicator
        const typing = document.createElement('div');
        typing.className = 'chat-msg bot';
        typing.innerHTML = '<div class="chat-msg-text typing"><span></span><span></span><span></span></div>';
        messages.appendChild(typing);
        messages.scrollTop = messages.scrollHeight;

        setTimeout(() => {
          typing.remove();
          const msg = document.createElement('div');
          msg.className = 'chat-msg bot';
          msg.innerHTML = `<div class="chat-msg-text">${response}</div>`;
          messages.appendChild(msg);
          messages.scrollTop = messages.scrollHeight;
        }, 800 + Math.random() * 600);
      };

      const sendMsg = () => {
        const text = input.value.trim();
        if (!text) return;
        input.value = '';

        const msg = document.createElement('div');
        msg.className = 'chat-msg user';
        msg.innerHTML = `<div class="chat-msg-text">${text}</div>`;
        messages.appendChild(msg);
        messages.scrollTop = messages.scrollHeight;

        respond(text);
      };

      send.addEventListener('click', sendMsg);
      input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMsg(); });
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     9. HIDDEN MINI-GAME (Snake on footer logo)
     ═══════════════════════════════════════════════════════════════ */
  const miniGame = {
    active: false,
    canvas: null,
    ctx: null,
    snake: [],
    food: null,
    dir: { x: 1, y: 0 },
    score: 0,
    interval: null,

    init() {
      const logos = $$('.ft-brand img');
      logos.forEach(logo => {
        logo.style.cursor = 'pointer';
        logo.title = 'Click me... if you dare 🐍';
        logo.addEventListener('click', (e) => {
          if (e.shiftKey) this.start();
        });
      });
    },

    start() {
      if (this.active) return;
      this.active = true;
      this.snake = [{ x: 10, y: 10 }];
      this.food = { x: 15, y: 10 };
      this.dir = { x: 1, y: 0 };
      this.score = 0;

      this.canvas = document.createElement('canvas');
      this.canvas.width = 300;
      this.canvas.height = 300;
      this.canvas.style.cssText = 'position:fixed;inset:0;margin:auto;z-index:99999;border-radius:16px;border:2px solid rgba(192,200,216,.3);background:rgba(0,22,45,.95);backdrop-filter:blur(20px);box-shadow:0 0 80px rgba(192,200,216,.2);';
      document.body.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');

      // Close button
      const close = document.createElement('button');
      close.textContent = '✕';
      close.style.cssText = 'position:fixed;top:calc(50% - 166px);right:calc(50% - 150px);z-index:100000;background:rgba(192,200,216,.3);border:none;color:white;width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:14px;';
      close.addEventListener('click', () => this.stop());
      document.body.appendChild(close);
      this._closeBtn = close;

      document.addEventListener('keydown', this._keyHandler = (e) => {
        if (e.key === 'ArrowUp' && this.dir.y !== 1) this.dir = { x: 0, y: -1 };
        if (e.key === 'ArrowDown' && this.dir.y !== -1) this.dir = { x: 0, y: 1 };
        if (e.key === 'ArrowLeft' && this.dir.x !== 1) this.dir = { x: -1, y: 0 };
        if (e.key === 'ArrowRight' && this.dir.x !== -1) this.dir = { x: 1, y: 0 };
        if (e.key === 'Escape') this.stop();
      });

      this.interval = setInterval(() => this.tick(), 120);
    },

    tick() {
      const head = { x: this.snake[0].x + this.dir.x, y: this.snake[0].y + this.dir.y };

      // Wrap
      if (head.x < 0) head.x = 19;
      if (head.x > 19) head.x = 0;
      if (head.y < 0) head.y = 19;
      if (head.y > 19) head.y = 0;

      // Self collision
      if (this.snake.some(s => s.x === head.x && s.y === head.y)) {
        this.stop();
        return;
      }

      this.snake.unshift(head);

      if (head.x === this.food.x && head.y === this.food.y) {
        this.score += 10;
        this.food = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
      } else {
        this.snake.pop();
      }

      this.draw();
    },

    draw() {
      const ctx = this.ctx;
      const s = 15;
      ctx.clearRect(0, 0, 300, 300);

      // Grid
      ctx.strokeStyle = 'rgba(255,255,255,.03)';
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.moveTo(i * s, 0);
        ctx.lineTo(i * s, 300);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * s);
        ctx.lineTo(300, i * s);
        ctx.stroke();
      }

      // Snake
      this.snake.forEach((seg, i) => {
        const alpha = 1 - (i / this.snake.length) * 0.5;
        ctx.fillStyle = i === 0 ? '#C0C8D8' : `rgba(192,200,216,${alpha})`;
        ctx.shadowColor = '#C0C8D8';
        ctx.shadowBlur = i === 0 ? 10 : 0;
        ctx.beginPath();
        ctx.roundRect(seg.x * s + 1, seg.y * s + 1, s - 2, s - 2, 3);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Food
      ctx.fillStyle = '#EC4899';
      ctx.shadowColor = '#EC4899';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(this.food.x * s + s / 2, this.food.y * s + s / 2, s / 2 - 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Score
      ctx.fillStyle = '#B3B3B6';
      ctx.font = '600 12px Inter, sans-serif';
      ctx.fillText(`Score: ${this.score}`, 10, 290);
    },

    stop() {
      this.active = false;
      clearInterval(this.interval);
      if (this.canvas) { this.canvas.remove(); this.canvas = null; }
      if (this._closeBtn) { this._closeBtn.remove(); this._closeBtn = null; }
      document.removeEventListener('keydown', this._keyHandler);
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     10. SCROLL-DRIVEN STORY (Homepage)
     ═══════════════════════════════════════════════════════════════ */
  const scrollStory = {
    init() {
      if (!$('.hero-stats')) return; // Only on homepage

      // Parallax sections — each section transforms as you scroll
      $$('.sec').forEach((sec, i) => {
        sec.style.transition = 'transform 0.1s linear';
        const obs = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'none';
            }
          });
        }, { threshold: 0.05 });
        sec.style.opacity = '0';
        sec.style.transform = 'translateY(40px)';
        obs.observe(sec);
      });

      // Hero parallax fade on scroll
      const hero = $('.hero');
      if (hero) {
        window.addEventListener('scroll', () => {
          const y = window.scrollY;
          const opacity = Math.max(0, 1 - y / 600);
          const scale = 1 + y * 0.0002;
          const heroText = hero.querySelector('.hero-text');
          if (heroText) {
            heroText.style.opacity = opacity;
            heroText.style.transform = `scale(${scale}) translateY(${y * 0.15}px)`;
          }
        }, { passive: true });
      }
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     CSS INJECTION
     ═══════════════════════════════════════════════════════════════ */
  function injectCSS() {
    const style = document.createElement('style');
    style.textContent = `
      /* ── Page Morph ── */
      .page-morph{position:fixed;inset:0;z-index:99998;pointer-events:none;display:flex;align-items:center;justify-content:center}
      .morph-circle{width:0;height:0;background:var(--grad);border-radius:50%;transition:all .5s cubic-bezier(.77,0,.175,1)}
      .page-morph.active .morph-circle{width:300vmax;height:300vmax}
      .page-morph.entering .morph-circle{width:300vmax;height:300vmax;animation:morphOut .6s .1s forwards}
      @keyframes morphOut{to{width:0;height:0;opacity:0}}

      /* ── Terminal ── */
      .ee-terminal{position:fixed;bottom:20px;right:20px;width:420px;max-width:90vw;height:320px;background:rgba(0,10,20,.96);border:1px solid rgba(192,200,216,.2);border-radius:16px;z-index:100000;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.5),0 0 40px rgba(192,200,216,.1);animation:termIn .3s ease-out;font-family:'SF Mono','Fira Code',monospace}
      @keyframes termIn{from{opacity:0;transform:translateY(20px) scale(.95)}to{opacity:1;transform:none}}
      .ee-term-bar{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:rgba(255,255,255,.04);border-bottom:1px solid rgba(255,255,255,.06)}
      .ee-term-title{font-size:.72rem;color:var(--silver)}
      .ee-term-close{background:none;border:none;color:var(--silver);cursor:pointer;font-size:1.1rem;padding:2px 6px;border-radius:6px;transition:background .2s}
      .ee-term-close:hover{background:rgba(255,255,255,.08)}
      .ee-term-output{flex:1;overflow-y:auto;padding:12px 14px;font-size:.72rem;line-height:1.6;color:var(--silver)}
      .ee-term-output::-webkit-scrollbar{width:4px}
      .ee-term-output::-webkit-scrollbar-thumb{background:rgba(192,200,216,.3);border-radius:4px}
      .ee-term-line.accent{color:#C0C8D8}
      .ee-term-line.cmd{color:#60A5FA}
      .ee-term-line.result{color:#22C55E}
      .ee-term-line.error{color:#EF4444}
      .ee-term-line.matrix{color:#22C55E;font-size:.6rem;opacity:.7}
      .ee-term-input-row{display:flex;align-items:center;gap:8px;padding:8px 14px;border-top:1px solid rgba(255,255,255,.06)}
      .ee-term-prompt{font-size:.72rem;color:#C0C8D8;white-space:nowrap}
      .ee-term-input{flex:1;background:transparent;border:none;color:var(--white);font-family:inherit;font-size:.72rem;outline:none}

      /* ── Chat Widget ── */
      .chat-widget{position:fixed;bottom:28px;right:28px;z-index:997}
      .chat-bubble{width:56px;height:56px;background:var(--grad);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;color:white;box-shadow:0 4px 20px rgba(192,200,216,.35);transition:all .3s}
      .chat-bubble:hover{transform:scale(1.1);box-shadow:0 6px 28px rgba(192,200,216,.5)}
      .chat-window{position:absolute;bottom:70px;right:0;width:340px;height:420px;background:rgba(0,15,30,.97);border:1px solid rgba(255,255,255,.08);border-radius:20px;display:flex;flex-direction:column;overflow:hidden;opacity:0;visibility:hidden;transform:translateY(10px) scale(.95);transition:all .3s cubic-bezier(.16,1,.3,1);backdrop-filter:blur(20px);box-shadow:0 20px 60px rgba(0,0,0,.4)}
      .chat-window.open{opacity:1;visibility:visible;transform:none}
      .chat-header{display:flex;align-items:center;gap:10px;padding:14px;border-bottom:1px solid rgba(255,255,255,.06)}
      .chat-avatar-wrap{position:relative}
      .chat-avatar{width:36px;height:36px;border-radius:10px;object-fit:cover}
      .chat-online{position:absolute;bottom:-1px;right:-1px;width:10px;height:10px;background:#22C55E;border-radius:50%;border:2px solid rgba(0,15,30,.97)}
      .chat-name{font-weight:700;font-size:.82rem;color:var(--white)}
      .chat-status{font-size:.65rem;color:var(--grey)}
      .chat-close{margin-left:auto;background:none;border:none;color:var(--silver);cursor:pointer;font-size:1.2rem;padding:4px;border-radius:6px;transition:background .2s}
      .chat-close:hover{background:rgba(255,255,255,.08)}
      .chat-messages{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px}
      .chat-messages::-webkit-scrollbar{width:3px}
      .chat-messages::-webkit-scrollbar-thumb{background:rgba(192,200,216,.2);border-radius:3px}
      .chat-msg{max-width:85%}
      .chat-msg.bot .chat-msg-text{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.04);padding:10px 14px;border-radius:14px 14px 14px 4px;font-size:.8rem;color:var(--silver);line-height:1.5}
      .chat-msg.user{align-self:flex-end}
      .chat-msg.user .chat-msg-text{background:var(--grad);padding:10px 14px;border-radius:14px 14px 4px 14px;font-size:.8rem;color:white;line-height:1.5}
      .typing{display:flex;gap:4px;padding:12px 16px}
      .typing span{width:6px;height:6px;background:var(--silver);border-radius:50%;animation:typingBounce .6s ease-in-out infinite}
      .typing span:nth-child(2){animation-delay:.15s}
      .typing span:nth-child(3){animation-delay:.3s}
      @keyframes typingBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
      .chat-input-row{display:flex;gap:8px;padding:12px;border-top:1px solid rgba(255,255,255,.06)}
      .chat-input{flex:1;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:10px 14px;color:var(--white);font-size:.8rem;outline:none;transition:border-color .2s}
      .chat-input:focus{border-color:rgba(192,200,216,.3)}
      .chat-input::placeholder{color:var(--grey)}
      .chat-send{background:var(--grad);border:none;color:white;width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:transform .2s}
      .chat-send:hover{transform:scale(1.08)}

      /* ── Sound Toggle ── */
      .sound-toggle:hover{border-color:rgba(255,255,255,.12);transform:translateY(-2px)}

      /* ── Time Badge ── */
      @media(max-width:768px){
        .ee-terminal{width:100%;height:60vh;bottom:0;right:0;border-radius:20px 20px 0 0}
        .chat-window{width:100%;right:0;bottom:0;height:70vh;border-radius:20px 20px 0 0}
        .chat-widget{bottom:96px;right:16px}
        .time-badge{display:none!important}
      }
    `;
    document.head.appendChild(style);
  }

  /* ═══════════════════════════════════════════════════════════════
     11. BLOG READ MORE TOGGLE
     ═══════════════════════════════════════════════════════════════ */
  function toggleBlog(e, link) {
    e.preventDefault();
    const card = link.closest('.blog-card');
    const content = card.querySelector('.blog-content');
    if (!content) return;
    const isOpen = content.classList.contains('open');
    // Close any other open cards first
    $$('.blog-card.expanded').forEach(c => {
      if (c !== card) {
        const cc = c.querySelector('.blog-content');
        const cl = c.querySelector('.blog-read');
        if (cc) { cc.classList.remove('open'); cc.style.maxHeight = '0'; }
        if (cl) cl.textContent = 'Read More →';
        c.classList.remove('expanded');
      }
    });
    if (isOpen) {
      content.classList.remove('open');
      content.style.maxHeight = '0';
      link.textContent = 'Read More →';
      card.classList.remove('expanded');
    } else {
      card.classList.add('expanded');
      content.classList.add('open');
      content.style.maxHeight = content.scrollHeight + 'px';
      link.textContent = 'Show Less ↑';
      setTimeout(() => {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }
  window.toggleBlog = toggleBlog;

  /* ═══════════════════════════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════════════════════════ */
  function init() {
    injectCSS();
    pageTransition.init();
    terminal.init();
    timeTheme.init();
    beforeAfter.init();
    pricing.init();
    sound.init();
    showcase3d.init();
    chat.init();
    miniGame.init();
    scrollStory.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
