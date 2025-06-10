type Config = Record<string, any>;

type ConfigInterface =
  | "port"
  | "access_jwt_scret"
  | "refresh_jwt_scret"
  | "access_token_expires_in"
  | "refresh_token_expires_in"
  | "db_uri";

const _config: Config = {
  port: process.env.PORT,
  access_jwt_scret: process.env.ACCESS_JWT_SCRET,
  refresh_jwt_scret: process.env.REFRESH_JWT_SCRET,
  access_token_expires_in: process.env.ACCESS_JWT_EXPIRE_TIME,
  refresh_token_expires_in: process.env.REFRESH_JWT_EXPIRE_TIME,
  db_uri: process.env.DB_URI,
};

export const config = {
  get(key: ConfigInterface) {
    const value = _config[key];

    if (!value) {
      console.error(`${key} not a valid env`);
      process.exit();
    }
    return value;
  },
};
