import { config as dotenvconfig } from "dotenv";
dotenvconfig();

const _config = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  REFRESH_TOKEN: process.env.REFRESH_TOKEN,
  EMAIL_USER: process.env.EMAIL_USER,
  BEATLY_USER: process.env.BEATLY_USER,
  RABITMQ_URI: process.env.RABITMQ_URI,
};

export default Object.freeze(_config);
