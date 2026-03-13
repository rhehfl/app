const adjectives = [
  '빠른', '용감한', '날쌘', '강한', '민첩한', '끈질긴', '대담한', '열정적인',
  '활발한', '씩씩한', '날렵한', '거센', '굳센', '맹렬한', '재빠른',
];

const animals = [
  '치타', '독수리', '호랑이', '표범', '늑대', '말', '사슴', '매',
  '곰', '상어', '돌고래', '수달', '여우', '라이온', '팔콘',
];

export function generateNickname(): string {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  return `${adj} ${animal}`;
}
