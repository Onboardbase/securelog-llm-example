const esbuild = require("esbuild");

esbuild.build({
  // ... other config
  external: ["re2"],
});
