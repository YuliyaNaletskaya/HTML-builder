const fs = require('fs');
const path = require('path');
const { mkdir, readdir, copyFile, rm } = require('fs/promises');

async function copyDir(src, dest) {
  try {
    await rm(dest, { recursive: true, force: true });
    await mkdir(dest, { recursive: true});
    const files = await readdir(src, { withFileTypes: true });

    for (const file of files) {
      const srcPath = path.join(src, file.name);
      const destPath = path.join(dest, file.name);

      if (file.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else if (file.isFile()) {
        await copyFile(srcPath, destPath);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

const srcFolder = path.join(__dirname, 'files');
const destFolder = path.join(__dirname, 'files-copy');
copyDir(srcFolder, destFolder);