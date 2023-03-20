// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
        public:{
            CMS: "http://10.94.168.236:3001/static",
            SOCKET_IP: "10.94.168.236"
        }
    },
});
