import React, { useEffect, useRef } from 'react';

/**
 * SnowEffect Component
 * - Tuyết rơi nền: hạt tuyết tròn nhẹ bé tí, có độ tương phản rõ để nổi bật trên cả nền và các thẻ thông tin.
 * - Khi di tay / di con trỏ trên màn hình: các cánh tuyết ❄️ bé vừa đẹp rải rác đi theo đường di chuyển của ngón tay / con trỏ rồi nhẹ nhàng rơi xuống và tan biến (không bung thành chùm).
 * - Sử dụng pointer-events: none để không cản trở thao tác chạm.
 */
const SnowEffect = ({ isDark = false }) => {
  const canvasRef = useRef(null);
  const isDarkRef = useRef(isDark);

  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // 1. Hạt tuyết rơi nền: tròn nhẹ, hạt bé tí (radius 1.0px -> 2.1px), nhìn rõ trên các thẻ màu dịu
    const flakeCount = Math.min(55, Math.max(32, Math.floor(width / 15)));
    const ambientFlakes = Array.from({ length: flakeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.1 + 1.0,
      speedY: Math.random() * 0.6 + 0.3,
      speedX: (Math.random() - 0.5) * 0.28,
      swingAngle: Math.random() * Math.PI * 2,
      swingSpeed: Math.random() * 0.018 + 0.008,
      opacity: Math.random() * 0.35 + 0.6,
    }));

    // 2. Danh sách cánh tuyết ❄️ rải rác đi theo con trỏ / ngón tay
    const trailFlakes = [];
    let lastSpawnX = -999;
    let lastSpawnY = -999;
    let lastSpawnTime = 0;

    // Tạo 1 cánh tuyết ❄️ đơn lẻ rải rác theo vị trí con trỏ / ngón tay
    const spawnSingleTrailFlake = (clientX, clientY, velocityX = 0, velocityY = 0) => {
      const offsetX = (Math.random() - 0.5) * 14;
      const offsetY = (Math.random() - 0.5) * 14;

      trailFlakes.push({
        x: clientX + offsetX,
        y: clientY + offsetY,
        vx: velocityX * 0.08 + (Math.random() - 0.5) * 0.55,
        vy: Math.max(-0.3, velocityY * 0.05) + Math.random() * 0.45 + 0.35,
        swing: Math.random() * Math.PI * 2,
        swingSpeed: Math.random() * 0.05 + 0.025,
        size: Math.random() * 2.2 + 4.8, // Cánh tuyết ❄️ bé vừa đẹp (~9px - 14px)
        alpha: 1,
        decay: Math.random() * 0.01 + 0.009,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.035,
      });

      // Giới hạn số lượng hạt để luôn mượt 60fps
      if (trailFlakes.length > 90) {
        trailFlakes.shift();
      }
    };

    const handleTrailMove = (clientX, clientY) => {
      const now = performance.now();
      const dx = clientX - lastSpawnX;
      const dy = clientY - lastSpawnY;
      const dist = Math.hypot(dx, dy);

      // Rải cánh tuyết đều đặn theo quãng đường di tay (~14px) mà không bị dồn cục
      if (dist >= 14 || now - lastSpawnTime > 45) {
        spawnSingleTrailFlake(clientX, clientY, dx * 0.15, dy * 0.15);
        lastSpawnX = clientX;
        lastSpawnY = clientY;
        lastSpawnTime = now;
      }
    };

    const onPointerMove = (e) => {
      if (e.clientX !== undefined && e.clientY !== undefined) {
        handleTrailMove(e.clientX, e.clientY);
      }
    };

    const onTouchMove = (e) => {
      const touch = e.touches?.[0];
      if (touch) {
        handleTrailMove(touch.clientX, touch.clientY);
      }
    };

    const onPointerDown = (e) => {
      if (e.clientX !== undefined && e.clientY !== undefined) {
        // Khi chạm nhẹ chỉ thả 1-2 cánh tuyết ❄️ nhỏ nhắn tại điểm chạm, không tạo chùm
        spawnSingleTrailFlake(e.clientX, e.clientY);
        lastSpawnX = e.clientX;
        lastSpawnY = e.clientY;
        lastSpawnTime = performance.now();
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });

    // Hàm vẽ cánh tuyết ❄️ 6 nhánh sắc nét, nổi bật trên cả nền sáng và nền thẻ
    const drawMiniSnowflake = (x, y, radius, rotation, alpha, darkMode) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();

      for (let i = 0; i < 6; i++) {
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -radius);

        const branchPos = radius * 0.56;
        const branchLen = radius * 0.38;
        ctx.moveTo(0, -branchPos);
        ctx.lineTo(-branchLen * 0.75, -branchPos - branchLen * 0.65);
        ctx.moveTo(0, -branchPos);
        ctx.lineTo(branchLen * 0.75, -branchPos - branchLen * 0.65);

        ctx.rotate(Math.PI / 3);
      }

      if (darkMode) {
        ctx.strokeStyle = `rgba(240, 249, 255, ${alpha})`;
        ctx.shadowColor = 'rgba(56, 189, 248, 0.85)';
        ctx.shadowBlur = 5;
      } else {
        // Ở chế độ sáng: cánh tuyết màu trắng sáng có viền bóng xanh dương đậm để hiện rõ trên mọi thẻ
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.shadowColor = 'rgba(2, 132, 199, 0.75)';
        ctx.shadowBlur = 5;
      }

      ctx.lineWidth = 1.35;
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const darkMode = isDarkRef.current;

      // 1. Vẽ hạt tuyết rơi nền tròn nhẹ bé tí
      for (let i = 0; i < ambientFlakes.length; i++) {
        const f = ambientFlakes[i];
        f.swingAngle += f.swingSpeed;
        f.y += f.speedY;
        f.x += f.speedX + Math.sin(f.swingAngle) * 0.25;

        if (f.y > height + 6) {
          f.y = -6;
          f.x = Math.random() * width;
        }
        if (f.x > width + 6) f.x = -6;
        if (f.x < -6) f.x = width + 6;

        ctx.save();
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);

        if (darkMode) {
          ctx.fillStyle = `rgba(240, 249, 255, ${f.opacity * 0.85})`;
          ctx.shadowColor = 'rgba(56, 189, 248, 0.5)';
          ctx.shadowBlur = 3;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, f.opacity + 0.25)})`;
          ctx.shadowColor = 'rgba(2, 132, 199, 0.55)';
          ctx.shadowBlur = 4;
        }

        ctx.fill();
        ctx.restore();
      }

      // 2. Vẽ các cánh tuyết ❄️ rải rác đi theo con trỏ / ngón tay
      for (let i = trailFlakes.length - 1; i >= 0; i--) {
        const p = trailFlakes[i];
        p.swing += p.swingSpeed;
        p.vy += 0.018; // Rơi nhẹ nhàng lơ lửng
        p.vx *= 0.98;
        p.x += p.vx + Math.sin(p.swing) * 0.28;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          trailFlakes.splice(i, 1);
          continue;
        }

        drawMiniSnowflake(p.x, p.y, p.size, p.rotation, p.alpha, darkMode);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
};

export default SnowEffect;
