import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://advisory.zerodaysec.org',
  integrations: [
    tailwind(),
    react(),
  ],
  server: {
    headers: {
      "Content-Security-Policy": "default-src 'self'; frame-src 'self'; img-src 'self' https: data:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; media-src 'self'"
    }
  }
});