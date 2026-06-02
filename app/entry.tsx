import { run } from "remix/ui";

run({
    async loadModule(moduleUrl, exportName) {
        let mod = await import(moduleUrl);
        let exported = mod[exportName];
        if (typeof exported !== "function") {
            throw new TypeError(`Export "${exportName}" from "${moduleUrl}" is not a function`);
        }
        return exported;
    },

    async resolveFrame(src, signal, target) {
        console.log(
            `[client resolveFrame] src=${src} target=${target ?? "(none — TARGET-LESS)"}`,
        );
        let headers = new Headers({ Accept: "text/html" });
        if (target) headers.set("X-Remix-Target", target);
        let res = await fetch(src, { headers, signal });
        if (!res.ok) return `<pre>Frame error: ${res.status} ${res.statusText}</pre>`;
        return res.body ?? (await res.text());
    },
});
