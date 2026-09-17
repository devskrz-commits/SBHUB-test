/* Collision-Based Real Physics Snow & Dynamic Snowman Building Engine with Persistence & Animated Girl */
function initSnowEffect() {
  const canvas = document.getElementById('snowCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const colWidth = 4;
  let numCols = Math.ceil(width / colWidth);
  let groundHeights = new Float32Array(numCols).fill(0);

  let snowmanXRatio = 0.25 + Math.random() * 0.5;
  let snowmanVolume = 0;
  const maxSnowmanVolume = 450;
  let isMelting = false;
  let meltTimer = 0;
  let hasDecorations = false;

  // 1. Persistence Engine: Load Saved Snow Data
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
      } catch (e) {
        console.error("Error loading snow state:", e);
      }
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

  const numFlakes = 80;
  const flakes = Array.from({ length: numFlakes }, () => ({
    x: Math.random() * width,
    y: Math.random() * (height * 0.8),
    r: Math.random() * 2.5 + 1.5,
    d: Math.random() * 0.9 + 0.4,
    opacity: Math.random() * 0.7 + 0.3,
    sway: Math.random() * Math.PI * 2
  }));

  // Girl Character State Engine
  const girl = {
    x: -50,
    state: 'IDLE', // IDLE, WALKING_TO, DECORATING, WAVING, WALKING_BACK, DONE
    timer: 0,
    frame: 0,
    speed: 1.2
  };

  function getNewSnowmanXRatio() {
    let newRatio;
    do {
      newRatio = 0.2 + Math.random() * 0.6;
    } while (Math.abs(newRatio - snowmanXRatio) < 0.25);
    return newRatio;
  }

  function handleFlakeCollision(f) {
    let col = Math.floor(f.x / colWidth);
    if (col < 0) col = 0;
    if (col >= numCols) col = numCols - 1;

    let currentGroundY = height - groundHeights[col];

    if (f.y >= currentGroundY) {
      if (!isMelting) {
        if (groundHeights[col] < 50) {
          groundHeights[col] += 0.6;
          if (col > 0) groundHeights[col - 1] += 0.3;
          if (col < numCols - 1) groundHeights[col + 1] += 0.3;
        }

        const snowmanCol = Math.floor((width * snowmanXRatio) / colWidth);
        if (Math.abs(col - snowmanCol) <= 12) {
          if (snowmanVolume < maxSnowmanVolume) {
            snowmanVolume += 0.8;
          }
        }
      }

      f.y = -10;
      f.x = Math.random() * width;
    }
  }

  function drawSnowman(x, baseY, volume, meltRatio) {
    if (volume <= 0) return;

    ctx.save();
    
    const buildProgress = Math.min(1.0, volume / maxSnowmanVolume);
    const bottomMaxR = 36;
    const middleMaxR = 25;
    const headMaxR = 16;

    const bottomR = Math.min(bottomMaxR, buildProgress * 2.2 * bottomMaxR);
    const middleR = buildProgress > 0.25 ? Math.min(middleMaxR, (buildProgress - 0.25) * 2.2 * middleMaxR) : 0;
    const headR = buildProgress > 0.55 ? Math.min(headMaxR, (buildProgress - 0.55) * 2.2 * headMaxR) : 0;

    const meltYOffset = meltRatio * 25;
    ctx.globalAlpha = Math.max(0, 1 - meltRatio * 0.9);

    // Base Mound
    const moundR = Math.max(bottomR * 1.3, 12);
    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.ellipse(x, baseY + 4, moundR * (1 + meltRatio * 0.6), (bottomR * 0.3) * (1 - meltRatio * 0.5), 0, 0, Math.PI * 2);
    ctx.fill();

    // Bottom Sphere
    if (bottomR > 1) {
      const bY = baseY - bottomR * 0.7 + meltYOffset * 0.3;
      ctx.beginPath();
      ctx.fillStyle = "#ffffff";
      ctx.arc(x, bY, bottomR * (1 - meltRatio * 0.3), 0, Math.PI * 2);
      ctx.fill();
    }

    // Middle Sphere & Stick Arms (Rendered only after Girl decorates)
    if (middleR > 1) {
      const mY = baseY - bottomR * 1.3 - middleR * 0.7 + meltYOffset * 0.6;
      ctx.beginPath();
      ctx.fillStyle = "#f8fafc";
      ctx.arc(x, mY, middleR * (1 - meltRatio * 0.4), 0, Math.PI * 2);
      ctx.fill();

      if (hasDecorations) {
        const armMelt = meltRatio * 18;
        ctx.strokeStyle = "#78350f";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x - middleR * 0.8, mY);
        ctx.lineTo(x - middleR - 20, mY - 10 + armMelt);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + middleR * 0.8, mY);
        ctx.lineTo(x + middleR + 20, mY - 12 + armMelt);
        ctx.stroke();
      }
    }

    // Head & Face (Carrot Nose rendered only after Girl decorates)
    if (headR > 1) {
      const hY = baseY - bottomR * 1.3 - middleR * 1.3 - headR * 0.7 + meltYOffset;
      ctx.beginPath();
      ctx.fillStyle = "#ffffff";
      ctx.arc(x, hY, headR * (1 - meltRatio * 0.5), 0, Math.PI * 2);
      ctx.fill();

      if (buildProgress > 0.5) {
        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.arc(x - 5, hY - 3, 2, 0, Math.PI * 2);
        ctx.arc(x + 5, hY - 3, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      if (hasDecorations) {
        ctx.fillStyle = "#f97316";
        ctx.beginPath();
        ctx.moveTo(x, hY);
        ctx.lineTo(x + 16, hY + 3 + meltRatio * 12);
        ctx.lineTo(x, hY + 5);
        ctx.closePath();
        ctx.fill();
      }
    }

    ctx.restore();
  }

  // Draw Animated Girl Character
  function drawGirl(x, y, state, frame, facingRight = true) {
    ctx.save();
    ctx.translate(x, y);
    if (!facingRight) ctx.scale(-1, 1);

    const legSwing = (state === 'WALKING_TO' || state === 'WALKING_BACK') ? Math.sin(frame * 0.2) * 8 : 0;
    const armSwing = (state === 'WALKING_TO' || state === 'WALKING_BACK') ? Math.sin(frame * 0.2) * 10 : 0;

    // Shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs & Shoes
    ctx.strokeStyle = "#fed7aa";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-3, -22); ctx.lineTo(-3 - legSwing, -4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(3, -22); ctx.lineTo(3 + legSwing, -4); ctx.stroke();

    ctx.fillStyle = "#7e22ce";
    ctx.beginPath(); ctx.arc(-3 - legSwing, -2, 4, 0, Math.PI * 2); ctx.arc(3 + legSwing, -2, 4, 0, Math.PI * 2); ctx.fill();

    // Purple Dress
    ctx.fillStyle = "#a855f7";
    ctx.beginPath();
    ctx.moveTo(0, -42);
    ctx.lineTo(-14, -20);
    ctx.quadraticCurveTo(0, -16, 14, -20);
    ctx.closePath();
    ctx.fill();

    // Flower on Dress
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      ctx.beginPath();
      ctx.arc(Math.cos(angle) * 3, -30 + Math.sin(angle) * 3, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath(); ctx.arc(0, -30, 2, 0, Math.PI * 2); ctx.fill();

    // Head, Face & Blonde Hair
    ctx.fillStyle = "#fed7aa";
    ctx.fillRect(-2, -46, 4, 6);
    ctx.beginPath(); ctx.arc(0, -54, 12, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "#0f172a";
    ctx.beginPath(); ctx.arc(4, -56, 1.8, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#9a3412"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(4, -52, 3, 0.1, Math.PI - 0.2); ctx.stroke();

    ctx.fillStyle = "#facc15";
    ctx.beginPath(); ctx.arc(-2, -54, 15, Math.PI * 0.5, Math.PI * 1.8); ctx.fill();
    ctx.beginPath(); ctx.arc(3, -60, 9, 0, Math.PI); ctx.fill();

    // Headband
    ctx.strokeStyle = "#ec4899"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, -56, 13, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();

    // Arm Animations
    ctx.strokeStyle = "#fed7aa"; ctx.lineWidth = 3.5;

    if (state === 'WAVING') {
      ctx.beginPath(); ctx.moveTo(-6, -40); ctx.lineTo(-10, -28); ctx.stroke();
      const waveAngle = Math.sin(frame * 0.3) * 0.4;
      ctx.beginPath(); ctx.moveTo(6, -40); ctx.lineTo(14 + waveAngle * 10, -58 + Math.cos(waveAngle) * 5); ctx.stroke();
      ctx.fillStyle = "#fed7aa";
      ctx.beginPath(); ctx.arc(14 + waveAngle * 10, -58 + Math.cos(waveAngle) * 5, 2.5, 0, Math.PI * 2); ctx.fill();
    } else if (state === 'DECORATING') {
      const reach = Math.sin(frame * 0.2) * 4;
      ctx.beginPath(); ctx.moveTo(4, -40); ctx.lineTo(16 + reach, -48); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(4, -38); ctx.lineTo(18 + reach, -38); ctx.stroke();
    } else {
      ctx.beginPath(); ctx.moveTo(-4, -40); ctx.lineTo(-4 - armSwing, -28); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(4, -40); ctx.lineTo(4 + armSwing, -28); ctx.stroke();

      if (state === 'WALKING_TO' && !hasDecorations) {
        ctx.fillStyle = "#b45309"; ctx.fillRect(8, -32, 8, 6);
        ctx.fillStyle = "#f97316"; ctx.fillRect(10, -35, 4, 3);
        ctx.strokeStyle = "#78350f"; ctx.beginPath(); ctx.moveTo(12, -32); ctx.lineTo(16, -38); ctx.stroke();
      }
    }

    ctx.restore();
  }

  function updateAndDrawGirl(snowmanX) {
    const targetX = snowmanX - 35;
    const startX = 30;

    girl.frame++;

    if (girl.state === 'IDLE') {
      const buildProgress = snowmanVolume / maxSnowmanVolume;
      if (buildProgress >= 0.55 && !hasDecorations) {
        girl.state = 'WALKING_TO';
        girl.x = startX;
      }
    } else if (girl.state === 'WALKING_TO') {
      if (girl.x < targetX) {
        girl.x += girl.speed;
      } else {
        girl.state = 'DECORATING';
        girl.timer = 0;
      }
    } else if (girl.state === 'DECORATING') {
      girl.timer++;
      if (girl.timer === 40) {
        hasDecorations = true;
        saveSnowState();
      }
      if (girl.timer > 90) {
        girl.state = 'WAVING';
        girl.timer = 0;
      }
    } else if (girl.state === 'WAVING') {
      girl.timer++;
      if (girl.timer > 100) {
        girl.state = 'WALKING_BACK';
      }
    } else if (girl.state === 'WALKING_BACK') {
      if (girl.x > -50) {
        girl.x -= girl.speed;
      } else {
        girl.state = 'DONE';
      }
    }

    if (girl.state !== 'IDLE' && girl.state !== 'DONE') {
      const girlCol = Math.floor(Math.max(0, girl.x) / colWidth);
      const girlGroundY = height - (groundHeights[girlCol] || 0);
      const facingRight = (girl.state !== 'WALKING_BACK');
      drawGirl(girl.x, girlGroundY, girl.state, girl.frame, facingRight);
    }
  }

  function drawGroundTerrain() {
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.beginPath();
    ctx.moveTo(0, height);

    for (let c = 0; c < numCols; c++) {
      const x = c * colWidth;
      const h = height - groundHeights[c];
      ctx.lineTo(x, h);
    }

    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  let saveCounter = 0;

  function render() {
    ctx.clearRect(0, 0, width, height);

    saveCounter++;
    if (saveCounter % 180 === 0) {
      saveSnowState();
    }

    if (snowmanVolume >= maxSnowmanVolume && !isMelting) {
      meltTimer += 1;
      if (meltTimer > 800) {
        isMelting = true;
      }
    }

    let meltRatio = 0;
    if (isMelting) {
      meltTimer += 1;
      meltRatio = Math.min(1.0, (meltTimer - 800) / 400);

      snowmanVolume = Math.max(0, maxSnowmanVolume * (1 - meltRatio));
      for (let c = 0; c < numCols; c++) {
        groundHeights[c] *= 0.995;
      }

      if (meltRatio >= 1.0) {
        isMelting = false;
        meltTimer = 0;
        snowmanVolume = 0;
        hasDecorations = false;
        girl.state = 'IDLE';
        snowmanXRatio = getNewSnowmanXRatio();
        saveSnowState();
      }
    }

    flakes.forEach((f) => {
      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity})`;
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();

      f.sway += 0.02;
      f.y += f.d;
      f.x += Math.sin(f.sway) * 0.4;

      handleFlakeCollision(f);
    });

    drawGroundTerrain();

    const snowmanX = width * snowmanXRatio;
    const snowmanCol = Math.floor(snowmanX / colWidth);
    const groundHeightAtSite = groundHeights[snowmanCol] || 0;
    const groundY = height - groundHeightAtSite;

    drawSnowman(snowmanX, groundY, snowmanVolume, meltRatio);
    updateAndDrawGirl(snowmanX);

    requestAnimationFrame(render);
  }

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    numCols = Math.ceil(width / colWidth);
    const newGround = new Float32Array(numCols);
    for (let i = 0; i < numCols; i++) {
      newGround[i] = groundHeights[i] || 0;
    }
    groundHeights = newGround;
  });

  render();
}
