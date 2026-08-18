/* ═══════════════════════════════════════════════════════════════
   NOEL DIGITAL AGENCY — ADVANCED EFFECTS ENGINE
   A never-before-seen combination of effects
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Helpers ── */
  const $ = (s, p) => (p || document).querySelector(s);
  const $$ = (s, p) => [...(p || document).querySelectorAll(s)];
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
  const rand = (lo, hi) => Math.random() * (hi - lo) + lo;

  /* ── State ── */
  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, sx: 0, sy: 0 };
  const scroll = { y: 0, pct: 0, direction: 0, last: 0 };
  let raf;

  /* ═══════════════════════════════════════════════════════════════
     1. MAGNETIC CURSOR WITH PHYSICS
     ═══════════════════════════════════════════════════════════════ */
  const cursor = {
    dot: null, ring: null, trail: [], trailPool: [],
    pos: { x: 0, y: 0 }, vel: { x: 0, y: 0 },
    magnetic: null, magneticStrength: 0,

    init() {
      this.dot = $('#cursorDot');
      this.ring = $('#cursorRing');
      if (!this.dot || !this.ring) return;

      // Create trail dots
      for (let i = 0; i < 8; i++) {
        const d = document.createElement('div');
        d.className = 'cursor-trail-dot';
        d.style.cssText = `position:fixed;width:${8 - i}px;height:${8 - i}px;background:rgba(192,200,216,${0.5 - i * 0.06});border-radius:50%;pointer-events:none;z-index:99996;transform:translate(-50%,-50%);will-change:transform;`;
        document.body.appendChild(d);
        this.trail.push({ el: d, x: mouse.x, y: mouse.y });
      }

      document.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      });

      // Magnetic hover detection
      const magnetics = $$('a, button, .btn, .tilt, .svc-card, .port-card, .w-card, .test-card, .proc-card, .why-item, .cta-box, .tech-col');
      magnetics.forEach(el => {
        el.addEventListener('mouseenter', () => {
          this.magnetic = el;
          this.ring.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
          this.magnetic = null;
          this.magneticStrength = 0;
          this.ring.classList.remove('hover');
          el.style.transform = '';
        });
        el.addEventListener('mousemove', e => {
          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = e.clientX - cx;
          const dy = e.clientY - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = Math.max(rect.width, rect.height) * 0.7;
          if (dist < maxDist) {
            const str = (1 - dist / maxDist) * 0.35;
            el.style.transform = `translate(${dx * str}px, ${dy * str}px)`;
          }
        });
      });
    },

    update() {
      if (!this.dot || !this.ring) return;

      // Physics-based follow
      const targetX = mouse.x;
      const targetY = mouse.y;
      const spring = 0.15;
      const friction = 0.7;

      this.vel.x = (this.vel.x + (targetX - this.pos.x) * spring) * friction;
      this.vel.y = (this.vel.y + (targetY - this.pos.y) * spring) * friction;

      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;

      this.dot.style.left = this.pos.x + 'px';
      this.dot.style.top = this.pos.y + 'px';
      this.ring.style.left = lerp(this.ring.offsetLeft || this.pos.x, targetX, 0.08) + 'px';
      this.ring.style.top = lerp(this.ring.offsetTop || this.pos.y, targetY, 0.08) + 'px';

      // Trail physics
      let prevX = this.pos.x, prevY = this.pos.y;
      this.trail.forEach((t, i) => {
        t.x = lerp(t.x, prevX, 0.35 - i * 0.02);
        t.y = lerp(t.y, prevY, 0.35 - i * 0.02);
        t.el.style.left = t.x + 'px';
        t.el.style.top = t.y + 'px';
        prevX = t.x;
        prevY = t.y;
      });
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     2. SCROLL-TRIGGERED PARTICLE CANVAS
     ═══════════════════════════════════════════════════════════════ */
  const particles = {
    canvas: null, ctx: null, list: [], w: 0, h: 0,

    init() {
      this.canvas = document.createElement('canvas');
      this.canvas.className = 'fx-particles';
      this.canvas.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;opacity:0;transition:opacity .8s;';
      document.body.prepend(this.canvas);
      this.ctx = this.canvas.getContext('2d');
      this.resize();

      for (let i = 0; i < 50; i++) {
        this.list.push({
          x: rand(0, this.w), y: rand(0, this.h),
          vx: rand(-0.3, 0.3), vy: rand(-0.2, 0.2),
          r: rand(1, 2.5), a: rand(0.15, 0.5),
          hue: rand(220, 280)
        });
      }

      window.addEventListener('resize', () => this.resize());
    },

    resize() {
      this.w = this.canvas.width = window.innerWidth;
      this.h = this.canvas.height = window.innerHeight;
    },

    update() {
      const visible = scroll.y > 100;
      this.canvas.style.opacity = visible ? '1' : '0';
      if (!visible) return;

      this.ctx.clearRect(0, 0, this.w, this.h);

      this.list.forEach(p => {
        // Mouse repulsion
        const dx = p.x - mouse.sx;
        const dy = p.y - mouse.sy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150 * 0.8;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;
        p.vy *= 0.99;

        if (p.x < 0) p.x = this.w;
        if (p.x > this.w) p.x = 0;
        if (p.y < 0) p.y = this.h;
        if (p.y > this.h) p.y = 0;

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        this.ctx.fillStyle = `hsla(${p.hue}, 70%, 70%, ${p.a})`;
        this.ctx.fill();
      });

      // Connection lines
      for (let i = 0; i < this.list.length; i++) {
        for (let j = i + 1; j < this.list.length; j++) {
          const a = this.list[i], b = this.list[j];
          const d = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
          if (d < 120) {
            this.ctx.beginPath();
            this.ctx.moveTo(a.x, a.y);
            this.ctx.lineTo(b.x, b.y);
            this.ctx.strokeStyle = `rgba(192,200,216,${0.08 * (1 - d / 120)})`;
            this.ctx.lineWidth = 0.5;
            this.ctx.stroke();
          }
        }
      }
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     3. TEXT SCRAMBLE / GLITCH EFFECT
     ═══════════════════════════════════════════════════════════════ */
  const scramble = {
    chars: '!<>-_\\/[]{}—=+*^?#_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    queue: [],

    init() {
      $$('[data-scramble]').forEach(el => {
        el.dataset.original = el.textContent;
        el.dataset.scrambled = 'true';
      });
    },

    animate(el) {
      if (el.dataset.revealed === 'true') return;
      el.dataset.revealed = 'true';
      const original = el.dataset.original;
      const duration = 1200;
      const frameRate = 30;
      const totalFrames = duration / (1000 / frameRate);
      let frame = 0;

      const tick = () => {
        frame++;
        const progress = frame / totalFrames;
        let output = '';
        for (let i = 0; i < original.length; i++) {
          if (original[i] === ' ') { output += ' '; continue; }
          if (i / original.length < progress) {
            output += original[i];
          } else {
            output += this.chars[Math.floor(rand(0, this.chars.length))];
          }
        }
        el.textContent = output;
        if (frame < totalFrames) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = original;
        }
      };
      requestAnimationFrame(tick);
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     4. 3D PARALLAX DEPTH LAYERS
     ═══════════════════════════════════════════════════════════════ */
  const parallax = {
    layers: [],

    init() {
      $$('.hero-orb').forEach((orb, i) => {
        this.layers.push({ el: orb, depth: (i + 1) * 0.02, x: 0, y: 0 });
      });
      $$('.hero-ring').forEach((ring, i) => {
        this.layers.push({ el: ring, depth: (i + 1) * 0.015, x: 0, y: 0 });
      });
      // System visualization core
      const core = $('.sys-core');
      if (core) this.layers.push({ el: core, depth: 0.01, x: 0, y: 0 });
      const hex = $('.sys-hex');
      if (hex) this.layers.push({ el: hex, depth: 0.008, x: 0, y: 0 });
    },

    update() {
      const mx = (mouse.x / window.innerWidth - 0.5) * 2;
      const my = (mouse.y / window.innerHeight - 0.5) * 2;

      this.layers.forEach(l => {
        l.x = lerp(l.x, mx * l.depth * 100, 0.05);
        l.y = lerp(l.y, my * l.depth * 100, 0.05);
        l.el.style.transform = `translate(${l.x}px, ${l.y}px)`;
      });
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     5. HOLOGRAPHIC SHIMMER ON CARDS
     ═══════════════════════════════════════════════════════════════ */
  const holo = {
    init() {
      $$('.svc-card, .port-card, .w-card, .test-card, .proc-card, .cta-box, .why-item, .tech-col').forEach(card => {
        card.addEventListener('mousemove', e => {
          const rect = card.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          card.style.setProperty('--holo-x', x + '%');
          card.style.setProperty('--holo-y', y + '%');
          card.classList.add('holo-active');
        });
        card.addEventListener('mouseleave', () => {
          card.classList.remove('holo-active');
        });
      });
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     6. SCROLL-TRIGGERED STAGGERED REVEALS
     ═══════════════════════════════════════════════════════════════ */
  const reveals = {
    init() {
      // Add reveal classes to all major elements
      $$('.svc-card, .port-card, .w-card, .test-card, .proc-card, .why-item, .tech-col, .cta-box, .ft-grid > div, .proc-step, .hero-stat, .abt-photo, .abt-text').forEach((el, i) => {
        if (!el.classList.contains('reveal')) {
          el.classList.add('reveal');
          el.style.transitionDelay = (i % 6) * 0.08 + 's';
        }
      });

      $$('.sec-head').forEach(el => {
        el.dataset.scramble = '';
      });

      const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('vis');
            // Trigger scramble on headings
            const heading = entry.target.querySelector('[data-scramble]');
            if (heading) scramble.animate(heading);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      $$('.reveal, .sec-head').forEach(el => obs.observe(el));
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     7. NOISE / FILM GRAIN OVERLAY
     ═══════════════════════════════════════════════════════════════ */
  const grain = {
    canvas: null, ctx: null,

    init() {
      this.canvas = document.createElement('canvas');
      this.canvas.style.cssText = 'position:fixed;inset:0;z-index:9998;pointer-events:none;opacity:0.035;mix-blend-mode:overlay;';
      this.canvas.width = 256;
      this.canvas.height = 256;
      this.ctx = this.canvas.getContext('2d');
      document.body.appendChild(this.canvas);
      this.render();
    },

    render() {
      const img = this.ctx.createImageData(256, 256);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 255;
        img.data[i] = v;
        img.data[i + 1] = v;
        img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      this.ctx.putImageData(img, 0, 0);
      requestAnimationFrame(() => this.render());
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     8. SMOOTH SCROLL PROGRESS
     ═══════════════════════════════════════════════════════════════ */
  const progressBar = {
    el: null,

    init() {
      this.el = document.createElement('div');
      this.el.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,#C0C8D8,#D8DDE8,#8892A4);z-index:10001;width:0%;transition:none;will-change:width;';
      document.body.appendChild(this.el);
    },

    update() {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? (scroll.y / h) * 100 : 0;
      this.el.style.width = pct + '%';
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     9. TILT 3D CARDS (enhanced)
     ═══════════════════════════════════════════════════════════════ */
  const tilt = {
    init() {
      $$('.tilt, .svc-card, .port-card, .w-card, .test-card, .proc-card, .cta-box, .why-item, .tech-col').forEach(card => {
        card.style.transformStyle = 'preserve-3d';
        card.style.transition = 'transform 0.15s ease-out, box-shadow 0.15s ease-out';

        card.addEventListener('mousemove', e => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const cx = rect.width / 2;
          const cy = rect.height / 2;
          const rx = (y - cy) / cy * -6;
          const ry = (x - cx) / cx * 6;

          card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(12px) scale(1.02)`;
          card.style.boxShadow = `${-ry * 2}px ${rx * 2}px 40px rgba(0,0,0,0.25)`;
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
          card.style.boxShadow = '';
        });
      });
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     10. DYNAMIC GRADIENT BACKGROUND
     ═══════════════════════════════════════════════════════════════ */
  const gradient = {
    el: null, hue: 0,

    init() {
      this.el = document.createElement('div');
      this.el.style.cssText = 'position:fixed;inset:0;z-index:-1;pointer-events:none;transition:opacity .5s;';
      this.el.className = 'fx-gradient-bg';
      document.body.prepend(this.el);

      // CSS for the gradient
      const style = document.createElement('style');
      style.textContent = `
        .fx-gradient-bg {
          background: radial-gradient(ellipse 80% 60% at 20% 40%, rgba(0,22,45,0.9) 0%, transparent 70%),
                      radial-gradient(ellipse 60% 50% at 80% 60%, rgba(192,200,216,0.08) 0%, transparent 60%),
                      radial-gradient(ellipse 50% 40% at 50% 80%, rgba(59,130,246,0.05) 0%, transparent 50%),
                      var(--dark-navy, #001327);
        }
        .fx-gradient-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(192,200,216,0.06) 0%, transparent 40%);
          pointer-events: none;
        }
      `;
      document.head.appendChild(style);
    },

    update() {
      const mx = (mouse.x / window.innerWidth * 100).toFixed(1);
      const my = (mouse.y / window.innerHeight * 100).toFixed(1);
      this.el.style.setProperty('--mx', mx + '%');
      this.el.style.setProperty('--my', my + '%');
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     11. ANIMATED COUNTERS (enhanced with easing)
     ═══════════════════════════════════════════════════════════════ */
  const counters = {
    counted: false,

    init() {
      // Delay until preloader is gone, then check immediately + on scroll
      const check = () => {
        if (this.counted) return;
        $$('.counter').forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            this.counted = true;
            this.animate(el);
          }
        });
      };

      // Start checking after preloader finishes
      setTimeout(() => {
        check();
        window.addEventListener('scroll', check, { passive: true });
      }, 1500);
    },

    animate(el) {
      const target = +el.dataset.target;
      const duration = 2200;
      const start = performance.now();

      const easeOutExpo = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

      const tick = now => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        el.textContent = Math.floor(easeOutExpo(progress) * target);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     12. SECTION LABEL ANIMATIONS
     ═══════════════════════════════════════════════════════════════ */
  const sectionLabels = {
    init() {
      $$('.sec-label').forEach(el => {
        const obs = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              el.style.opacity = '1';
              el.style.transform = 'none';
            }
          });
        }, { threshold: 0.5 });
        el.style.opacity = '0';
        el.style.transform = 'translateX(-10px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        obs.observe(el);
      });
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     13. PORTFOLIO CARD HOVER INTENSITY
     ═══════════════════════════════════════════════════════════════ */
  const portCards = {
    init() {
      $$('.port-card').forEach(card => {
        const img = card.querySelector('img');
        if (!img) return;

        card.addEventListener('mousemove', e => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = (e.clientY - rect.top) / rect.height;
          const rotateX = (y - 0.5) * -12;
          const rotateY = (x - 0.5) * 12;

          img.style.transform = `scale(1.08) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
          img.style.filter = 'brightness(1.1) saturate(1.2)';
        });

        card.addEventListener('mouseleave', () => {
          img.style.transform = '';
          img.style.filter = '';
        });
      });
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     14. SMOOTH NAV INDICATOR
     ═══════════════════════════════════════════════════════════════ */
  const navIndicator = {
    el: null,

    init() {
      this.el = document.createElement('div');
      this.el.className = 'nav-indicator';
      const style = document.createElement('style');
      style.textContent = `
        .nav-indicator {
          position: absolute;
          height: 3px;
          background: var(--grad);
          border-radius: 3px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
          opacity: 0;
          bottom: 0;
        }
        .nav-indicator.visible { opacity: 1; }
      `;
      document.head.appendChild(style);

      const nav = $('.topnav');
      if (!nav) return;
      nav.style.position = 'relative';
      nav.appendChild(this.el);

      const updateIndicator = (el) => {
        if (!el) { this.el.classList.remove('visible'); return; }
        const rect = el.getBoundingClientRect();
        const navRect = nav.getBoundingClientRect();
        this.el.style.left = (rect.left - navRect.left) + 'px';
        this.el.style.width = rect.width + 'px';
        this.el.classList.add('visible');
      };

      nav.querySelectorAll('a').forEach(a => {
        a.addEventListener('mouseenter', () => updateIndicator(a));
        a.addEventListener('mouseleave', () => this.el.classList.remove('visible'));
      });
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     15. CURSOR TRAIL DOTS (enhanced)
     ═══════════════════════════════════════════════════════════════ */
  const cursorDots = {
    dots: [],

    init() {
      for (let i = 0; i < 5; i++) {
        const dot = document.createElement('div');
        dot.style.cssText = `position:fixed;width:${4 - i * 0.5}px;height:${4 - i * 0.5}px;background:rgba(192,200,216,${0.3 - i * 0.05});border-radius:50%;pointer-events:none;z-index:99995;transform:translate(-50%,-50%);will-change:left,top;`;
        document.body.appendChild(dot);
        this.dots.push({ el: dot, x: mouse.x, y: mouse.y });
      }
    },

    update() {
      let px = mouse.x, py = mouse.y;
      this.dots.forEach((d, i) => {
        d.x = lerp(d.x, px, 0.25 - i * 0.03);
        d.y = lerp(d.y, py, 0.25 - i * 0.03);
        d.el.style.left = d.x + 'px';
        d.el.style.top = d.y + 'px';
        px = d.x;
        py = d.y;
      });
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     16. TEXT REVEAL ON SCROLL (words animate in)
     ═══════════════════════════════════════════════════════════════ */
  const textReveal = {
    init() {
      $$('.hero h2, .hero h1, .abt-intro h2').forEach(el => {
        if (el.dataset.revealed) return;
        const text = el.innerHTML;
        // Wrap each word
        const wrapped = text.replace(/(\S+)/g, '<span class="word-wrap"><span class="word-inner">$1</span></span>');
        el.innerHTML = wrapped;
        el.classList.add('text-reveal-ready');

        const obs = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              el.querySelectorAll('.word-inner').forEach((w, i) => {
                setTimeout(() => w.classList.add('word-vis'), i * 80);
              });
              obs.disconnect();
            }
          });
        }, { threshold: 0.3 });
        obs.observe(el);
      });

      // Inject CSS
      const style = document.createElement('style');
      style.textContent = `
        .word-wrap { display: inline-block; overflow: hidden; vertical-align: bottom; }
        .word-inner { display: inline-block; transform: translateY(110%); transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .word-inner.word-vis { transform: translateY(0); }
      `;
      document.head.appendChild(style);
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     MAIN LOOP
     ═══════════════════════════════════════════════════════════════ */
  function tick() {
    scroll.y = window.scrollY;
    scroll.pct = scroll.y / (document.documentElement.scrollHeight - window.innerHeight);
    scroll.direction = scroll.y > scroll.last ? 1 : -1;
    scroll.last = scroll.y;

    mouse.sx = lerp(mouse.sx, mouse.x, 0.1);
    mouse.sy = lerp(mouse.sy, mouse.y, 0.1);

    cursor.update();
    particles.update();
    parallax.update();
    gradient.update();
    progressBar.update();
    cursorDots.update();

    raf = requestAnimationFrame(tick);
  }

  /* ═══════════════════════════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════════════════════════ */
  function init() {
    cursor.init();
    particles.init();
    parallax.init();
    holo.init();
    reveals.init();
    grain.init();
    progressBar.init();
    tilt.init();
    gradient.init();
    counters.init();
    sectionLabels.init();
    portCards.init();
    navIndicator.init();
    cursorDots.init();
    textReveal.init();
    scramble.init();

    raf = requestAnimationFrame(tick);
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
