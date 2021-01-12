module.exports = {
  apps : [{
    name   : "meat-api",
    script : "./dist/main.js",
    instances: 2,
    exec_mode: "cluster",
    watch: true,
    merge_logs: true,
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
