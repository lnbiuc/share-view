import { resolve } from 'path';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import Icons from 'unplugin-icons/vite';
import path from 'path';

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
const pathSrc = path.resolve(__dirname, 'src');

export default defineConfig({
    resolve: {
        alias: {
            '@': pathSrc,
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@use "~/styles/element/index.scss" as *;',
            },
        },
    },
    plugins: [
        vue(),
        visualizer(),
        AutoImport({
            imports: ['vue'],
            resolvers: [ElementPlusResolver()],
            dts: path.resolve(pathSrc, 'auto-imports.d.ts'),
        }),
        Components({
            resolvers: [ElementPlusResolver()],
            dts: path.resolve(pathSrc, 'components.d.ts'),
        }),
        splitVendorChunkPlugin(),
        viteCompression({
            verbose: true,
            disable: false,
            threshold: 1024,
            algorithm: 'gzip',
            ext: '.gz',
        }),
        Icons(),
    ],
    server: {
        proxy: {
            '/api': {
                target: 'https://share.vio.vin/api',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
        port: 3000,
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
            },
        },
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
    },
    define: {
        'process.env': {},
    },
});
