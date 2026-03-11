#!/usr/bin/env node
/**
 * Post-build script to fix CJS import paths.
 *
 * Root cause: when package.json has "type": "module" and tsup runs with
 * bundle:false, esbuild outputs each file as .cjs but does NOT rewrite
 * the internal require() paths. The source files use .js extensions
 * (standard ESM convention), so the CJS output ends up with:
 *
 *   require("./accounts/index.js")   // file is actually index.cjs
 *
 * This is a known tsup/esbuild limitation -- esbuild only resolves imports
 * when bundling. With bundle:false it transpiles each file independently
 * and preserves the original import specifiers verbatim.
 *
 * Note: the js-monorepo (@fastnear/*) has the same issue but hasn't fixed
 * it because consumers primarily use the ESM or IIFE builds.
 *
 * This script rewrites require("./path.js") -> require("./path.cjs") in
 * all .cjs output files so that Node's CJS resolver finds them correctly.
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
