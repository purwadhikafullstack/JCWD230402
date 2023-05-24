module.exports = {
  apps: [
    {
      name: "JCWD-2304-02", // Format JCWD-{batchcode}-{groupnumber}
      script: "./projects/server/src/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 2342,
      },
      time: true,
    },
  ],
};
