import { opendir, readFile, lstat, writeFile, rename } from 'node:fs/promises';
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

async function cjsIfy(basePath) {
  for (let projectFilePath of await enumerateContents(basePath)) {
    let contents = (await readFile(projectFilePath)).toString();
    const imports = [...contents.matchAll(/require\("(\.\.?\/+[^"]+)"\)/ig)];
    for (let localImport of imports) {
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

    if (imports.length) {
      await writeFile(projectFilePath, contents);
    }

    await rename(projectFilePath, [...projectFilePath.split('.').slice(0, -1), 'cjs'].join('.'));
  }
}

async function listPackagePaths(repoPath) {
  const packages = [];
  for await (let { name } of await opendir(`${repoPath}/packages`)) {
    const buildPath = `${repoPath}/packages/${name}/lib/commonjs`;
    try {
      await lstat(buildPath);
      packages.push(buildPath);
    } catch {}
  }
  return packages;
}

async function getEmAll() {
  const paths = await listPackagePaths(process.cwd());
  await Promise.all(paths.map((p) => cjsIfy(p)))
}

// cjsIfy(path.join(process.cwd(), 'packages/utils/lib/commonjs'));
getEmAll();
