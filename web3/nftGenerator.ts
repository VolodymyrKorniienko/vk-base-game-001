/**
 * Генератор SVG для NFT Achievement
 * Создаёт динамический дизайн в цветах приложения с неоновым свечением
 */

interface NFTMetadata {
  tokenId: number;
  player: string;
  level: string;
  moves: number;
  mistakes: number;
  timeElapsed: number;
  stars: number;
  timestamp: number;
}

export function generateNFTSVG(metadata: NFTMetadata): string {
  const { tokenId, player, level, moves, mistakes, timeElapsed, stars, timestamp } = metadata;

  // Форматирование времени
  const minutes = Math.floor(timeElapsed / 60000);
  const seconds = Math.floor((timeElapsed % 60000) / 1000);
  const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  // Укороченный адрес игрока
  const shortPlayer = player 
    ? `${player.slice(0, 6)}...${player.slice(-4)}`
    : 'Unknown';

  // Дата в читаемом формате
  const date = new Date(timestamp);
  const dateStr = date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });

  // Звёзды
  const starSymbols = '★'.repeat(stars) + '☆'.repeat(3 - stars);

  // Бейдж за эффективность
  let efficiencyBadge = '';
  let efficiencyColor = '#4CAF50';
  if (moves <= 20) {
    efficiencyBadge = 'PERFECT';
    efficiencyColor = '#00F7FF';
  } else if (moves <= 30) {
    efficiencyBadge = 'GREAT';
    efficiencyColor = '#7B61FF';
  } else if (moves <= 40) {
    efficiencyBadge = 'GOOD';
    efficiencyColor = '#F093FB';
  } else {
    efficiencyBadge = 'WARRIOR';
    efficiencyColor = '#FF576C';
  }

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Градиенты фона -->
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0f1e;stop-opacity:1" />
      <stop offset="25%" style="stop-color:#191432;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#281941;stop-opacity:1" />
      <stop offset="75%" style="stop-color:#231f4b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#141932;stop-opacity:1" />
    </linearGradient>
    
    <!-- Неоновый градиент -->
    <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#764ba2;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f093fb;stop-opacity:1" />
    </linearGradient>
    
    <!-- Золотой градиент -->
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#FFA500;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FF8C00;stop-opacity:1" />
    </linearGradient>
    
    <!-- Фильтры свечения -->
    <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <filter id="strongGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <filter id="textGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <!-- Клип для рамки -->
    <clipPath id="frameClip">
      <rect x="20" y="20" width="560" height="560" rx="30" ry="30"/>
    </clipPath>
  </defs>
  
  <!-- Основной фон -->
  <rect width="600" height="600" fill="url(#bgGradient)"/>
  
  <!-- Декоративные неоновые круги на фоне -->
  <circle cx="300" cy="300" r="250" fill="none" stroke="rgba(102, 126, 234, 0.1)" stroke-width="2"/>
  <circle cx="300" cy="300" r="200" fill="none" stroke="rgba(118, 75, 162, 0.1)" stroke-width="2"/>
  <circle cx="300" cy="300" r="150" fill="none" stroke="rgba(240, 147, 251, 0.1)" stroke-width="2"/>
  
  <!-- Угловые неоновые акценты -->
  <path d="M 60 20 L 140 20 L 140 35 L 75 35 L 60 50 L 60 140 L 45 140 L 45 60 L 20 85 L 20 60 Z" 
        fill="url(#neonGradient)" opacity="0.3" filter="url(#neonGlow)"/>
  <path d="M 540 20 L 460 20 L 460 35 L 525 35 L 540 50 L 540 140 L 555 140 L 555 60 L 580 85 L 580 60 Z" 
        fill="url(#neonGradient)" opacity="0.3" filter="url(#neonGlow)" transform="scale(-1,1) translate(-600,0)"/>
  <path d="M 60 580 L 140 580 L 140 565 L 75 565 L 60 550 L 60 460 L 45 460 L 45 540 L 20 515 L 20 540 Z" 
        fill="url(#neonGradient)" opacity="0.3" filter="url(#neonGlow)" transform="scale(1,-1) translate(0,-600)"/>
  <path d="M 540 580 L 460 580 L 460 565 L 525 565 L 540 550 L 540 460 L 555 460 L 555 540 L 580 515 L 580 540 Z" 
        fill="url(#neonGradient)" opacity="0.3" filter="url(#neonGlow)" transform="scale(-1,-1) translate(-600,-600)"/>
  
  <!-- Основная рамка с неоновым свечением -->
  <rect x="20" y="20" width="560" height="560" rx="30" ry="30" 
        fill="none" 
        stroke="url(#neonGradient)" 
        stroke-width="4"
        filter="url(#strongGlow)"
        opacity="0.8"/>
  
  <!-- Внутренняя рамка -->
  <rect x="35" y="35" width="530" height="530" rx="25" ry="25" 
        fill="none" 
        stroke="rgba(255,255,255,0.1)" 
        stroke-width="2"/>
  
  <!-- Заголовок MEMORY -->
  <text x="300" y="90" 
        font-family="'Arial Black', 'Impact', sans-serif" 
        font-size="48" 
        font-weight="bold"
        fill="url(#neonGradient)" 
        text-anchor="middle"
        filter="url(#strongGlow)"
        letter-spacing="8">
    MEMORY
  </text>
  
  <!-- Подзаголовок ACHIEVEMENT -->
  <text x="300" y="115" 
        font-family="'Arial', sans-serif" 
        font-size="14" 
        fill="rgba(255,255,255,0.7)" 
        text-anchor="middle"
        letter-spacing="4">
    ACHIEVEMENT
  </text>
  
  <!-- Центральная панель со статистикой -->
  <rect x="75" y="140" width="450" height="340" rx="20" ry="20" 
        fill="rgba(255,255,255,0.03)" 
        stroke="rgba(255,255,255,0.15)" 
        stroke-width="2"
        filter="url(#neonGlow)"/>
  
  <!-- Название уровня -->
  <text x="300" y="180" 
        font-family="'Arial', sans-serif" 
        font-size="20" 
        font-weight="bold"
        fill="#ffffff" 
        text-anchor="middle"
        filter="url(#textGlow)">
    ${level.toUpperCase()}
  </text>
  
  <!-- Разделитель -->
  <line x1="120" y1="200" x2="480" y2="200" 
        stroke="url(#neonGradient)" 
        stroke-width="2" 
        opacity="0.5"/>
  
  <!-- Звёзды -->
  <text x="300" y="240" 
        font-family="'Arial', sans-serif" 
        font-size="42" 
        fill="url(#goldGradient)" 
        text-anchor="middle"
        filter="url(#strongGlow)"
        letter-spacing="8">
    ${starSymbols}
  </text>
  
  <!-- Статистика - ряд 1 -->
  <text x="150" y="290" 
        font-family="'Arial', sans-serif" 
        font-size="14" 
        fill="rgba(255,255,255,0.6)" 
        text-anchor="middle">
    MOVES
  </text>
  <text x="300" y="290" 
        font-family="'Arial', sans-serif" 
        font-size="14" 
        fill="rgba(255,255,255,0.6)" 
        text-anchor="middle">
    MISTAKES
  </text>
  <text x="450" y="290" 
        font-family="'Arial', sans-serif" 
        font-size="14" 
        fill="rgba(255,255,255,0.6)" 
        text-anchor="middle">
    TIME
  </text>
  
  <!-- Статистика - ряд 2 (значения) -->
  <text x="150" y="325" 
        font-family="'Arial Black', 'Impact', sans-serif" 
        font-size="32" 
        font-weight="bold"
        fill="#667eea" 
        text-anchor="middle"
        filter="url(#textGlow)">
    ${moves}
  </text>
  <text x="300" y="325" 
        font-family="'Arial Black', 'Impact', sans-serif" 
        font-size="32" 
        font-weight="bold"
        fill="#f093fb" 
        text-anchor="middle"
        filter="url(#textGlow)">
    ${mistakes}
  </text>
  <text x="450" y="325" 
        font-family="'Arial Black', 'Impact', sans-serif" 
        font-size="32" 
        font-weight="bold"
        fill="#764ba2" 
        text-anchor="middle"
        filter="url(#textGlow)">
    ${timeStr}
  </text>
  
  <!-- Бейдж эффективности -->
  <rect x="175" y="355" width="250" height="50" rx="25" ry="25" 
        fill="rgba(0,0,0,0.3)" 
        stroke="${efficiencyColor}" 
        stroke-width="3"
        filter="url(#neonGlow)"/>
  <text x="300" y="387" 
        font-family="'Arial Black', 'Impact', sans-serif" 
        font-size="18" 
        font-weight="bold"
        fill="${efficiencyColor}" 
        text-anchor="middle"
        filter="url(#textGlow)"
        letter-spacing="2">
    ${efficiencyBadge}
  </text>
  
  <!-- Информация об игроке -->
  <rect x="75" y="495" width="450" height="65" rx="15" ry="15" 
        fill="rgba(102, 126, 234, 0.1)" 
        stroke="rgba(102, 126, 234, 0.3)" 
        stroke-width="2"/>
  
  <text x="100" y="520" 
        font-family="'Arial', sans-serif" 
        font-size="11" 
        fill="rgba(255,255,255,0.5)" 
        text-anchor="start">
    PLAYER
  </text>
  <text x="100" y="545" 
        font-family="'Courier New', monospace" 
        font-size="14" 
        font-weight="bold"
        fill="#667eea" 
        text-anchor="start"
        filter="url(#textGlow)">
    ${shortPlayer}
  </text>
  
  <text x="500" y="520" 
        font-family="'Arial', sans-serif" 
        font-size="11" 
        fill="rgba(255,255,255,0.5)" 
        text-anchor="end">
    DATE
  </text>
  <text x="500" y="545" 
        font-family="'Arial', sans-serif" 
        font-size="14" 
        font-weight="bold"
        fill="#f093fb" 
        text-anchor="end">
    ${dateStr}
  </text>
  
  <!-- Base логотип и информация в правом нижнем углу -->
  <g transform="translate(420, 515)">
    <!-- Base иллипс (упрощённая версия) -->
    <ellipse cx="15" cy="15" rx="12" ry="8" 
             fill="none" 
             stroke="#0052FF" 
             stroke-width="2.5"
             filter="url(#neonGlow)"/>
    <ellipse cx="15" cy="15" rx="8" ry="5" 
             fill="none" 
             stroke="#0052FF" 
             stroke-width="2"
             opacity="0.7"/>
    <text x="15" cy="35" 
          font-family="'Arial Black', sans-serif" 
          font-size="10" 
          font-weight="bold"
          fill="#0052FF" 
          text-anchor="middle"
          filter="url(#textGlow)">
      BASE
    </text>
  </g>
  
  <!-- Token ID -->
  <text x="300" y="590" 
        font-family="'Courier New', monospace" 
        font-size="10" 
        fill="rgba(255,255,255,0.4)" 
        text-anchor="middle">
    Token ID: #${tokenId}
  </text>
  
  <!-- Декоративные частицы -->
  <circle cx="100" cy="100" r="3" fill="#667eea" opacity="0.6" filter="url(#neonGlow)"/>
  <circle cx="500" cy="100" r="3" fill="#764ba2" opacity="0.6" filter="url(#neonGlow)"/>
  <circle cx="100" cy="500" r="3" fill="#f093fb" opacity="0.6" filter="url(#neonGlow)"/>
  <circle cx="500" cy="500" r="3" fill="#667eea" opacity="0.6" filter="url(#neonGlow)"/>
  <circle cx="300" cy="80" r="2" fill="#ffffff" opacity="0.4" filter="url(#neonGlow)"/>
  <circle cx="300" cy="520" r="2" fill="#ffffff" opacity="0.4" filter="url(#neonGlow)"/>
