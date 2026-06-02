import { createAssetServer } from "remix/assets";

import { assetsBase } from "./routes.ts";

export let assets = createAssetServer({
    basePath: assetsBase,
    rootDir: process.cwd(),
    allow: ["app/**", "node_modules/**"],
    fileMap: {
        "/app/*path": "app/*path",
        "/node_modules/*path": "node_modules/*path",
    },
});
