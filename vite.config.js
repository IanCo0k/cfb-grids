import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import CompressionPlugin from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    CompressionPlugin({
      algorithm: 'gzip',  // Use gzip compression
      ext: /\.jsx$/       // Apply compression to .jsx files
    })
  ]
});

