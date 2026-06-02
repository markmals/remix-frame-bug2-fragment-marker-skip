import type { Router } from "remix/router";
import type { RemixNode } from "remix/ui";

import path from "node:path";
import { renderWith } from "remix/middleware/render";
import { createHtmlResponse } from "remix/response/html";
import { renderToStream } from "remix/ui/server";

import { assets } from "./assets.ts";

export function render() {
    return renderWith(context => {
        let request = context.request;
        let router = context.router;

        return function render(node: RemixNode, init?: ResponseInit): Response {
            let stream = renderToStream(node, {
                signal: request.signal,
                async resolveClientEntry(entryId, component) {
                    if (!entryId.startsWith("file://")) {
                        throw new Error(
                            `Expected \`import.meta.url\` for clientEntry ID, received '${entryId}'`,
                        );
                    }
                    let [filePath, fragment] = entryId.split("#");
                    return {
                        href: await assets.getHref(filePath),
                        exportName: fragment || component.name || titleCaseFileName(filePath),
                    };
                },
                resolveFrame(src, target) {
                    console.log(`[server resolveFrame] src=${src} target=${target ?? "(none)"}`);
                    return resolveFrameViaRouter(router, request, src, target);
                },
                onError(error) {
                    console.error(error);
                },
            });

            let headers = new Headers(init?.headers);
            if (!headers.has("Cache-Control")) headers.set("Cache-Control", "no-store");
            return createHtmlResponse(stream, { ...init, headers });
        };
    });
}

async function resolveFrameViaRouter(
    router: Router,
    request: Request,
    src: string,
    target?: string,
) {
    let url = new URL(src, request.url);
    let headers = new Headers(request.headers);
    headers.delete("Accept-Encoding");
    headers.set("Accept", "text/html");
    if (target) headers.set("X-Remix-Target", target);

    let response = await router.fetch(
        new Request(url, { method: "GET", headers, signal: request.signal }),
    );

    if (!response.ok) return `<pre>Frame error: ${response.status} ${response.statusText}</pre>`;
    return response.body ?? (await response.text());
}

function titleCaseFileName(fileUrl: string): string {
    let url = new URL(fileUrl);
    let fileName = path.basename(url.pathname, path.extname(url.pathname));
    return fileName
        .split(/[^A-Za-z0-9]+/)
        .filter(Boolean)
        .map(segment => segment[0]!.toUpperCase() + segment.slice(1))
        .join("");
}
