const fs = require('fs');
const path = require('path');
const { readdir, readFile, writeFile } = require('fs/promises');

async function mergeStyles() {
  try {
    const stylesFolder = path.join(__dirname, 'styles');
    const styleFile = path.join(__dirname, 'project-dist', 'bundle.css');

    const files = await readdir(stylesFolder, { withFileTypes: true });
    let stylesArr = [];

    for (const file of files) {
      const filePath = path.join(stylesFolder, file.name);
      if (file.isFile() && path.extname(file.name) === '.css') {
        const fileContent = await readFile(filePath, 'utf8');
        stylesArr.push(fileContent);
      }
    }

    await writeFile(styleFile, stylesArr.join('\n'), 'utf8');
    console.log('Create bundle.css');
  } catch (error) {
    console.log(error);
  }
}
mergeStyles();