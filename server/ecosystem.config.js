module.exports = {
  apps : [
    {
      name: "garage-remote",
      script: "./bin/www",
      watch: true,
      env: {
        "PORT": 80,
        "NODE_ENV": "prod"
      }
    }
  ]
}

