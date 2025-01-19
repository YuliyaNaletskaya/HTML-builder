const fs = require('fs');
const path = require('path');
const { mkdir, readdir, copyFile, readFile, writeFile, rm } = require('fs/promises');

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
}

async function buildPage() {
  try {
    await createProjectFolder();
    await buildIndex();
  } catch (error) {
    console.log(error)
  }  
}

buildPage();
