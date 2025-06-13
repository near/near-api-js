import { fixExtensionsPlugin, fixFolderImportsPlugin } from 'esbuild-fix-imports-plugin';
import { defineConfig } from "tsup";

export default defineConfig([
  // Main builds
  {
    splitting: false,
    bundle: false,
    entryPoints: ["src/**/*.ts"],
    format: ["cjs"],
    outDir: "lib/commonjs",
    clean: true,
    dts: true,
    target: "es2022",
    esbuildPlugins: [fixFolderImportsPlugin(), fixExtensionsPlugin()],
  },
  {
    splitting: false,
    bundle: false,
    entryPoints: ["src/**/*.ts"],
    format: ["esm"],
    outDir: "lib/esm",
    dts: true,
    clean: true,
    target: "es2022",
    esbuildPlugins: [fixFolderImportsPlugin(), fixExtensionsPlugin()],
  },
  // Node 10 compatibility - extensionless strategy
  {
    splitting: false,
    bundle: false,
    entryPoints: {
      "ft": "src/ft/index.ts",
      "ft/format": "src/ft/format.ts", 
      "nft": "src/nft/index.ts",
      "mainnet": "src/mainnet/index.ts",
      "testnet": "src/testnet/index.ts"
    },
    format: ["cjs"],
    outDir: ".",
    dts: true,
    target: "es2022",
    outExtension() {
      return {
        js: '.js',
        dts: '.d.ts'
      }
    },
    esbuildPlugins: [fixFolderImportsPlugin(), fixExtensionsPlugin()],
  }
]);