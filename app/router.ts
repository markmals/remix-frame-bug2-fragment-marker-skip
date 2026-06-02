import { createRouter, type MiddlewareContext } from "remix/router";

import rootController from "./controller.tsx";
import { render } from "./render.ts";
import { routes } from "./routes.ts";

let middleware = [render()] as const;

declare module "remix/router" {
    interface RouterTypes {
        context: MiddlewareContext<typeof middleware>;
    }
}

export let router = createRouter({ middleware });
router.map(routes, rootController);
