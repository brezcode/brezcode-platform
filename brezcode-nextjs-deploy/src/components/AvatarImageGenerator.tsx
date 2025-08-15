// Avatar Image Generator - Creates anime-style SVG avatars
import React from 'react';

interface AvatarImageProps {
  name: string;
  appearance: {
    style: string;
    hairColor: string;
    eyeColor: string;
    outfit: string;
  };
  size?: number;
  className?: string;
}

// SVG Avatar Generator Component
export const AvatarImage: React.FC<AvatarImageProps> = ({ 
  name, 
  appearance, 
  size = 120, 
  className = "" 
}) => {
  // Color mappings for anime-style avatars
  const getHairColorHex = (color: string): string => {
    const colorMap: { [key: string]: string } = {
      'Soft pink with blue highlights': '#FFB6C1',
      'Dynamic blue with silver streaks': '#4169E1',
      'Serene lavender': '#E6E6FA',
      'Tech-inspired purple with circuit patterns': '#9370DB',
      'Sophisticated silver with gold highlights': '#C0C0C0',
      'Wise brown with golden wisdom streaks': '#8B4513',
      'Classic Black': '#000000',
      'Professional Brown': '#8B4513',
      'Warm Blonde': '#FFD700',
      'Silver Wisdom': '#C0C0C0',
      'Tech Blue': '#0066CC',
      'Creative Purple': '#9370DB'
    };
    return colorMap[color] || '#8B4513';
  };

  const getEyeColorHex = (color: string): string => {
    const colorMap: { [key: string]: string } = {
      'Gentle green': '#32CD32',
      'Bright amber': '#FFBF00',
      'Kind blue': '#87CEEB',
      'Bright cyan': '#00FFFF',
      'Piercing violet': '#8A2BE2',
      'Warm amber': '#FFBF00',
      'Warm Brown': '#8B4513',
      'Bright Blue': '#0066FF',
      'Gentle Green': '#32CD32'
    };
    return colorMap[color] || '#0066FF';
  };

  const getStyleGradient = (style: string): string => {
    const gradients: { [key: string]: string } = {
      'professional': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'friendly': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'energetic': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'calm': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'authoritative': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    };
    return gradients[style] || gradients.professional;
  };

  const hairColor = getHairColorHex(appearance.hairColor);
  const eyeColor = getEyeColorHex(appearance.eyeColor);
  const backgroundGradient = getStyleGradient(appearance.style);

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        className="rounded-full shadow-lg"
        style={{ background: backgroundGradient }}
      >
        {/* Background Circle */}
        <defs>
          <linearGradient id={`bg-${name}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f0f9ff" />
            <stop offset="100%" stopColor="#e0e7ff" />
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
          </filter>
        </defs>
        
        <circle cx="60" cy="60" r="58" fill={`url(#bg-${name})`} stroke="#e5e7eb" strokeWidth="2"/>
        
        {/* Face */}
        <ellipse cx="60" cy="55" rx="25" ry="28" fill="#fef2e8" stroke="#e5e7eb" strokeWidth="1"/>
        
        {/* Hair */}
        <path 
          d="M35 40 Q60 25 85 40 Q85 45 80 50 Q70 35 60 35 Q50 35 40 50 Q35 45 35 40" 
          fill={hairColor} 
          stroke="#d1d5db" 
          strokeWidth="1"
        />
        
        {/* Eyes */}
        <ellipse cx="52" cy="50" rx="4" ry="6" fill="white"/>
        <ellipse cx="68" cy="50" rx="4" ry="6" fill="white"/>
        <circle cx="52" cy="50" r="3" fill={eyeColor}/>
        <circle cx="68" cy="50" r="3" fill={eyeColor}/>
        <circle cx="53" cy="49" r="1" fill="white"/> {/* Eye highlight */}
        <circle cx="69" cy="49" r="1" fill="white"/> {/* Eye highlight */}
        
        {/* Eyebrows */}
        <path d="M48 45 Q52 43 56 45" stroke={hairColor} strokeWidth="2" fill="none"/>
        <path d="M64 45 Q68 43 72 45" stroke={hairColor} strokeWidth="2" fill="none"/>
        
        {/* Nose */}
        <path d="M60 55 Q58 57 60 58 Q62 57 60 55" fill="#f3d4a7" strokeWidth="0"/>
        
        {/* Mouth */}
        <path d="M56 62 Q60 65 64 62" stroke="#e5989b" strokeWidth="2" fill="none"/>
        
        {/* Outfit indicator */}
        <rect x="45" y="85" width="30" height="25" rx="5" fill="#4f46e5" opacity="0.8"/>
        <text x="60" y="100" textAnchor="middle" fill="white" fontSize="8" fontFamily="sans-serif">
          {appearance.outfit.split(' ')[0]}
        </text>
        
        {/* Personality indicator based on style */}
        {appearance.style === 'professional' && (
          <circle cx="85" cy="35" r="8" fill="#059669" opacity="0.9">
            <title>Professional</title>
          </circle>
        )}
        {appearance.style === 'friendly' && (
          <circle cx="85" cy="35" r="8" fill="#f59e0b" opacity="0.9">
            <title>Friendly</title>
          </circle>
        )}
        {appearance.style === 'energetic' && (
          <circle cx="85" cy="35" r="8" fill="#ef4444" opacity="0.9">
            <title>Energetic</title>
          </circle>
        )}
        {appearance.style === 'calm' && (
          <circle cx="85" cy="35" r="8" fill="#8b5cf6" opacity="0.9">
            <title>Calm</title>
          </circle>
        )}
        {appearance.style === 'authoritative' && (
          <circle cx="85" cy="35" r="8" fill="#1f2937" opacity="0.9">
            <title>Authoritative</title>
          </circle>
        )}
      </svg>
    </div>
  );
};

// Pre-generated avatar images for business avatars
export const AVATAR_IMAGES = {
  'dr-sakura-wellness.svg': (size: number = 120) => (
    <AvatarImage 
      name="Dr. Sakura Wellness"
      appearance={{
        style: 'professional',
        hairColor: 'Soft pink with blue highlights',
        eyeColor: 'Gentle green',
        outfit: 'Medical'
      }}
      size={size}
    />
  ),
  'alex-thunder.svg': (size: number = 120) => (
    <AvatarImage 
      name="Alex Thunder"
      appearance={{
        style: 'energetic',
        hairColor: 'Dynamic blue with silver streaks',
        eyeColor: 'Bright amber',
        outfit: 'Business'
      }}
      size={size}
    />
  ),
  'miko-harmony.svg': (size: number = 120) => (
    <AvatarImage 
      name="Miko Harmony"
      appearance={{
        style: 'calm',
        hairColor: 'Serene lavender',
        eyeColor: 'Kind blue',
        outfit: 'Support'
      }}
      size={size}
    />
  ),
  'kai-techwiz.svg': (size: number = 120) => (
    <AvatarImage 
      name="Kai TechWiz"
      appearance={{
        style: 'professional',
        hairColor: 'Tech-inspired purple with circuit patterns',
        eyeColor: 'Bright cyan',
        outfit: 'Tech'
      }}
      size={size}
    />
  ),
  'luna-strategic.svg': (size: number = 120) => (
    <AvatarImage 
      name="Luna Strategic"
      appearance={{
        style: 'authoritative',
        hairColor: 'Sophisticated silver with gold highlights',
        eyeColor: 'Piercing violet',
        outfit: 'Executive'
      }}
      size={size}
    />
  ),
  'professor-sage.svg': (size: number = 120) => (
    <AvatarImage 
      name="Professor Sage"
      appearance={{
        style: 'friendly',
        hairColor: 'Wise brown with golden wisdom streaks',
        eyeColor: 'Warm amber',
        outfit: 'Academic'
      }}
      size={size}
    />
  )
};

export default AvatarImage;