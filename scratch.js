const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), 'components');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Remove ambient glows
  if (content.includes('ambient-glow')) {
    content = content.replace(/\s*<div className="ambient-glow-top" \/>/g, '');
    content = content.replace(/\s*<div className="ambient-glow-purple" \/>/g, '');
    changed = true;
  }

  // Remove SpaceCanvas from Hero
  if (file === 'Hero.tsx' && content.includes('<SpaceCanvas')) {
    content = content.replace(/\s*\{\/\* 1\. Interactive Starfield & Dust Particles Canvas \*\/\}\s*<SpaceCanvas cursorPos=\{cursorPos\} \/>/g, '');
    content = content.replace(/import \{ SpaceCanvas \} from "\.\/SpaceCanvas";\n/, '');
    content = content.replace('overflow-hidden bg-black flex', 'overflow-hidden flex');
    changed = true;
  }

  // Replace bg-black and bg-[#020503] in section-shell
  if (content.includes('section-shell')) {
    content = content.replace(/className="section-shell bg-\[#020503\] /g, 'className="section-shell bg-transparent ');
    content = content.replace(/className="section-shell bg-black /g, 'className="section-shell bg-transparent ');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log('Updated', file);
  }
}
