import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import {VantResolver} from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        host: "0.0.0.0"
    },
    plugins: [vue(),
        Components({
            resolvers: [VantResolver()],
        }),
    ],
})
