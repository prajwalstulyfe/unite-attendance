// PM2 Ecosystem Configuration for Unite Attendance
// Runs all 4 dynamic apps on a single EC2 instance
// Usage: pm2 start ecosystem.config.cjs

module.exports = {
  apps: [
    {
      name: "api",
      cwd: "./apps/api",
      script: "dist/src/main.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
    {
      name: "admin",
      cwd: "./apps/admin",
      script: "node_modules/next/dist/bin/next",
      args: "start --port 3002",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3002,
      },
    },
    {
      name: "kiosk",
      cwd: "./apps/kiosk",
      script: "node_modules/next/dist/bin/next",
      args: "start --port 3003",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "256M",
      env: {
        NODE_ENV: "production",
        PORT: 3003,
      },
    },
    {
      name: "app",
      cwd: "./apps/app",
      script: "node_modules/next/dist/bin/next",
      args: "start --port 3004",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "256M",
      env: {
        NODE_ENV: "production",
        PORT: 3004,
      },
    },
  ],
};
