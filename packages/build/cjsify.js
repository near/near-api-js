import { lstat, opendir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

async function enumerateContents(contentPath) {
  const dir = await opendir(contentPath);
  let files = [];
  for await (let entry of dir) {
    if (entry.name === 'node_modules') {
      continue;
    }

    const entryPath = path.join(contentPath, entry.name);
    if (entry.isDirectory()) {
      files = [...files, ...(await enumerateContents(entryPath))];
    } else if (entry.name.endsWith('.js')) {
      files.push(entryPath);
    }
  }

  return files;
}

async function cjsIfy() {
  const [,, inputPath] = process.argv;
  const basePath = path.resolve(process.cwd(), inputPath);

  for (let projectFilePath of await enumerateContents(basePath)) {
    let contents = (await readFile(projectFilePath)).toString();
    const relativeImports = [...contents.matchAll(/require\("(\.\.?\/+[^"]+)"\)/ig)];
    for (let localImport of relativeImports) {
      const [matchedText, relativePath] = [...localImport];
      if (relativePath.endsWith('.json')) {
        continue;
      }

      const absolutePath = path.resolve(projectFilePath.split('/').slice(0, -1).join('/'), relativePath);
      let isDirectory = false;
      try {
        isDirectory = (await lstat(absolutePath)).isDirectory();
      } catch { /* lstat has failed because `absolutePath` points to a JS file but is missing the .js extension */ }

      const replacementPath = isDirectory
        ? `${relativePath}/index.cjs`
        : `${relativePath}.cjs`;
      contents = contents.replaceAll(matchedText, `require("${replacementPath}")`);
    }

    if (relativeImports.length) {
      await writeFile(projectFilePath, contents);
    }

    await rename(projectFilePath, [...projectFilePath.split('.').slice(0, -1), 'cjs'].join('.'));
  }
}

(async function() {
  await cjsIfy();
}());
