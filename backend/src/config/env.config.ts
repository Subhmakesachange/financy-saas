import { getEnv } from "../utils/get-env";

const envConfig = () => ({
  NODE_ENV: getEnv("NODE_ENV", "development"),

  PORT: getEnv("PORT", "8000"),
  BASE_PATH: getEnv("BASE_PATH", "/api"),
  MONGO_URI: getEnv("MONGO_URI", "mongodb+srv://subhajeetofficial999:26znH1fPfxJoRySL@cluster0.xiioece.mongodb.net"),

  JWT_SECRET: getEnv("JWT_SECRET", "secert_jwt"),
  JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "15m") as string,

  JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET", "secert_jwt_refresh"),
  JWT_REFRESH_EXPIRES_IN: getEnv("JWT_REFRESH_EXPIRES_IN", "7d") as string,

  GEMINI_API_KEY: getEnv("GEMINI_API_KEY", "AIzaSyCcnfbq6drfO3zxlp6zMZffw6ge01gjscc"),

  CLOUDINARY_CLOUD_NAME: getEnv("CLOUDINARY_CLOUD_NAME", "dv09g3yhu"),
  CLOUDINARY_API_KEY: getEnv("CLOUDINARY_API_KEY", "342395527737396"),
  CLOUDINARY_API_SECRET: getEnv("CLOUDINARY_API_SECRET", "ahhymC2wg6YLp-aWw6JP2gYAKqA"),

  RESEND_API_KEY: getEnv("RESEND_API_KEY", "re_j6vGHFTW_BVA8reQvRmFqtERLFHohSMBy"),
  RESEND_MAILER_SENDER: getEnv("RESEND_MAILER_SENDER", "Financy "),

  FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN", "http://localhost:5173"),
});

export const Env = envConfig();
