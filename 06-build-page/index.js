const fs = require('fs');
const path = require('path');
const { mkdir, readdir, copyFile, readFile, writeFile, rm, unlink } = require('fs/promises');

async function createProjectFolder() {
  const projectPath = path.join(__dirname, 'project-dist');
  await mkdir(projectPath, { recursive: true });
}

async function buildIndex() {
  const templatePath = path.join(__dirname, 'template.html');
  const componentsPath = path.join(__dirname, 'components');
  const indexPath = path.join(__dirname, 'project-dist', 'index.html');

  let template = await readFile(templatePath, 'utf8');
  const componentFiles = await readdir(componentsPath, { withFileTypes: true });

  for (const file of componentFiles) {
    const fileEnd = path.extname(file.name);
    const fileName = path.basename(file.name, fileEnd);

    if (file.isFile() && fileEnd === '.html') {
      const fileContent = await readFile(path.join(componentsPath, file.name), 'utf8');
      const htmlTag = `{{${fileName}}}`;
      template = template.replace(new RegExp(htmlTag, 'g'), fileContent);
    }
  }

  await writeFile(indexPath, template, 'utf8');
  console.log('Create index.htmls');
}

async function mergeStyles() {
  const stylesFolder = path.join(__dirname, 'styles');
  const styleFile = path.join(__dirname, 'project-dist', 'style.css');
  const files = await readdir(stylesFolder, { withFileTypes: true });
  let stylesArr = [];
  for (const file of files) {
    const styleFilePath = path.join(stylesFolder, file.name);
    if (file.isFile() && path.extname(file.name) === '.css') {
      const styleFileContent = await readFile(styleFilePath, 'utf8');
      stylesArr.push(styleFileContent);
    }
  }
  await writeFile(styleFile, stylesArr.join('\n'), 'utf8');
  console.log('Create style.css');
}

async function copyAssets(src, dest) {
  //await rm(dest, { recursive: true, force: true });
  await mkdir(dest, { recursive: true});
  const filesAssets = await readdir(src, { withFileTypes: true });
  for (const file of filesAssets) {
    const srcPath = path.join(src, file.name);
    const destPath = path.join(dest, file.name);
    if (file.isDirectory()) {
      await copyAssets(srcPath, destPath);
    } else if (file.isFile()) {
      await copyFile(srcPath, destPath);
    }
  }
}

async function buildAssets() {
  const srcFolder = path.join(__dirname, 'assets');
  const destFolder = path.join(__dirname, 'project-dist', 'assets');
  await copyAssets(srcFolder, destFolder);
}

async function cleanAssets(dest, srcNames) {
  const destAssetsFiles = await readdir(dest, { withFileTypes: true });

  for (const file of destAssetsFiles) {
    const destFilePath = path.join(dest, file.name);
    if (!srcNames.has(file.name)) {
      if (file.isDirectory()) {
        await rm(destFilePath, { recursive: true, force: true });
      } else if (file.isFile()) {
        await unlink(destFilePath);
      }
    }
  }
}

async function buildPage() {
  try {
    await createProjectFolder();
    await buildIndex();
    await mergeStyles();
    await buildAssets();

    const srcAssets = path.join(__dirname, 'assets');
    const destAssets = path.join(__dirname, 'project-dist', 'assets');
    const srcAssetsFiles = await readdir(srcAssets, { withFileTypes: true });
    const srcNames = new Set(srcAssetsFiles.map(file => file.name));

    await cleanAssets(destAssets, srcNames);
    console.log('Create page');
  } catch (error) {
    console.log(error)
  }  
}

buildPage();
