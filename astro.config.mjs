import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://smartdetector.fwth.ai',
  output: 'static',
  trailingSlash: 'always',
  publicDir: './.site-public',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
