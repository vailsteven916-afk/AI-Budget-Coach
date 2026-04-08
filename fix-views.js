const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
}

const files = [...walk('app'), ...walk('components')];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Fix the broken View tags
  content = content.replace(/<View\}\}\}/g, '<View');
  content = content.replace(/<View\}\}/g, '<View');
  content = content.replace(/<ScrollView\}\}\}/g, '<ScrollView');
  content = content.replace(/<ScrollView\}\}/g, '<ScrollView');
  content = content.replace(/<Text\}\}\}/g, '<Text');
  content = content.replace(/<Text\}\}/g, '<Text');

  // Fix bare text inside View. We can't do this perfectly with regex, but let's fix the known ones from the compiler output.
  // Actually, let's just run the compiler and fix manually or script specific fixes.

  if (content !== original) {
    fs.writeFileSync(file, content);
  }
});
console.log('Fixed broken View tags.');
