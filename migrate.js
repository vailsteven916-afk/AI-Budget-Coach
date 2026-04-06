const fs = require('fs');
const path = require('path');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function processFile(filePath, destPath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace imports
  content = content.replace(/from 'react-router-dom'/g, "from 'expo-router'");
  content = content.replace(/from 'lucide-react'/g, "from 'lucide-react-native'");
  content = content.replace(/from 'motion\/react'/g, "from 'react-native'");
  content = content.replace(/<motion\.div/g, "<View");
  content = content.replace(/<\/motion\.div>/g, "</View>");
  content = content.replace(/<AnimatePresence>/g, "<View>");
  content = content.replace(/<\/AnimatePresence>/g, "</View>");

  // Replace HTML tags with React Native tags
  content = content.replace(/<div/g, "<View");
  content = content.replace(/<\/div>/g, "</View>");
  content = content.replace(/<span/g, "<Text");
  content = content.replace(/<\/span>/g, "</Text>");
  content = content.replace(/<p/g, "<Text");
  content = content.replace(/<\/p>/g, "</Text>");
  content = content.replace(/<h[1-6]/g, "<Text");
  content = content.replace(/<\/h[1-6]>/g, "</Text>");
  content = content.replace(/<button/g, "<TouchableOpacity");
  content = content.replace(/<\/button>/g, "</TouchableOpacity>");
  content = content.replace(/<img/g, "<Image");
  content = content.replace(/<input/g, "<TextInput");
  content = content.replace(/<form/g, "<View");
  content = content.replace(/<\/form>/g, "</View>");
  content = content.replace(/<nav/g, "<View");
  content = content.replace(/<\/nav>/g, "</View>");
  content = content.replace(/<main/g, "<ScrollView");
  content = content.replace(/<\/main>/g, "</ScrollView>");

  // Events
  content = content.replace(/onClick=/g, "onPress=");

  // Add React Native imports
  content = `import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';\n` + content;

  // Replace Link
  content = content.replace(/<Link to=/g, "<Link href=");

  fs.writeFileSync(destPath, content);
}

ensureDir('app');
if (fs.existsSync('src/pages')) {
  const pages = fs.readdirSync('src/pages');
  pages.forEach(file => {
    if (file.endsWith('.tsx')) {
      let newName = file.toLowerCase();
      if (newName === 'dashboard.tsx') newName = 'index.tsx';
      processFile(`src/pages/${file}`, `app/${newName}`);
    }
  });
}

ensureDir('components');
if (fs.existsSync('src/components')) {
  const components = fs.readdirSync('src/components');
  components.forEach(file => {
    if (file.endsWith('.tsx')) {
      processFile(`src/components/${file}`, `components/${file}`);
    }
  });
}

ensureDir('lib');
if (fs.existsSync('src/lib')) {
  fs.cpSync('src/lib', 'lib', { recursive: true });
}
ensureDir('store');
if (fs.existsSync('src/store')) {
  fs.cpSync('src/store', 'store', { recursive: true });
}

console.log('Migration script completed.');
