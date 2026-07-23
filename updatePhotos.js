const fs = require('fs');
let content = fs.readFileSync('lib/hospitalConfig.ts', 'utf8');

const images = [
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1594824436998-d8869f3a4798?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1582750433449-648ed127d0fc?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1638202993928-7267aad84c31?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1605684954998-685c79d6a018?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?q=80&w=400&auto=format&fit=crop'
];

let i = 0;
content = content.replace(/image: \"https:\/\/images\.unsplash\.com\/photo-[^\"]+\"/g, () => {
  const img = images[i % images.length];
  i++;
  return `image: "${img}"`;
});

fs.writeFileSync('lib/hospitalConfig.ts', content);
console.log('Images updated successfully!');
