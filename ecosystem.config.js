module.exports = {
  apps: [
    {
      name: 'core-service',
      script: './dist/core-service/main.js',
      max_restarts: 10,
      log: './logs/core-service.log',
      env: {
        PORT: 8011,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'wechat-service',
      script: './dist/wechat-service/main.js',
      max_restarts: 10,
      log: './logs/wechat-service.log',
      env: {
        PORT: 8012,
        NODE_ENV: 'production'
      }
    }
  ]
};
