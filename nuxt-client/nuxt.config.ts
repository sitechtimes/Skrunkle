// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: true,
    runtimeConfig: {
        public:{
            CMS: "http://skrunkle.siths.dev/static",
            SOCKET_ADDR: "wss://siths2024.com:2001"
        }
    },
});
