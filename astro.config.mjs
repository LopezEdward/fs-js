// @ts-check
import { defineConfig } from 'astro/config';

import node from '@astrojs/node';

import tailwindcss from '@tailwindcss/vite';

import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  adapter: node({
    mode: 'standalone'
  }),

  session: {
    driver: "fs-lite"
  },

  output: "server",

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [preact()]
});