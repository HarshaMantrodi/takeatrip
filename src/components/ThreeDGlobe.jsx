import React, { useRef, useEffect } from 'react';

const ThreeDGlobe = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = canvas.width = 450;
    let height = canvas.height = 450;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    let particles = [];
    const particleCount = 280;
    const sphereRadius = 140;
    
    // Position variables for particle sphere
    const centerX = width / 2;
    const centerY = height / 2;

    // Rotation angles
    let angleX = 0.003;
    let angleY = 0.005;
    let currentXAngle = 0;
    let currentYAngle = 0;

    // Mouse tracking for parallax tilt
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    // Generate 3D coordinates evenly on a sphere (Fibonacci lattice)
    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;

      particles.push({
        x3d: sphereRadius * Math.sin(phi) * Math.cos(theta),
        y3d: sphereRadius * Math.sin(phi) * Math.sin(theta),
        z3d: sphereRadius * Math.cos(phi),
        colorIndex: Math.floor(Math.random() * 3), // different shades of gold/teal
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

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - centerX;
      const y = e.clientY - rect.top - centerY;
      // Map mouse position to small angles
      mouse.targetX = (x / centerX) * 0.2;
      mouse.targetY = (y / centerY) * 0.2;
    };

    const handleMouseLeave = () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
    };

    const draw = () => {
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
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.15)';
      ctx.lineWidth = 1;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(0.3 + mouse.x * 0.5);
      ctx.scale(1, 0.25);
      ctx.beginPath();
      ctx.arc(0, 0, sphereRadius * 1.25, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Draw vertical orbital ring
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.1)';
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(-0.5 + mouse.y * 0.5);
      ctx.scale(0.3, 1);
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
        // D is distance from viewer to screen
        const d = 400;
        const scale = d / (d + p.z3d);
        const projX = p.x3d * scale + centerX;
        const projY = p.y3d * scale + centerY;

        // Size based on depth
        const radius = Math.max(1, (scale * 2.5));

        // Depth opacity (fade out back particles)
        const alpha = Math.min(1, Math.max(0.1, (p.z3d + sphereRadius) / (2 * sphereRadius)));
        
        ctx.fillStyle = colors[p.colorIndex];
        ctx.globalAlpha = alpha;

        ctx.beginPath();
        ctx.arc(projX, projY, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw connected web lines for closer front particles
        if (p.z3d > 10) {
          sortedParticles.forEach((other) => {
            if (other !== p && other.z3d > 10) {
              const dx = p.x3d - other.x3d;
              const dy = p.y3d - other.y3d;
              const dz = p.z3d - other.z3d;
              const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
              if (dist < 40) {
                ctx.strokeStyle = colors[p.colorIndex];
                ctx.globalAlpha = (1 - dist / 40) * 0.15;
                ctx.lineWidth = 0.5;
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
      cancelAnimationFrame(animationFrameId);
      if (currentContainer) {
        currentContainer.removeEventListener('mousemove', handleMouseMove);
        currentContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto',
      }}
    >
      <canvas ref={canvasRef} style={{ pointerEvents: 'auto', cursor: 'grab' }} />
      {/* Decorative compass lines in the background */}
      <div 
        style={{
          position: 'absolute',
          width: '80%',
          height: '80%',
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
