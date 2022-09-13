import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	build: {
		sourcemap: true,
	},
	assetsInclude: ['**/*.data', '**/*.wasm', '**/*.tflite', '**/*.binarypb'],
})
