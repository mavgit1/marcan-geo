import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	// The municipality geometry (~580 kB, ~180 kB gzipped) is one chunk,
	// loaded only when the export includes municipalities.
	build: { chunkSizeWarningLimit: 650 }
});
