import { defineConfig, splitVendorChunkPlugin } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import {visualizer} from 'rollup-plugin-visualizer';
import viteCompression from "vite-plugin-compression";
// @ts-ignore
import { resolve } from "path";
// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
	base: './',
    plugins: [
		vue(),
		visualizer(),
        AutoImport({
            resolvers: [
                ElementPlusResolver(),
            ],
        }),
        Components({
            resolvers: [
                ElementPlusResolver(),
            ],
        }),
        splitVendorChunkPlugin(),
        viteCompression(),
	],
    server: {
        proxy: {
            "/api": {
                target: "https://share.vio.vin/api",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
	build: {
        rollupOptions: {
            input: {
				// @ts-ignore
                main: resolve(__dirname, 'index.html'),
            },
            output: {
                // 最小化拆分包
                manualChunks: (id) => {
					// @ts-ignore
                    if (id.includes('node_modules')) {
                        return id.toString().split('node_modules/')[1].split('/')[0].toString();
                    }
                },
                entryFileNames: 'share/js/[name].[hash].js',
                chunkFileNames: 'share/js/[name].[hash].js',
                assetFileNames: 'share/assets/[ext]/[name].[hash].[ext]',
            }
        }
    },
	define: {
        "process.env": {},
    },
});
