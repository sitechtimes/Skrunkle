// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
        public:{
            CMS: "http://localhost:3001/static",
            SOCKET_IP: "localhost"
        }
    },
});
