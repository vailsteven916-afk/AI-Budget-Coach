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

  // Remove motion props
  content = content.replace(/\s+initial=\{[^}]+\}/g, '');
  content = content.replace(/\s+animate=\{[^}]+\}/g, '');
  content = content.replace(/\s+transition=\{[^}]+\}/g, '');
  content = content.replace(/\s+exit=\{[^}]+\}/g, '');

  // Replace remaining HTML tags
  content = content.replace(/<header/g, '<View');
  content = content.replace(/<\/header>/g, '</View>');
  content = content.replace(/<footer/g, '<View');
  content = content.replace(/<\/footer>/g, '</View>');
  content = content.replace(/<section/g, '<View');
  content = content.replace(/<\/section>/g, '</View>');
  content = content.replace(/<article/g, '<View');
  content = content.replace(/<\/article>/g, '</View>');
  content = content.replace(/<nav/g, '<View');
  content = content.replace(/<\/nav>/g, '</View>');
  content = content.replace(/<ul/g, '<View');
  content = content.replace(/<\/ul>/g, '</View>');
  content = content.replace(/<li/g, '<View');
  content = content.replace(/<\/li>/g, '</View>');
  content = content.replace(/<main/g, '<ScrollView');
  content = content.replace(/<\/main>/g, '</ScrollView>');

  // Fix bare strings inside Views. This is tricky with regex, but we can look for common patterns.
  // Actually, a better approach for bare strings is manual inspection, but let's fix the known ones first.

  if (content !== original) {
    fs.writeFileSync(file, content);
  }
});
console.log('HTML and Motion props cleanup applied.');
