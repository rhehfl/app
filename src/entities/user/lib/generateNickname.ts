const adjectives = [
  '빠른', '용감한', '강한', '날쌘', '민첩한',
  '거센', '날렵한', '씩씩한', '활발한', '당찬',
  '맹렬한', '재빠른', '기민한', '날랜', '힘찬',
];

const animals = [
  '치타', '독수리', '사자', '호랑이', '표범',
  '매', '늑대', '곰', '상어', '고래',
  '코뿔소', '타조', '가젤', '치타', '팔콘',
];

export function generateNickname(): string {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  return `${adj} ${animal}`;
}
