module.exports = {
    apps: [{
      name: "calendario-academico",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3003",
      cwd: "C:\\Apache24\\htdocs\\calendario-academico",
      env: {
        NODE_ENV: "production"
      }
    }]
  }