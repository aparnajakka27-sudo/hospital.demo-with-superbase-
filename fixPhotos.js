const fs = require('fs');
let content = fs.readFileSync('lib/hospitalConfig.ts', 'utf8');

// Replace doctors images
const doctorImages = [
  "https://randomuser.me/api/portraits/men/31.jpg",
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/women/68.jpg",
  "https://randomuser.me/api/portraits/men/46.jpg",
  "https://randomuser.me/api/portraits/women/32.jpg",
  "https://randomuser.me/api/portraits/men/22.jpg",
  "https://randomuser.me/api/portraits/women/12.jpg",
  "https://randomuser.me/api/portraits/men/78.jpg",
  "https://randomuser.me/api/portraits/women/24.jpg",
  "https://randomuser.me/api/portraits/men/82.jpg",
  "https://randomuser.me/api/portraits/women/55.jpg",
  "https://randomuser.me/api/portraits/men/61.jpg",
  "https://randomuser.me/api/portraits/women/90.jpg",
  "https://randomuser.me/api/portraits/men/15.jpg",
  "https://randomuser.me/api/portraits/women/79.jpg"
];

let docIdx = 0;
let parts = content.split('services: [');
let beforeServices = parts[0];
let afterServices = 'services: [' + parts[1];

beforeServices = beforeServices.replace(/image: \"[^\"]+\"/g, () => {
  let img = doctorImages[docIdx];
  docIdx++;
  return `image: "${img}"`;
});

content = beforeServices + afterServices;

// Now for gallery
const galleryImages = [
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800",
  "/horizon_hospital.jpg",
  "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800",
  "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=800",
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=800",
  "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800"
];

let galIdx = 0;
content = content.replace(/gallery: \[\s*([\s\S]*?)\s*\]/, (match, p1) => {
  let newP1 = p1.replace(/image: \"[^\"]+\"/g, () => {
    let img = galleryImages[galIdx];
    galIdx++;
    return `image: "${img}"`;
  });
  return `gallery: [\n    ${newP1}\n  ]`;
});

// Fix the caption for the second image
content = content.replace('caption: "ICU Ward"', 'caption: "Main Hospital Building"');

fs.writeFileSync('lib/hospitalConfig.ts', content);
console.log('Fixed Config!');
