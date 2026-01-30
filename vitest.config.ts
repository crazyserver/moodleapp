
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: [
      { find: '@singletons', replacement: resolve(__dirname, 'src/core/singletons/index.ts') },
      { find: '@singletons/*', replacement: resolve(__dirname, 'src/core/singletons/*') },
      { find: '@addons', replacement: resolve(__dirname, 'src/addons') },
      { find: '@classes', replacement: resolve(__dirname, 'src/core/classes') },
      { find: '@components', replacement: resolve(__dirname, 'src/core/components') },
      { find: '@directives', replacement: resolve(__dirname, 'src/core/directives') },
      { find: '@features', replacement: resolve(__dirname, 'src/core/features') },
      { find: '@pipes', replacement: resolve(__dirname, 'src/core/pipes') },
      { find: '@services', replacement: resolve(__dirname, 'src/core/services') },
      { find: '@coretypes', replacement: resolve(__dirname, 'src/core/types') },
      { find: '@guards', replacement: resolve(__dirname, 'src/core/guards') },
      { find: '@addons/*', replacement: resolve(__dirname, 'src/addons/*') },
      { find: '@classes/*', replacement: resolve(__dirname, 'src/core/classes/*') },
      { find: '@components/*', replacement: resolve(__dirname, 'src/core/components/*') },
      { find: '@directives/*', replacement: resolve(__dirname, 'src/core/directives/*') },
      { find: '@features/*', replacement: resolve(__dirname, 'src/core/features/*') },
      { find: '@pipes/*', replacement: resolve(__dirname, 'src/core/pipes/*') },
      { find: '@services/*', replacement: resolve(__dirname, 'src/core/services/*') },
      { find: '@coretypes/*', replacement: resolve(__dirname, 'src/core/types/*') },
      { find: '@guards/*', replacement: resolve(__dirname, 'src/core/guards/*') },
      { find: '@', replacement: resolve(__dirname, 'src') },
      { find: '@/*', replacement: resolve(__dirname, 'src/*') },
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/testing/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/assets/**/*', 'src/testing/**', 'src/core/initializers/index.ts', 'src/core/features/emulators/services/zip.ts'],
    },
    include: ['src/**/*.test.ts'],
  },
});
