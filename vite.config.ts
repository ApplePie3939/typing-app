import react from '@vitejs/plugin-react';
import { cloudflare } from '@cloudflare/vite-plugin';
import { defineConfig, lazyPlugins } from 'vite-plus';

export default defineConfig({
  fmt: {
    ignorePatterns: ['.cursor/**', 'mockups/**', 'docs/MVP仕様書.md'],
    singleQuote: true,
    semi: true,
  },
  lint: {
    ignorePatterns: ['.cursor/**', 'mockups/**'],
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
    options: { typeAware: true, typeCheck: true },
  },
  plugins: lazyPlugins(() => (process.env.VITEST ? [react()] : [react(), cloudflare()])),
});
