module.exports = {
  getEnv(key, throwOnMissing, defaultValue) {
    const value = process[key];
    if (!value && throwOnMissing) {
      throw new Error(`Missing ${key} on environment variables`);
    }
    return value ?? defaultValue;
  },
};
