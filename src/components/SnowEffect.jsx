import React, { useEffect, useRef } from 'react';

/**
 * SnowEffect Component
 * - Tuyết rơi nền: các hạt tuyết tròn nhẹ bé tí rơi tự nhiên.
 * - Khi người dùng nhấn vào màn hình:
 *   + Bông tuyết trung tâm nở ra vừa vặn.
 *   + Các cánh tuyết ❄️ tách thoáng khỏi tâm và nổ/tõe rộng ra xung quanh (bán kính rộng ~80-130px),
 *     không bị chụm vào nhau, sau đó nhẹ nhàng lơ lửng rơi xuống và tan biến.
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

    // 1. Hạt tuyết rơi nền: tròn nhẹ, hạt bé tí
    const flakeCount = Math.min(55, Math.max(32, Math.floor(width / 15)));
    const ambientFlakes = Array.from({ length: flakeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.1 + 0.9,
      speedY: Math.random() * 0.55 + 0.28,
      speedX: (Math.random() - 0.5) * 0.25,
      swingAngle: Math.random() * Math.PI * 2,
      swingSpeed: Math.random() * 0.018 + 0.008,
      opacity: Math.random() * 0.35 + 0.55,
    }));

    // 2. Danh sách cánh tuyết ❄️ nổ bung rộng khi nhấn vào màn hình
    const burstFlakes = [];

    const spawnBloomSnowflakes = (clientX, clientY) => {
      // Bông tuyết trung tâm nở bung tại điểm nhấn
      burstFlakes.push({
        isCenterBloom: true,
        x: clientX,
        y: clientY,
        size: 4,
        maxSize: 16,
        growSpeed: 1.1,
        alpha: 0.95,
        decay: 0.028,
        rotation: Math.random() * Math.PI,
        rotationSpeed: 0.035,
      });

      // Vòng ngoài: 10 cánh tuyết ❄️ nổ bung rộng ra xa (tách sẵn khỏi tâm 14px để không chụm vào nhau)
      const outerCount = 10;
      for (let i = 0; i < outerCount; i++) {
        const baseAngle = (Math.PI * 2 * i) / outerCount;
        const angle = baseAngle + (Math.random() - 0.5) * 0.18;
        const startDist = 14 + Math.random() * 6; // Tách khỏi tâm ngay từ đầu
        const speed = Math.random() * 1.6 + 3.6; // Tốc độ bung rộng thoáng (~90px - 130px)
        burstFlakes.push({
          isCenterBloom: false,
          x: clientX + Math.cos(angle) * startDist,
          y: clientY + Math.sin(angle) * startDist,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          gravity: 0.03,
          drag: 0.962,
          swing: Math.random() * Math.PI * 2,
          swingSpeed: Math.random() * 0.05 + 0.025,
          size: Math.random() * 2.2 + 5.0,
          alpha: 1,
          decay: Math.random() * 0.005 + 0.012,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.06,
        });
      }

      // Vòng giữa: 6 cánh tuyết ❄️ xen kẽ ở khoảng cách trung bình (~50px - 75px)
      const midCount = 6;
      for (let i = 0; i < midCount; i++) {
        const baseAngle = (Math.PI * 2 * i) / midCount + Math.PI / midCount;
        const angle = baseAngle + (Math.random() - 0.5) * 0.2;
        const startDist = 8 + Math.random() * 5;
        const speed = Math.random() * 1.0 + 2.1;
        burstFlakes.push({
          isCenterBloom: false,
          x: clientX + Math.cos(angle) * startDist,
          y: clientY + Math.sin(angle) * startDist,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          gravity: 0.025,
          drag: 0.96,
          swing: Math.random() * Math.PI * 2,
          swingSpeed: Math.random() * 0.05 + 0.02,
          size: Math.random() * 1.8 + 4.0,
          alpha: 0.95,
          decay: Math.random() * 0.005 + 0.013,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.05,
        });
      }
    };

    const onPointerDown = (e) => {
      if (e.clientX !== undefined && e.clientY !== undefined) {
        spawnBloomSnowflakes(e.clientX, e.clientY);
      }
    };

    window.addEventListener('pointerdown', onPointerDown, { passive: true });

    // Hàm vẽ cánh tuyết ❄️ 6 nhánh tinh xảo
    const drawSnowflakeCrystal = (x, y, radius, rotation, alpha, darkMode, isCenter = false) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();

      for (let i = 0; i < 6; i++) {
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -radius);

        const b1Pos = radius * 0.52;
        const b1Len = radius * 0.36;
        ctx.moveTo(0, -b1Pos);
        ctx.lineTo(-b1Len * 0.75, -b1Pos - b1Len * 0.65);
        ctx.moveTo(0, -b1Pos);
        ctx.lineTo(b1Len * 0.75, -b1Pos - b1Len * 0.65);

        if (radius > 5) {
          const b2Pos = radius * 0.78;
          const b2Len = radius * 0.22;
          ctx.moveTo(0, -b2Pos);
          ctx.lineTo(-b2Len * 0.75, -b2Pos - b2Len * 0.65);
          ctx.moveTo(0, -b2Pos);
          ctx.lineTo(b2Len * 0.75, -b2Pos - b2Len * 0.65);
        }

        ctx.rotate(Math.PI / 3);
      }

      if (darkMode) {
        ctx.strokeStyle = `rgba(240, 249, 255, ${alpha})`;
        ctx.shadowColor = 'rgba(56, 189, 248, 0.9)';
        ctx.shadowBlur = isCenter ? 7 : 5;
      } else {
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.shadowColor = 'rgba(2, 132, 199, 0.8)';
        ctx.shadowBlur = isCenter ? 7 : 5;
      }

      ctx.lineWidth = isCenter ? 1.5 : 1.3;
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

      // 2. Vẽ bông tuyết nở bung rộng và thoáng khi nhấn
      for (let i = burstFlakes.length - 1; i >= 0; i--) {
        const p = burstFlakes[i];

        if (p.isCenterBloom) {
          if (p.size < p.maxSize) {
            p.size += p.growSpeed;
            p.growSpeed *= 0.92;
          }
          p.rotation += p.rotationSpeed;
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            burstFlakes.splice(i, 1);
            continue;
          }

          drawSnowflakeCrystal(p.x, p.y, p.size, p.rotation, p.alpha, darkMode, true);
        } else {
          p.swing += p.swingSpeed;
          p.vx *= p.drag;
          p.vy = p.vy * p.drag + p.gravity;
          p.x += p.vx + Math.sin(p.swing) * 0.22;
          p.y += p.vy;
          p.rotation += p.rotationSpeed;
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            burstFlakes.splice(i, 1);
            continue;
          }

          drawSnowflakeCrystal(p.x, p.y, p.size, p.rotation, p.alpha, darkMode, false);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
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
