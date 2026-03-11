#!/usr/bin/env node
/**
 * Post-build script to fix CJS import paths.
 *
 * tsup with bundle:false outputs .cjs files but internal require() calls
 * still reference .js extensions from the TypeScript source. This script
 * rewrites those to .cjs so that CJS resolution works correctly.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const CJS_DIR = join(import.meta.dirname, '..', 'dist', 'cjs');

async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...(await walk(full)));
        } else if (entry.name.endsWith('.cjs')) {
            files.push(full);
        }
    }
    return files;
}

async function fix() {
    const files = await walk(CJS_DIR);
    let fixed = 0;
    for (const file of files) {
        const content = await readFile(file, 'utf8');
        // Match require("./path.js") and replace .js with .cjs
        const updated = content.replace(/require\("(\.[^"]*?)\.js"\)/g, 'require("$1.cjs")');
        if (updated !== content) {
            await writeFile(file, updated);
            fixed++;
        }
    }
    console.log(`Fixed ${fixed} CJS files (${files.length} total)`);
}

fix().catch((err) => {
    console.error(err);
    process.exit(1);
});
