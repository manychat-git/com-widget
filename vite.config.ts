import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: './',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    cssCodeSplit: false,
    cssMinify: true,
    rollupOptions: {
      input: {
        widget: path.resolve(__dirname, 'src/embed.tsx')
      },
      output: {
        format: 'iife',
        name: 'ComWidget',
        entryFileNames: 'widget.js',
        chunkFileNames: 'widget-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'widget.css';
          }
          return 'assets/[name]-[hash][extname]';
        },
        inlineDynamicImports: true,
        manualChunks: undefined
      }
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  },
  css: {
    modules: {
      scopeBehaviour: 'local',
      localsConvention: 'camelCaseOnly',
      generateScopedName: 'com-widget__[local]__[hash:base64:5]'
    },
    postcss: {
      plugins: [
        tailwindcss({
          content: ['./src/**/*.{ts,tsx}'],
          prefix: 'com-',
          important: '#root',
          corePlugins: {
            preflight: false
          }
        }),
        autoprefixer()
      ]
    }
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'three', 
      'd3', 
      '3d-force-graph',
      '@mui/material',
      '@headlessui/react',
      '@radix-ui/react-slider',
      '@radix-ui/react-switch',
      '@radix-ui/react-separator',
      'gsap',
      'gsap/Draggable'
    ],
    esbuildOptions: {
      target: 'es2020'
    }
  }
}));
