
const fs = require('fs');
const archiver = require('archiver');
const path = require('path');

// تأكد من تثبيت مكتبة archiver أولاً
if (!fs.existsSync('./node_modules/archiver')) {
  console.log('جاري تثبيت المكتبات اللازمة...');
  require('child_process').execSync('npm install archiver --no-save', { stdio: 'inherit' });
}

console.log('جاري إنشاء ملف مضغوط للمشروع...');

// إنشاء ملف الأرشيف
const output = fs.createWriteStream('./madrasti-project.zip');
const archive = archiver('zip', {
  zlib: { level: 9 } // مستوى الضغط الأقصى
});

// معالجة أخطاء المخرجات
output.on('close', function() {
  console.log(`✅ تم إنشاء ملف ZIP بحجم ${(archive.pointer() / 1024 / 1024).toFixed(2)} ميجابايت`);
  console.log('يمكنك الآن تنزيل الملف "madrasti-project.zip" من مستكشف الملفات');
});

archive.on('error', function(err) {
  throw err;
});

// توصيل الأرشيف بالملف المخرج
archive.pipe(output);

// إضافة الملفات المهمة فقط
const dirsToInclude = [
  'client', 
  'server', 
  'shared', 
  'attached_assets'
];

const filesToInclude = [
  'package.json', 
  'capacitor.config.json', 
  'tailwind.config.ts', 
  'tsconfig.json', 
  'vite.config.ts'
];

// إضافة المجلدات
dirsToInclude.forEach(dir => {
  archive.directory(dir, dir);
});

// إضافة الملفات الفردية
filesToInclude.forEach(file => {
  if (fs.existsSync(file)) {
    archive.file(file, { name: file });
  }
});

// إغلاق الأرشيف
archive.finalize();
