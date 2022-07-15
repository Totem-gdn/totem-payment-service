export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  redis: {
    uri: process.env.REDIS_SOTRAGE_URI || 'redis://127.0.0.1:6379/0',
  },
});
