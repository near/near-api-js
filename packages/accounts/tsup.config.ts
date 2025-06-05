import { defineConfig } from "tsup";
import { fixFolderImportsPlugin, fixExtensionsPlugin } from 'esbuild-fix-imports-plugin';

export default defineConfig([{
  splitting: false,
  bundle: false,
  entryPoints: ["src/**/*.ts"],
  format: ["cjs"],
  outDir: "lib/commonjs",
  clean: true,
  dts: true,
  target: "es2022",
  esbuildPlugins: [fixFolderImportsPlugin(), fixExtensionsPlugin()],
}, {
  splitting: false,
  bundle: false,
  entryPoints: ["src/**/*.ts"],
  format: ["esm"],
  outDir: "lib/esm",
  dts: true,
  clean: true,
  target: "es2022",
  esbuildPlugins: [fixFolderImportsPlugin(), fixExtensionsPlugin()],
}]);
