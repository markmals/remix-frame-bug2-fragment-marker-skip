import { createController } from "remix/router";
import { Frame } from "remix/ui";

import { assets } from "./assets.ts";
import { FragmentFrame } from "./fragment-frame.tsx";
import { HostFrame } from "./host-frame.tsx";
import { Document } from "./document.tsx";
import { routes } from "./routes.ts";

/**
 * TEST: a plain SERVER component (NOT a clientEntry) that returns a bare Fragment
 * with a <Frame> as its first child — the same shape as FragmentFrame minus the
 * clientEntry. Does this need the clientEntry boundary, or does it hit it too?
 */
function ServerFragment() {
    return () => (
        <>
            <Frame
                name="srv"
                src={routes.data.href(null, { for: "srv" })}
                fallback={<div>Loading srv…</div>}
            />
            <span style={{ color: "#888" }}>
                {" "}
                ← Frame is the bare Fragment's first child (server-rendered, no clientEntry)
            </span>
        </>
    );
}

export default createController(routes, {
    actions: {
        async assets({ request }) {
            return (await assets.fetch(request)) ?? new Response("Not Found", { status: 404 });
        },

        home({ render }) {
            return render(
                <Document>
                    <h1>Fragment-nested Frame skips its hydration marker</h1>
                    <p>
                        Both frames below are non-blocking (they have a <code>fallback</code>) and
                        are server-resolved in the SSR stream with their target. On hydration, the{" "}
                        <b>Fragment-nested</b> frame fails to adopt its streamed marker and
                        re-fetches on the client — target-less. The{" "}
                        <b>host-wrapped</b> control hydrates cleanly with no client fetch. Watch the
                        console.
                    </p>
                    <section style={{ border: "2px solid #c00", padding: 12, marginBottom: 16 }}>
                        <h2>
                            Bug shape — &lt;Frame&gt; is the first child of a bare Fragment in a
                            clientEntry
                        </h2>
                        <FragmentFrame />
                    </section>
                    <section style={{ border: "2px solid #0a7", padding: 12, marginBottom: 16 }}>
                        <h2>Control — same &lt;Frame&gt;, wrapped in a host &lt;div&gt;</h2>
                        <HostFrame />
                    </section>
                    <section style={{ border: "2px solid #608", padding: 12 }}>
                        <h2>
                            Test — &lt;Frame&gt; first child of a bare Fragment, but in a plain
                            SERVER component (no clientEntry)
                        </h2>
                        <ServerFragment />
                    </section>
                </Document>,
            );
        },

        // The frame endpoint. Echoes the `for` query (which frame asked) and the
        // X-Remix-Target header the request carried. A server (in-stream) resolve
        // carries the frame's name; a buggy client re-fetch carries no target.
        data({ request, url, render }) {
            let forFrame = url.searchParams.get("for") ?? "?";
            let target = request.headers.get("X-Remix-Target");
            let targetless = target == null;
            return render(
                <div
                    data-for={forFrame}
                    data-target={target ?? "(none)"}
                    style={{ color: targetless ? "#c00" : "#0a7", fontWeight: 700 }}
                >
                    frame "{forFrame}" resolved with X-Remix-Target ={" "}
                    {targetless ? "⚠️ (none — client re-fetch)" : target}
                </div>,
            );
        },
    },
});
