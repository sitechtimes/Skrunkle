import mongoose from "mongoose";
export default async((nitroApp) => {
  const config = useRuntimeConfig();
  mongoose;
  .connect(config.Mongo_URI)
  .then(()=> console.log(`Connected to DB`))
  .catch((e)=> console.log(e))
});