</svg>`;

  return svg;
}

export function generateNFTMetadata(metadata: NFTMetadata): {
  name: string;
  description: string;
  image: string;
  attributes: Array<{ trait_type: string; value: string | number }>;
  external_url: string;
} {
  const { tokenId, level, moves, mistakes, timeElapsed, stars } = metadata;
  
  const minutes = Math.floor(timeElapsed / 60000);
  const seconds = Math.floor((timeElapsed % 60000) / 1000);
  const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  let efficiencyBadge = '';
  if (moves <= 20) {
    efficiencyBadge = 'Perfect';
  } else if (moves <= 30) {
    efficiencyBadge = 'Great';
  } else if (moves <= 40) {
    efficiencyBadge = 'Good';
  } else {
    efficiencyBadge = 'Warrior';
  }

  return {
    name: `Base Memory Achievement #${tokenId}`,
    description: `NFT Achievement for completing ${level} in Base Memory Game. 
Moves: ${moves}, Mistakes: ${mistakes}, Time: ${timeStr}, Stars: ${stars}/3.
Minted on Base blockchain as proof of your memory mastery.`,
    image: `data:image/svg+xml;base64,${Buffer.from(generateNFTSVG(metadata)).toString('base64')}`,
    external_url: 'https://base.org',
    attributes: [
      { trait_type: 'Level', value: level },
      { trait_type: 'Moves', value: moves },
      { trait_type: 'Mistakes', value: mistakes },
      { trait_type: 'Time', value: timeStr },
      { trait_type: 'Stars', value: stars },
      { trait_type: 'Efficiency', value: efficiencyBadge },
      { trait_type: 'Network', value: 'Base' },
    ],
  };
}
