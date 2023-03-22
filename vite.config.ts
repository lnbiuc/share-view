import { resolve } from 'path';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import path from 'path';

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
const pathSrc = path.resolve(__dirname, 'src');

export default defineConfig({
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
    base: 'https://share.vio.vin/',
    resolve: {
        alias: {
            '@': pathSrc,
        },
    },
    plugins: [
        vue(),
        visualizer(),
        AutoImport({
            imports: ['vue'],
            resolvers: [ElementPlusResolver(), IconsResolver({ prefix: 'Icon' })],
            dts: path.resolve(pathSrc, 'auto-imports.d.ts'),
        }),
        Components({
            resolvers: [
                ElementPlusResolver(),
                IconsResolver({ enabledCollections: ['ep', 'vscode-icons', 'logos', 'material-symbols', 'mdi'] }),
            ],
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
        Icons({
            autoInstall: true,
        }),
    ],
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
            },
            output: {
                manualChunks: (id) => {
                    if (id.includes('node_modules')) {
                        return id.toString().split('node_modules/')[1].split('/')[0].toString();
                    }
                },
                entryFileNames: 'share/js/[name].[hash].js',
                chunkFileNames: 'share/js/[name].[hash].js',
                assetFileNames: 'share/assets/[ext]/[name].[hash].[ext]',
            },
        },
        minify: 'terser',
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
