import mongoose from 'mongoose'

const config = useRuntimeConfig()

export default defineNitroPlugin(async (nitroApp) => {
  await mongoose.connect(config.MONGO_URI)
  console.log()
})