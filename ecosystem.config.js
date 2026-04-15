module.exports = {
    apps: [
      {
        name: "outline-blog",
        script: "npm",
        args: "start",
        instances: "max",
        exec_mode: "cluster",
        env: {
          NODE_ENV: "production",
        },
      },
    ],
  };