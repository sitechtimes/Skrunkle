// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: true,
    runtimeConfig: {
        public:{
            CMS: "http://localhost:3001/static",
            SOCKET_ADDR: "ws://localhost:2000"
            // CMS: "http://localhost:3001/static",
            // SOCKET_ADDR: "ws://localhost:2000"
        }
    },
});
