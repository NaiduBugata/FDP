module.exports = {
  apps: [
    {
      name: 'conference-backend',
      script: 'src/server.js',
      instances: 2,
      exec_mode: 'cluster',
      increment_var: 'PORT',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
    },
  ],
}
