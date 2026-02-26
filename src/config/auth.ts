const JWT_SECRET = process.env.JWT_SECRET ?? "default_secret_change_me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";
const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? "access_token";
const AUTH_COOKIE_MAX_AGE_DAYS = Number(process.env.AUTH_COOKIE_MAX_AGE_DAYS ?? "7");
const isProduction = process.env.NODE_ENV === "production";

export const jwtConfig = {
  secret: JWT_SECRET,
  expiresIn: JWT_EXPIRES_IN,
} as const;

export const cookieConfig = {
  name: AUTH_COOKIE_NAME,
  options: {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    maxAge: AUTH_COOKIE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000,
    path: "/",
  },
} as const;
