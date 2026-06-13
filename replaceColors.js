const fs = require('fs');
const path = require('path');

const replacements = {
  '#1A365D': '#116892',
  '#1a365d': '#116892',
  '#2B6CB0': '#1a8cc4',
  '#2b6cb0': '#1a8cc4',
  '#3B82F6': '#1a8cc4',
  '#3b82f6': '#1a8cc4',
  '#2563EB': '#116892',
  '#2563eb': '#116892',
  '#1D4ED8': '#116892',
  '#1d4ed8': '#116892',
  '#1E40AF': '#0b415e',
  '#1e40af': '#0b415e'
};

const files = [
  'src/app/globals.css',
  'src/components/testimonials.module.css',
  'src/components/team-carousel.module.css',
  'src/app/services/services.module.css',
  'src/app/page.module.css',
  'src/app/gallery/public-gallery.module.css',
  'src/app/contact/contact.module.css',
  'src/app/about/about.module.css',
  'src/app/admin/(protected)/testimonials/testimonials.module.css'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    for (const [oldColor, newColor] of Object.entries(replacements)) {
      if (content.includes(oldColor)) {
        content = content.split(oldColor).join(newColor);
        changed = true;
      }
    }
    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${file}`);
    }
  } else {
    console.log(`File not found: ${file}`);
  }
});
