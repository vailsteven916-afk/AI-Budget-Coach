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

  // 1. useNavigate -> useRouter
  content = content.replace(/useNavigate/g, 'useRouter');
  content = content.replace(/const navigate = useRouter\(\);/g, 'const router = useRouter();');
  content = content.replace(/navigate\(\'/g, "router.push('");
  content = content.replace(/navigate\(\"/g, 'router.push("');
  content = content.replace(/navigate\(\`/g, 'router.push(`');
  content = content.replace(/navigate\(-1\)/g, 'router.back()');
  content = content.replace(/navigate\(/g, 'router.push(');

  // 2. onChange -> onChangeText
  content = content.replace(/onChange=\{\(e\) => ([a-zA-Z0-9_]+)\(e\.target\.value\)\}/g, 'onChangeText={$1}');
  content = content.replace(/onChange=\{\(e\) => ([a-zA-Z0-9_]+)\(\{\s*\.\.\.[a-zA-Z0-9_]+,\s*([a-zA-Z0-9_]+):\s*e\.target\.value\s*\}\)\}/g, 'onChangeText={(text) => $1({ ...$1, $2: text })}');
  content = content.replace(/onChange=\{\(e\)/g, 'onChangeText={(text)');
  content = content.replace(/e\.target\.value/g, 'text');

  // 3. onSubmit and e.preventDefault
  // Find onSubmit={functionName} and remove it, but remember the function name
  let match;
  const onSubmitRegex = /onSubmit=\{([a-zA-Z0-9_]+)\}/g;
  let submitHandlers = [];
  while ((match = onSubmitRegex.exec(content)) !== null) {
    submitHandlers.push(match[1]);
  }
  content = content.replace(/onSubmit=\{([a-zA-Z0-9_]+)\}/g, '');
  content = content.replace(/e\.preventDefault\(\);?/g, '');

  // 4. Replace <TouchableOpacity type="submit" with onPress={handler}
  if (submitHandlers.length > 0) {
    const handler = submitHandlers[0];
    content = content.replace(/<TouchableOpacity\s+type="submit"/g, `<TouchableOpacity onPress={${handler}}`);
  }
  content = content.replace(/type="submit"/g, '');
  content = content.replace(/type="button"/g, '');

  // 5. Replace motion.form with View
  content = content.replace(/<motion\.form/g, '<View');
  content = content.replace(/<\/motion\.form>/g, '</View>');
  content = content.replace(/<form/g, '<View');
  content = content.replace(/<\/form>/g, '</View>');

  // 6. Fix recharts
  if (content.includes('recharts')) {
    content = content.replace(/import \{[^}]+\} from 'recharts';/g, '// import recharts removed for React Native');
    content = content.replace(/<ResponsiveContainer[^>]*>[\s\S]*?<\/ResponsiveContainer>/g, '<View style={{height: 200, justifyContent: "center", alignItems: "center"}}><Text style={{color: "white"}}>Chart Placeholder</Text></View>');
  }

  // 7. Fix label tags (React Native doesn't have <label>)
  content = content.replace(/<label/g, '<Text');
  content = content.replace(/<\/label>/g, '</Text>');

  // 8. Fix svg tags inside React Native (needs react-native-svg, but we can just comment them out or replace with View for now to ensure build)
  content = content.replace(/<svg[^>]*>[\s\S]*?<\/svg>/g, '<View style={{width: 20, height: 20, backgroundColor: "gray", borderRadius: 10}} />');

  if (content !== original) {
    fs.writeFileSync(file, content);
  }
});
console.log('Fixes applied.');
