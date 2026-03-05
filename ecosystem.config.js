module.exports = {
  apps: [
    {
      name: 'drug-system-ui-demo',
      script: 'npm',
      args: 'run start',
      interpreter: 'none',
      cwd: 'C:/xampp/htdocs/drug-system-ui-demo',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      watch: false,
      max_memory_restart: '512M',
      out_file: 'C:/xampp/htdocs/drug-system-ui-demo/logs/pm2-out.log',
      error_file: 'C:/xampp/htdocs/drug-system-ui-demo/logs/pm2-error.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
