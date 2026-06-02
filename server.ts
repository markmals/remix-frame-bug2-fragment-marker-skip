import * as http from "node:http";
import { createRequestListener } from "remix/node-fetch-server";

import { router } from "./app/router.ts";

let port = process.env.PORT ? parseInt(process.env.PORT, 10) : 41002;

let server = http.createServer(
    createRequestListener(async (request: Request) => {
        try {
            return await router.fetch(request);
        } catch (error) {
            if (!(request.signal.aborted && error === request.signal.reason)) {
                console.error(error);
            }
            return new Response("Internal Server Error", { status: 500 });
        }
    }),
);

server.listen(port, () => {
    console.log(`bug2 repro running on http://localhost:${port}`);
});

function shutdown() {
    server.close(() => process.exit(0));
    server.closeAllConnections();
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
