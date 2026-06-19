// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import viteCompression from "vite-plugin-compression";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    server: {
      proxy: {
        // Forward Lovable asset CDN requests to lovable.dev so images work locally
        "/__l5e": {
          target: "https://lovable.dev",
          changeOrigin: true,
          secure: false,
        },
      },
    },
    // Build optimizations for faster loading
    build: {
      // Enable minification with terser for smaller bundles
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      // Generate smaller chunks
      chunkSizeWarningLimit: 500,
      // Disable source maps in production
      sourcemap: false,
    },
    plugins: [
      // Gzip compression for production builds
      viteCompression({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 1024, // Only compress files > 1kb
      }),
      // Brotli compression (better than gzip)
      viteCompression({
        algorithm: 'brotliCompress',
        ext: '.br',
        threshold: 1024,
      }),
      {
        name: "favicon-fallback",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === "/favicon.ico") {
              req.url = "/favicon.svg";
            }
            next();
          });
        },
      },
    ],
  },
});
