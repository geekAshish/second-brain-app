type Config = Record<string, any>;

const _config: Config = {
  port: process.env.PORT,
  jwtScret: process.env.JWT_TOKEN,
  expiresIn: process.env.JWT_EXPIRE_TIME,
  dbUri: process.env.DB_URI,
};

export const config = {
  get(key: string) {
    const value = _config[key];

    if (!value) {
      console.error(`${key} not a valid env`);
      process.exit();
    }
    return value;
  },
};
