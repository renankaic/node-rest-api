module.exports = {
  apps : [{
    name   : "meat-api",
    script : "./dist/main.js",
    instances: 0,
    exec_mode: "cluster",
    env: {
      //Environment variables for the application
      SERVER_PORT: 5000,
      DB_URL: 'mongodb://localhost/meat-api',
      NODE_ENV: 'development'
    },
    env_production: {
      //Environment variables for the application when running on production
      SERVER_PORT: 5001,
      NODE_ENV: 'production'
    }
  }]
}
