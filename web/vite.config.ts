import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 5000,
        proxy: {
            '/api': 'http://localhost:3000',
        },
    },
    envDir: '../',
    build: {
        rollupOptions: {
            input: {
                main: './web/index.html',
                login: './web/login.html',
                register: './web/register.html',
            },
        },
    },
});