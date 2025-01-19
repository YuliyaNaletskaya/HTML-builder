const fs = require('fs/promises');
const path = require('path');

async function listFiles() {
  try {
    const secretFolder = path.join(__dirname, 'secret-folder');
    const files = await fs.readdir(secretFolder, {
      withFileTypes: true
    });
    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(secretFolder, file.name);
        const stats = await fs.stat(filePath);
        const fileName = path.parse(file.name).name;
        const fileExt = path.extname(file.name).slice(1);
        const fileSizeKB = (stats.size / 1024).toFixed(3);

        console.log(`${fileName} - ${fileExt} - ${fileSizeKB}kB`);
      }
    }
  }
  catch (err) {
    console.log(err);
  }
}

listFiles();