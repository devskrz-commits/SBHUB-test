/* Collision-Based Real Physics 3D Snow, Interactive Girl & Dynamic Building Engine */
function initSnowEffect() {
  const canvas = document.getElementById('snowCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const colWidth = 4;
  let numCols = Math.ceil(width / colWidth);
  let groundHeights = new Float32Array(numCols).fill(0);

  let snowmanXRatio = 0.35 + Math.random() * 0.3;
  let snowmanVolume = 0;
  const maxSnowmanVolume = 450;
  let isMelting = false;
  let meltTimer = 0;
  let hasDecorations = false;

  // Persistence Engine
  function loadSnowState() {
    const saved = localStorage.getItem('sbhub_snow_data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.groundHeights && Array.isArray(data.groundHeights)) {
          const oldArr = data.groundHeights;
          for (let i = 0; i < numCols; i++) {
            const srcIdx = Math.floor((i / numCols) * oldArr.length);
            groundHeights[i] = oldArr[srcIdx] || 0;
          }
        }
        if (typeof data.snowmanVolume === 'number') snowmanVolume = data.snowmanVolume;
        if (typeof data.snowmanXRatio === 'number') snowmanXRatio = data.snowmanXRatio;
        if (typeof data.hasDecorations === 'boolean') hasDecorations = data.hasDecorations;
      } catch (e) {}
    }
  }

  function saveSnowState() {
    const data = {
      groundHeights: Array.from(groundHeights),
      snowmanVolume: snowmanVolume,
      snowmanXRatio: snowmanXRatio,
      hasDecorations: hasDecorations
    };
    localStorage.setItem('sbhub_snow_data', JSON.stringify(data));
  }

  loadSnowState();
  window.addEventListener('beforeunload', saveSnowState);

  // Mouse Sensing Engine
  let isMouseActive = false;
  let mouseTimer = null;
  window.addEventListener('mousemove', () => {
    isMouseActive = true;
    clearTimeout(mouseTimer);
    mouseTimer = setTimeout(() => { isMouseActive = false; }, 2200);
  });

  // 3D Parallax Snowflakes
  const numFlakes = 110;
  const flakes = Array.from({ length: numFlakes }, () => ({
    x: Math.random() * width,
    y: Math.random() * (height * 0.8),
    r: Math.random() * 2.5 + 1.2,
    z: Math.random() * 0.9 + 0.3,
    d: Math.random() * 0.8 + 0.4,
    opacity: Math.random() * 0.6 + 0.4,
    sway: Math.random() * Math.PI * 2,
    swaySpeed: Math.random() * 0.02 + 0.01
  }));

  // Lively Girl Character Engine
  const girl = {
    x: 60,
    targetX: 60,
    state: 'ROAMING', // ROAMING, ROLL_SNOW, FETCH_ITEMS, DECORATING, WAVING, ADMIRING
    prevState: 'ROAMING',
    timer: 0,
    frame: 0,
    speed: 1.6,
    facingRight: true,
    carryingSnow: false,
    snowBallRadius: 0
  };

  function getNewSnowmanXRatio() {
    let newRatio;
    do { newRatio = 0.25 + Math.random() * 0.5; } while (Math.abs(newRatio - snowmanXRatio) < 0.25);
    return newRatio;
  }

  function handleFlakeCollision(f) {
    let col = Math.floor(f.x / colWidth);
    if (col < 0) col = 0; if (col >= numCols) col = numCols - 1;
    let currentGroundY = height - groundHeights[col];

    if (f.y >= currentGroundY) {
      if (!isMelting && groundHeights[col] < 55) {
        groundHeights[col] += 0.4 * f.z;
        if (col > 0) groundHeights[col - 1] += 0.2 * f.z;
        if (col < numCols - 1) groundHeights[col + 1] += 0.2 * f.z;
      }
      f.y = -10; f.x = Math.random() * width;
    }
  }

  // Render 3D Snowman
  function drawSnowman(x, baseY, volume, meltRatio) {
    if (volume <= 0) return;
    ctx.save();
    
    const buildProgress = Math.min(1.0, volume / maxSnowmanVolume);
    const bottomMaxR = 38; const middleMaxR = 26; const headMaxR = 17;
    const bottomR = Math.min(bottomMaxR, buildProgress * 2.2 * bottomMaxR);
    const middleR = buildProgress > 0.25 ? Math.min(middleMaxR, (buildProgress - 0.25) * 2.2 * middleMaxR) : 0;
    const headR = buildProgress > 0.55 ? Math.min(headMaxR, (buildProgress - 0.55) * 2.2 * headMaxR) : 0;
    const meltYOffset = meltRatio * 25;
    ctx.globalAlpha = Math.max(0, 1 - meltRatio * 0.9);

    const moundR = Math.max(bottomR * 1.3, 12);
    const moundGrad = ctx.createRadialGradient(x, baseY + 4, 2, x, baseY + 4, moundR);
    moundGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
    moundGrad.addColorStop(0.7, "rgba(226, 232, 240, 0.9)");
    moundGrad.addColorStop(1, "rgba(148, 163, 184, 0)");
    
    ctx.beginPath(); ctx.fillStyle = moundGrad;
    ctx.ellipse(x, baseY + 4, moundR * (1 + meltRatio * 0.6), (bottomR * 0.35) * (1 - meltRatio * 0.5), 0, 0, Math.PI * 2);
    ctx.fill();

    function draw3DSphere(cx, cy, radius, scaleY = 1) {
      const grad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, radius * 0.1, cx, cy, radius);
      grad.addColorStop(0, "#ffffff"); grad.addColorStop(0.65, "#f1f5f9");
      grad.addColorStop(0.9, "#cbd5e1"); grad.addColorStop(1, "#94a3b8");
      ctx.beginPath(); ctx.fillStyle = grad;
      ctx.arc(cx, cy, radius * scaleY, 0, Math.PI * 2); ctx.fill();
    }

    if (bottomR > 1) draw3DSphere(x, baseY - bottomR * 0.7 + meltYOffset * 0.3, bottomR, (1 - meltRatio * 0.3));

    if (middleR > 1) {
      const mY = baseY - bottomR * 1.3 - middleR * 0.7 + meltYOffset * 0.6;
      draw3DSphere(x, mY, middleR, (1 - meltRatio * 0.4));
      if (hasDecorations) {
        const armMelt = meltRatio * 18;
        ctx.strokeStyle = "#582f0e"; ctx.lineWidth = 3.5; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(x - middleR * 0.8, mY); ctx.lineTo(x - middleR - 22, mY - 12 + armMelt); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x + middleR * 0.8, mY); ctx.lineTo(x + middleR + 22, mY - 14 + armMelt); ctx.stroke();
      }
    }

    if (headR > 1) {
      const hY = baseY - bottomR * 1.3 - middleR * 1.3 - headR * 0.7 + meltYOffset;
      draw3DSphere(x, hY, headR, (1 - meltRatio * 0.5));
      if (buildProgress > 0.4) {
        ctx.fillStyle = "#0f172a";
        ctx.beginPath(); ctx.arc(x - 5, hY - 3, 2, 0, Math.PI * 2); ctx.arc(x + 5, hY - 3, 2, 0, Math.PI * 2); ctx.fill();
      }
      if (hasDecorations) {
        const carrotGrad = ctx.createLinearGradient(x, hY, x + 18, hY + 4);
        carrotGrad.addColorStop(0, "#fb923c"); carrotGrad.addColorStop(1, "#ea580c");
        ctx.fillStyle = carrotGrad;
        ctx.beginPath(); ctx.moveTo(x, hY); ctx.lineTo(x + 18, hY + 3 + meltRatio * 12); ctx.lineTo(x, hY + 5); ctx.closePath(); ctx.fill();
      }
    }
    ctx.restore();
  }

  // Draw Girl Character (Pink Headband, Purple Dress with Daisy)
  function drawGirl(x, y, state, frame, facingRight = true) {
    ctx.save();
    ctx.translate(x, y);
    if (!facingRight) ctx.scale(-1, 1);

    const isWalking = (state === 'ROAMING' || state === 'ROLL_SNOW' || state === 'FETCH_ITEMS');
    const legSwing = isWalking ? Math.sin(frame * 0.25) * 8 : 0;
    const armSwing = isWalking ? Math.sin(frame * 0.25) * 10 : 0;

    // Shadow
    ctx.fillStyle = "rgba(15, 23, 42, 0.28)";
    ctx.beginPath(); ctx.ellipse(0, 0, 14, 4.5, 0, 0, Math.PI * 2); ctx.fill();

    // Legs & Purple Shoes
    ctx.strokeStyle = "#fed7aa"; ctx.lineWidth = 4; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-3, -22); ctx.lineTo(-3 - legSwing, -4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(3, -22); ctx.lineTo(3 + legSwing, -4); ctx.stroke();

    ctx.fillStyle = "#7e22ce";
    ctx.beginPath(); ctx.arc(-3 - legSwing, -2, 4, 0, Math.PI * 2); ctx.arc(3 + legSwing, -2, 4, 0, Math.PI * 2); ctx.fill();

    // Purple Dress with Daisy
    ctx.fillStyle = "#a855f7";
    ctx.beginPath(); ctx.moveTo(0, -42); ctx.lineTo(-14, -20); ctx.quadraticCurveTo(0, -16, 14, -20); ctx.closePath(); ctx.fill();

    // Daisy Flower
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      ctx.beginPath(); ctx.arc(Math.cos(angle) * 3, -29 + Math.sin(angle) * 3, 2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = "#f59e0b"; ctx.beginPath(); ctx.arc(0, -29, 2, 0, Math.PI * 2); ctx.fill();

    // Head, Face & Blonde Hair
    ctx.fillStyle = "#fed7aa"; ctx.fillRect(-2, -46, 4, 6);
    ctx.beginPath(); ctx.arc(0, -54, 12, 0, Math.PI * 2); ctx.fill();

    // Eyes & Smile
    ctx.fillStyle = "#0f172a";
    ctx.beginPath(); ctx.arc(4, -56, 1.8, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#9a3412"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(4, -52, 3.2, 0.1, Math.PI - 0.2); ctx.stroke();

    // Hair
    ctx.fillStyle = "#facc15";
    ctx.beginPath(); ctx.arc(-2, -54, 15, Math.PI * 0.5, Math.PI * 1.8); ctx.fill();
    ctx.beginPath(); ctx.arc(3, -60, 9, 0, Math.PI); ctx.fill();

    // Pink Headband
    ctx.strokeStyle = "#ec4899"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, -56, 13, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();

    // Arms Animation & Pushing Objects
    ctx.strokeStyle = "#fed7aa"; ctx.lineWidth = 3.5;

    if (state === 'WAVING') {
      ctx.beginPath(); ctx.moveTo(-6, -40); ctx.lineTo(-10, -28); ctx.stroke();
      const waveAngle = Math.sin(frame * 0.35) * 0.5;
      ctx.beginPath(); ctx.moveTo(6, -40); ctx.lineTo(14 + waveAngle * 10, -58 + Math.cos(waveAngle) * 5); ctx.stroke();
      ctx.fillStyle = "#fed7aa"; ctx.beginPath(); ctx.arc(14 + waveAngle * 10, -58 + Math.cos(waveAngle) * 5, 2.5, 0, Math.PI * 2); ctx.fill();
    } else if (state === 'ROLL_SNOW') {
      // Pushing Snowball Forward
      ctx.beginPath(); ctx.moveTo(2, -38); ctx.lineTo(14, -28); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-2, -38); ctx.lineTo(12, -24); ctx.stroke();

      // Pushed Rolling Snowball
      const sR = Math.min(18, 6 + girl.snowBallRadius);
      const grad = ctx.createRadialGradient(18 + sR, -sR + 4, 2, 18 + sR, -sR + 4, sR);
      grad.addColorStop(0, "#ffffff"); grad.addColorStop(0.8, "#cbd5e1");
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(18 + sR, -sR + 4, sR, 0, Math.PI * 2); ctx.fill();
    } else if (state === 'FETCH_ITEMS') {
      ctx.beginPath(); ctx.moveTo(-4, -40); ctx.lineTo(-4 - armSwing, -28); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(4, -40); ctx.lineTo(12, -32); ctx.stroke();
      ctx.fillStyle = "#f97316"; ctx.fillRect(12, -35, 6, 3);
      ctx.strokeStyle = "#582f0e"; ctx.beginPath(); ctx.moveTo(14, -32); ctx.lineTo(18, -38); ctx.stroke();
    } else {
      ctx.beginPath(); ctx.moveTo(-4, -40); ctx.lineTo(-4 - armSwing, -28); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(4, -40); ctx.lineTo(4 + armSwing, -28); ctx.stroke();
    }

    ctx.restore();
  }

  // Intelligent State & Movement Machine
  function updateGirl(snowmanX) {
    girl.frame++;
    const siteX = snowmanX - 35;

    // React to Mouse Movement with Waving
    if (isMouseActive && girl.state !== 'WAVING') {
      girl.prevState = girl.state;
      girl.state = 'WAVING';
      girl.timer = 0;
    }

    if (girl.state === 'WAVING') {
      girl.timer++;
      if (girl.timer > 75 && !isMouseActive) {
        girl.state = girl.prevState || 'ROAMING';
        girl.timer = 0;
      }
      return;
    }

    // Snowman Building Progression Cycle
    if (snowmanVolume < maxSnowmanVolume) {
      if (girl.state === 'ROAMING' || girl.state === 'ADMIRING') {
        girl.state = 'ROLL_SNOW';
        girl.x = 40;
        girl.snowBallRadius = 2;
      }

      if (girl.state === 'ROLL_SNOW') {
        girl.facingRight = true;
        girl.snowBallRadius += 0.05;
        if (girl.x < siteX) {
          girl.x += girl.speed * 1.1;
        } else {
          // Delivered Snowball to Site
          snowmanVolume = Math.min(maxSnowmanVolume, snowmanVolume + 45);
          saveSnowState();
          girl.x = 40;
          girl.snowBallRadius = 2;

          if (snowmanVolume >= maxSnowmanVolume && !hasDecorations) {
            girl.state = 'FETCH_ITEMS';
            girl.x = 20;
          }
        }
      }
    } else if (!hasDecorations) {
      // Fetch Nose & Arms
      if (girl.state !== 'FETCH_ITEMS' && girl.state !== 'DECORATING') {
        girl.state = 'FETCH_ITEMS';
        girl.x = 20;
      }

      if (girl.state === 'FETCH_ITEMS') {
        girl.facingRight = true;
        if (girl.x < siteX) {
          girl.x += girl.speed;
        } else {
          girl.state = 'DECORATING';
          girl.timer = 0;
        }
      }

      if (girl.state === 'DECORATING') {
        girl.timer++;
        if (girl.timer > 50) {
          hasDecorations = true;
          saveSnowState();
          girl.state = 'ADMIRING';
          girl.timer = 0;
        }
      }
    } else {
      // Fully Built - Roam Dashboard
      if (girl.state === 'ADMIRING') {
        girl.timer++;
        if (girl.timer > 90) {
          girl.state = 'ROAMING';
          girl.targetX = Math.random() * (width - 120) + 40;
        }
      }

      if (girl.state === 'ROAMING') {
        if (Math.abs(girl.x - girl.targetX) > 5) {
          girl.facingRight = (girl.targetX > girl.x);
          girl.x += girl.facingRight ? girl.speed * 0.8 : -girl.speed * 0.8;
        } else {
          girl.timer++;
          if (girl.timer > 120) {
            girl.targetX = Math.random() * (width - 120) + 40;
            girl.timer = 0;
          }
        }
      }
    }
  }

  function drawGroundTerrain() {
    ctx.save();
    let maxH = 15;
    for (let c = 0; c < numCols; c++) { if (groundHeights[c] > maxH) maxH = groundHeights[c]; }

    const groundGrad = ctx.createLinearGradient(0, height - maxH - 10, 0, height);
    groundGrad.addColorStop(0, "#ffffff"); groundGrad.addColorStop(0.2, "#f1f5f9");
    groundGrad.addColorStop(0.65, "#cbd5e1"); groundGrad.addColorStop(1, "rgba(148, 163, 184, 0.95)");

    ctx.fillStyle = groundGrad; ctx.beginPath(); ctx.moveTo(0, height);
    for (let c = 0; c < numCols; c++) { ctx.lineTo(c * colWidth, height - groundHeights[c]); }
    ctx.lineTo(width, height); ctx.closePath(); ctx.fill();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.95)"; ctx.lineWidth = 2; ctx.beginPath();
    for (let c = 0; c < numCols; c++) {
      const h = height - groundHeights[c];
      if (c === 0) ctx.moveTo(0, h); else ctx.lineTo(c * colWidth, h);
    }
    ctx.stroke(); ctx.restore();
  }

  let saveCounter = 0;
  function render() {
    ctx.clearRect(0, 0, width, height);
    saveCounter++; if (saveCounter % 180 === 0) saveSnowState();

    if (snowmanVolume >= maxSnowmanVolume && !isMelting) {
      meltTimer++; if (meltTimer > 1200) isMelting = true;
    }

    let meltRatio = 0;
    if (isMelting) {
      meltTimer++; meltRatio = Math.min(1.0, (meltTimer - 1200) / 400);
      snowmanVolume = Math.max(0, maxSnowmanVolume * (1 - meltRatio));
      for (let c = 0; c < numCols; c++) groundHeights[c] *= 0.995;

      if (meltRatio >= 1.0) {
        isMelting = false; meltTimer = 0; snowmanVolume = 0;
        hasDecorations = false; girl.state = 'ROAMING';
        snowmanXRatio = getNewSnowmanXRatio(); saveSnowState();
      }
    }

    flakes.forEach((f) => {
      const size = f.r * f.z;
      const flakeGrad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, size);
      flakeGrad.addColorStop(0, `rgba(255, 255, 255, ${f.opacity})`);
      flakeGrad.addColorStop(0.5, `rgba(241, 245, 249, ${f.opacity * 0.7})`);
      flakeGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.beginPath(); ctx.fillStyle = flakeGrad;
      ctx.arc(f.x, f.y, size, 0, Math.PI * 2); ctx.fill();

      f.sway += f.swaySpeed; f.y += f.d * f.z;
      f.x += Math.sin(f.sway) * 0.4 * f.z;
      handleFlakeCollision(f);
    });

    drawGroundTerrain();

    const snowmanX = width * snowmanXRatio;
    const snowmanCol = Math.floor(snowmanX / colWidth);
    const groundY = height - (groundHeights[snowmanCol] || 0);

    drawSnowman(snowmanX, groundY, snowmanVolume, meltRatio);

    updateGirl(snowmanX);
    const girlCol = Math.floor(Math.max(0, girl.x) / colWidth);
    const girlGroundY = height - (groundHeights[girlCol] || 0);
    drawGirl(girl.x, girlGroundY, girl.state, girl.frame, girl.facingRight);

    requestAnimationFrame(render);
  }

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    numCols = Math.ceil(width / colWidth);
    const newGround = new Float32Array(numCols);
    for (let i = 0; i < numCols; i++) newGround[i] = groundHeights[i] || 0;
    groundHeights = newGround;
  });

  render();
}
