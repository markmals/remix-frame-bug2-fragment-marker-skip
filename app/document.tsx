import type { Handle, RemixNode } from "remix/ui";

import { routes } from "./routes.ts";

export function Document(handle: Handle<{ children?: RemixNode }>) {
    return () => (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Fragment-nested Frame skips its hydration marker</title>
                <script async type="module" src={routes.assets.href({ path: "app/entry.tsx" })} />
            </head>
            <body style={{ fontFamily: "ui-monospace, monospace", padding: 24, lineHeight: 1.5 }}>
                {handle.props.children}
            </body>
        </html>
    );
}
