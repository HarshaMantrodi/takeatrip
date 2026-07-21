import React, { useRef, useEffect } from 'react';

const ThreeDGlobe = ({ size = 450 }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = size;
    let height = size;
    let sphereRadius = size * 0.31;

    // Position variables
    let centerX = width / 2;
    let centerY = height / 2;

    const scaleCanvas = () => {
      const containerRect = containerRef.current
        ? containerRef.current.getBoundingClientRect()
        : { width: size };
      
      // Responsive shrink for mobile viewports
      const targetSize = Math.min(size, containerRect.width || size);
      
      width = targetSize;
      height = targetSize;
      centerX = width / 2;
      centerY = height / 2;
      sphereRadius = targetSize * 0.32;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    scaleCanvas();
    window.addEventListener('resize', scaleCanvas);

    let particles = [];
    const particleCount = Math.min(280, Math.floor(size * 0.65)); // scale particle count based on size

    // Generate 3D coordinates evenly on a sphere (Fibonacci lattice)
    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;

      particles.push({
        x3d: sphereRadius * Math.sin(phi) * Math.cos(theta),
        y3d: sphereRadius * Math.sin(phi) * Math.sin(theta),
        z3d: sphereRadius * Math.cos(phi),
        colorIndex: Math.floor(Math.random() * 3), // gold/teal shades
      });
    }

    const colors = [
      '#d97706', // Gold
      '#f59e0b', // Light Amber
      '#0ea5e9', // Sky Blue
    ];

    const rotateX = (point, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const y = point.y3d * cos - point.z3d * sin;
      const z = point.y3d * sin + point.z3d * cos;
      point.y3d = y;
      point.z3d = z;
    };

    const rotateY = (point, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const x = point.x3d * cos + point.z3d * sin;
      const z = -point.x3d * sin + point.z3d * cos;
      point.x3d = x;
      point.z3d = z;
    };

    // Rotation speeds
    let angleX = 0.003;
    let angleY = 0.005;
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - centerX;
      const y = e.clientY - rect.top - centerY;
      mouse.targetX = (x / centerX) * 0.2;
      mouse.targetY = (y / centerY) * 0.2;
    };

    const handleMouseLeave = () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
    };

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);

      // Dampen mouse movements (lerp)
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Draw faint background glow ring
      const gradient = ctx.createRadialGradient(centerX, centerY, sphereRadius * 0.8, centerX, centerY, sphereRadius * 1.3);
      gradient.addColorStop(0, 'rgba(217, 119, 6, 0.03)');
      gradient.addColorStop(0.5, 'rgba(14, 165, 233, 0.02)');
      gradient.addColorStop(1, 'rgba(7, 10, 19, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, sphereRadius * 1.4, 0, Math.PI * 2);
      ctx.fill();

      // Draw horizontal orbital ring
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.12)';
      ctx.lineWidth = 0.75;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(0.3 + mouse.x * 0.5);
      ctx.scale(1, 0.22);
      ctx.beginPath();
      ctx.arc(0, 0, sphereRadius * 1.25, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Draw vertical orbital ring
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.08)';
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(-0.5 + mouse.y * 0.5);
      ctx.scale(0.28, 1);
      ctx.beginPath();
      ctx.arc(0, 0, sphereRadius * 1.25, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Sort particles by depth (Z-index) to render back ones first (depth cueing)
      const sortedParticles = [...particles].sort((a, b) => a.z3d - b.z3d);

      sortedParticles.forEach((p) => {
        // Rotate automatically
        rotateX(p, angleX + mouse.y * 0.02);
        rotateY(p, angleY + mouse.x * 0.02);

        // Perspective projection calculation
        const d = 400;
        const scale = d / (d + p.z3d);
        const projX = p.x3d * scale + centerX;
        const projY = p.y3d * scale + centerY;

        // Size based on depth
        const radius = Math.max(0.8, (scale * (size > 250 ? 2.5 : 1.6)));

        // Depth opacity (fade out back particles)
        const alpha = Math.min(1, Math.max(0.12, (p.z3d + sphereRadius) / (2 * sphereRadius)));
        
        ctx.fillStyle = colors[p.colorIndex];
        ctx.globalAlpha = alpha;

        ctx.beginPath();
        ctx.arc(projX, projY, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw connected web lines for closer front particles (only for larger size globes)
        if (size > 250 && p.z3d > 10) {
          sortedParticles.forEach((other) => {
            if (other !== p && other.z3d > 10) {
              const dx = p.x3d - other.x3d;
              const dy = p.y3d - other.y3d;
              const dz = p.z3d - other.z3d;
              const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
              if (dist < 38) {
                ctx.strokeStyle = colors[p.colorIndex];
                ctx.globalAlpha = (1 - dist / 38) * 0.12;
                ctx.lineWidth = 0.4;
                ctx.beginPath();
                ctx.moveTo(projX, projY);
                const otherScale = d / (d + other.z3d);
                ctx.lineTo(other.x3d * otherScale + centerX, other.y3d * otherScale + centerY);
                ctx.stroke();
              }
            }
          });
        }
      });

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener('mousemove', handleMouseMove);
      currentContainer.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      window.removeEventListener('resize', scaleCanvas);
      cancelAnimationFrame(animationFrameId);
      if (currentContainer) {
        currentContainer.removeEventListener('mousemove', handleMouseMove);
        currentContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [size]);

  return (
    <div 
      ref={containerRef} 
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
        maxWidth: `${size}px`,
        margin: '0 auto',
      }}
    >
      <canvas ref={canvasRef} style={{ pointerEvents: 'auto', cursor: 'grab', display: 'block' }} />
      {/* Decorative compass lines in the background */}
      <div 
        style={{
          position: 'absolute',
          width: '84%',
          height: '84%',
          border: '1px dashed rgba(255,255,255,0.03)',
          borderRadius: '50%',
          pointerEvents: 'none',
          animation: 'spin-slow 60s linear infinite'
        }} 
      />
    </div>
  );
};

export default ThreeDGlobe;
