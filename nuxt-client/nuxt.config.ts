// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt";
export default defineNuxtConfig({
  runtimeConfig: {
    MONGO_URI: "mongodb+srv://admin:root@skrunkle.6ninpqg.mongodb.net/test"
  },
});
