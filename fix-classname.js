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

  // Fix the missing closing brace before className
  // e.g. onChangeText={setEmail className= -> onChangeText={setEmail} className=
  // onPress={handleLogin className= -> onPress={handleLogin} className=
  // value={email className= -> value={email} className=
  // href="/signup" className= -> this is fine
  
  content = content.replace(/=([a-zA-Z0-9_]+)\s+className=/g, '={$1} className=');
  content = content.replace(/=\{([a-zA-Z0-9_]+)\s+className=/g, '={$1} className=');
  
  // Also fix any stray `{` that wasn't closed
  content = content.replace(/onChangeText=\{([a-zA-Z0-9_]+)\s+className=/g, 'onChangeText={$1} className=');
  content = content.replace(/onPress=\{([a-zA-Z0-9_]+)\s+className=/g, 'onPress={$1} className=');

  if (content !== original) {
    fs.writeFileSync(file, content);
  }
});
console.log('Fixed missing braces before className.');
