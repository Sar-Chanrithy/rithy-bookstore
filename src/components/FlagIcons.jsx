import React from 'react';

export function FlagUS({ size = 18, style = {} }) {
  const height = Math.round(size * 0.7);
  return (
    <svg 
      width={size} 
      height={height} 
      viewBox="0 0 640 440" 
      style={{ borderRadius: 3, display: 'inline-block', flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.2)', ...style }}
    >
      <g fillRule="evenodd">
        {/* Red background & White stripes */}
        <path fill="#bd3d44" d="M0 0h640v440H0z"/>
        <path stroke="#fff" strokeWidth="33.8" d="M0 50.7h640M0 118.4h640M0 186.1h640M0 253.8h640M0 321.5h640M0 389.2h640"/>
        {/* Blue Canton */}
        <path fill="#192f5d" d="M0 0h260v237H0z"/>
        {/* Stars simplified crisp circles / stars */}
        <g fill="#ffffff">
          <circle cx="28" cy="24" r="5" />
          <circle cx="68" cy="24" r="5" />
          <circle cx="108" cy="24" r="5" />
          <circle cx="148" cy="24" r="5" />
          <circle cx="188" cy="24" r="5" />
          <circle cx="228" cy="24" r="5" />

          <circle cx="48" cy="48" r="5" />
          <circle cx="88" cy="48" r="5" />
          <circle cx="128" cy="48" r="5" />
          <circle cx="168" cy="48" r="5" />
          <circle cx="208" cy="48" r="5" />

          <circle cx="28" cy="72" r="5" />
          <circle cx="68" cy="72" r="5" />
          <circle cx="108" cy="72" r="5" />
          <circle cx="148" cy="72" r="5" />
          <circle cx="188" cy="72" r="5" />
          <circle cx="228" cy="72" r="5" />

          <circle cx="48" cy="96" r="5" />
          <circle cx="88" cy="96" r="5" />
          <circle cx="128" cy="96" r="5" />
          <circle cx="168" cy="96" r="5" />
          <circle cx="208" cy="96" r="5" />

          <circle cx="28" cy="120" r="5" />
          <circle cx="68" cy="120" r="5" />
          <circle cx="108" cy="120" r="5" />
          <circle cx="148" cy="120" r="5" />
          <circle cx="188" cy="120" r="5" />
          <circle cx="228" cy="120" r="5" />

          <circle cx="48" cy="144" r="5" />
          <circle cx="88" cy="144" r="5" />
          <circle cx="128" cy="144" r="5" />
          <circle cx="168" cy="144" r="5" />
          <circle cx="208" cy="144" r="5" />

          <circle cx="28" cy="168" r="5" />
          <circle cx="68" cy="168" r="5" />
          <circle cx="108" cy="168" r="5" />
          <circle cx="148" cy="168" r="5" />
          <circle cx="188" cy="168" r="5" />
          <circle cx="228" cy="168" r="5" />

          <circle cx="48" cy="192" r="5" />
          <circle cx="88" cy="192" r="5" />
          <circle cx="128" cy="192" r="5" />
          <circle cx="168" cy="192" r="5" />
          <circle cx="208" cy="192" r="5" />

          <circle cx="28" cy="216" r="5" />
          <circle cx="68" cy="216" r="5" />
          <circle cx="108" cy="216" r="5" />
          <circle cx="148" cy="216" r="5" />
          <circle cx="188" cy="216" r="5" />
          <circle cx="228" cy="216" r="5" />
        </g>
      </g>
    </svg>
  );
}

export function FlagKH({ size = 18, style = {} }) {
  const height = Math.round(size * 0.7);
  return (
    <svg 
      width={size} 
      height={height} 
      viewBox="0 0 640 440" 
      style={{ borderRadius: 3, display: 'inline-block', flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.2)', ...style }}
    >
      {/* Top and Bottom Blue Stripes */}
      <rect width="640" height="440" fill="#032ea6"/>
      {/* Middle Red Stripe */}
      <rect y="110" width="640" height="220" fill="#e00025"/>
      {/* Angkor Wat in center */}
      <g fill="#ffffff" transform="translate(185, 125) scale(0.95)">
        {/* Foundation Plinth */}
        <rect x="15" y="145" width="260" height="15" rx="2" />
        <rect x="30" y="132" width="230" height="13" />
        
        {/* Center Main Tower */}
        <path d="M 145 20 L 132 55 L 135 90 L 130 132 L 160 132 L 155 90 L 158 55 Z" />
        <polygon points="145,10 137,25 153,25" />
        <rect x="138" y="70" width="14" height="25" fill="#e00025" rx="2" />

        {/* Inner Left Tower */}
        <path d="M 95 45 L 85 75 L 88 100 L 85 132 L 110 132 L 107 100 L 110 75 Z" />
        <polygon points="95,35 88,48 102,48" />
        <rect x="91" y="85" width="10" height="20" fill="#e00025" rx="1.5" />

        {/* Outer Left Tower */}
        <path d="M 50 65 L 42 90 L 44 110 L 42 132 L 65 132 L 63 110 L 65 90 Z" />
        <polygon points="50,55 45,68 55,68" />

        {/* Inner Right Tower */}
        <path d="M 195 45 L 185 75 L 188 100 L 185 132 L 210 132 L 207 100 L 210 75 Z" />
        <polygon points="195,35 188,48 202,48" />
        <rect x="191" y="85" width="10" height="20" fill="#e00025" rx="1.5" />

        {/* Outer Right Tower */}
        <path d="M 240 65 L 232 90 L 234 110 L 232 132 L 255 132 L 253 110 L 255 90 Z" />
        <polygon points="240,55 235,68 245,68" />
      </g>
    </svg>
  );
}

export function FlagCN({ size = 18, style = {} }) {
  const height = Math.round(size * 0.7);
  const starPoints = "0,-1 0.2245,-0.3090 0.9511,-0.3090 0.3633,0.1180 0.5878,0.8090 0,0.3820 -0.5878,0.8090 -0.3633,0.1180 -0.9511,-0.3090 -0.2245,-0.3090";
  return (
    <svg 
      width={size} 
      height={height} 
      viewBox="0 0 640 440" 
      style={{ borderRadius: 3, display: 'inline-block', flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.2)', ...style }}
    >
      {/* Red field */}
      <rect width="640" height="440" fill="#de2910" />
      {/* Yellow stars */}
      <g fill="#ffde00">
        <polygon points={starPoints} transform="translate(107, 110) scale(66)" />
        <polygon points={starPoints} transform="translate(213, 44) rotate(-121.7) scale(22)" />
        <polygon points={starPoints} transform="translate(256, 88) rotate(-98.4) scale(22)" />
        <polygon points={starPoints} transform="translate(256, 154) rotate(-73.6) scale(22)" />
        <polygon points={starPoints} transform="translate(213, 198) rotate(-50.5) scale(22)" />
      </g>
    </svg>
  );
}
