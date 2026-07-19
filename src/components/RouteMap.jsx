import React from 'react';
import { Plane } from 'lucide-react';

const RouteMap = ({ destinationId }) => {
  // Define coordinate maps for preset destinations
  const routeConfigs = {
    andaman: {
      points: [
        { name: "Port Blair", x: 40, y: 110, label: "Day 1: Arrival & Jail" },
        { name: "Havelock Island", x: 140, y: 40, label: "Day 2-3: Beaches & Diving" },
        { name: "Neil Island", x: 240, y: 90, label: "Day 4: Coral Bridge" }
      ],
      pathD: "M 40 110 Q 90 60 140 40 Q 190 65 240 90",
      type: "Cruise"
    },
    himachal: {
      points: [
        { name: "Shimla", x: 40, y: 100, label: "Day 1: Ridge Mall" },
        { name: "Kufri", x: 120, y: 50, label: "Day 2: Peak Adventure" },
        { name: "Manali", x: 240, y: 40, label: "Day 3-4: Solang Valley" }
      ],
      pathD: "M 40 100 Q 80 75 120 50 Q 180 45 240 40",
      type: "SUV Drive"
    },
    goa: {
      points: [
        { name: "North Goa", x: 50, y: 40, label: "Day 1-2: Forts & Baga" },
        { name: "South Goa", x: 150, y: 80, label: "Day 3: Heritage Cruise" },
        { name: "Dudhsagar", x: 250, y: 110, label: "Day 4: Waterfalls" }
      ],
      pathD: "M 50 40 Q 100 60 150 80 Q 200 95 250 110",
      type: "Jeep Safari"
    },
    kerala: {
      points: [
        { name: "Cochin", x: 30, y: 100, label: "Day 1: Entry" },
        { name: "Munnar", x: 100, y: 40, label: "Day 2: Tea Hills" },
        { name: "Thekkady", x: 180, y: 80, label: "Day 3: Periyar Lake" },
        { name: "Alleppey", x: 260, y: 110, label: "Day 4: Houseboat" }
      ],
      pathD: "M 30 100 C 60 70, 70 50, 100 40 C 130 30, 150 60, 180 80 C 210 100, 230 100, 260 110",
      type: "Houseboat & SUV"
    },
    rajasthan: {
      points: [
        { name: "Jaipur", x: 50, y: 110, label: "Day 1-2: Amber Fort" },
        { name: "Pushkar", x: 150, y: 60, label: "Day 3: Desert Camp" },
        { name: "Udaipur", x: 250, y: 40, label: "Day 4: Lake Palace" }
      ],
      pathD: "M 50 110 Q 100 85 150 60 Q 200 50 250 40",
      type: "Heritage SUV"
    },
    dubai: {
      points: [
        { name: "Airport", x: 40, y: 90, label: "Day 1: Cruise" },
        { name: "Burj Khalifa", x: 140, y: 50, label: "Day 2: Top View" },
        { name: "Desert Camp", x: 240, y: 100, label: "Day 3-4: Dune Bashing" }
      ],
      pathD: "M 40 90 Q 90 70 140 50 Q 190 75 240 100",
      type: "Luxury SUV"
    }
  };

  // Fallback config if destination is not configured
  const fallbackConfig = {
    points: [
      { name: "Start Point", x: 50, y: 100, label: "Day 1: Arrival" },
      { name: "Local Sights", x: 150, y: 50, label: "Day 2-3: Tours" },
      { name: "Departure", x: 250, y: 100, label: "Day 4: Return" }
    ],
    pathD: "M 50 100 Q 150 30 250 100",
    type: "Premium Tour"
  };

  const config = routeConfigs[destinationId] || fallbackConfig;

  return (
    <div style={{
      background: 'rgba(0,0,0,0.2)',
      border: '1px solid var(--border-glass)',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-primary)', letterSpacing: '0.05em' }}>
          LIVE TOPOLOGICAL ROUTE MAP
        </span>
        <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
          Mode: {config.type}
        </span>
      </div>

      {/* SVG Canvas Map */}
      <svg viewBox="0 0 300 150" style={{ width: '100%', height: 'auto', background: 'transparent' }}>
        {/* Graticule Background Grid */}
        <g stroke="rgba(255,255,255,0.02)" strokeWidth="0.5">
          <line x1="50" y1="0" x2="50" y2="150" />
          <line x1="100" y1="0" x2="100" y2="150" />
          <line x1="150" y1="0" x2="150" y2="150" />
          <line x1="200" y1="0" x2="200" y2="150" />
          <line x1="250" y1="0" x2="250" y2="150" />
          <line x1="0" y1="50" x2="300" y2="50" />
          <line x1="0" y1="100" x2="300" y2="100" />
        </g>

        {/* Animated Connecting Path */}
        <path
          d={config.pathD}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="1.5"
          strokeDasharray="5,5"
          id="route-path"
          style={{
            strokeDasharray: 8,
            strokeDashoffset: 100,
            animation: 'dash 15s linear infinite'
          }}
        />

        {/* Moving Travel Vehicle Indicator along Path */}
        <g>
          <polygon
            points="-4,-3 6,0 -4,3 -2,0"
            fill="var(--color-secondary)"
            style={{ filter: 'drop-shadow(0 0 4px var(--color-secondary))' }}
          >
            <animateMotion
              dur="6s"
              repeatCount="indefinite"
              rotate="auto"
            >
              <mpath href="#route-path" />
            </animateMotion>
          </polygon>
        </g>

        {/* Path stops / nodes */}
        {config.points.map((pt, idx) => (
          <g key={idx} className="map-node">
            {/* Outer Pulsing Ring */}
            <circle
              cx={pt.x}
              cy={pt.y}
              r="6"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="1"
              opacity="0.4"
            >
              <animate
                attributeName="r"
                values="4;10;4"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.8;0;0.8"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Core Node Dot */}
            <circle
              cx={pt.x}
              cy={pt.y}
              r="3.5"
              fill="var(--color-primary)"
              style={{ filter: 'drop-shadow(0 0 6px var(--color-primary))', cursor: 'help' }}
            />

            {/* Label texts */}
            <text
              x={pt.x}
              y={pt.y - 12}
              textAnchor="middle"
              fill="var(--text-primary)"
              fontSize="6"
              fontWeight="bold"
            >
              {pt.name}
            </text>
            <text
              x={pt.x}
              y={pt.y + 12}
              textAnchor="middle"
              fill="var(--text-muted)"
              fontSize="4.5"
            >
              {pt.label}
            </text>
          </g>
        ))}
      </svg>

      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -100;
          }
        }
        .map-node:hover text {
          fill: var(--color-secondary) !important;
        }
      `}</style>
    </div>
  );
};

export default RouteMap;
