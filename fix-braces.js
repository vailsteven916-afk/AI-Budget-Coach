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

  // Fix the broken View tags and braces
  content = content.replace(/<View\}\}\}/g, '<View');
  content = content.replace(/<View\}\}/g, '<View');
  content = content.replace(/<View\}/g, '<View');
  content = content.replace(/<ScrollView\}\}\}/g, '<ScrollView');
  content = content.replace(/<ScrollView\}\}/g, '<ScrollView');
  content = content.replace(/<ScrollView\}/g, '<ScrollView');
  content = content.replace(/<Text\}\}\}/g, '<Text');
  content = content.replace(/<Text\}\}/g, '<Text');
  content = content.replace(/<Text\}/g, '<Text');

  // Remove any stray `}}` or `}` that might be left over from the bad regex right before a className
  content = content.replace(/\}\}\s+className=/g, ' className=');
  content = content.replace(/\}\s+className=/g, ' className=');

  // Remove AnimatePresence
  content = content.replace(/<AnimatePresence[^>]*>/g, '<View>');
  content = content.replace(/<\/AnimatePresence>/g, '</View>');

  if (content !== original) {
    fs.writeFileSync(file, content);
  }
});
console.log('Fixed broken braces.');
