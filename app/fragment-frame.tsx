import { clientEntry, Frame } from "remix/ui";

import { routes } from "./routes.ts";

/**
 * BUG SHAPE. The clientEntry returns a bare Fragment whose FIRST child is a
 * <Frame>. The clientEntry boundary emits `<!-- rmx:h … -->` and the Frame emits
 * `<!-- rmx:f ... -->` back-to-back. During hydration the skip fires on the
 * clientEntry COMPONENT node's insert (reconcile.ts:704-706 -> plain
 * `skipComments`, which walks past ALL comments — client-entries.ts), swallowing
 * the frame-start marker before the Fragment's first-child <Frame> is reached.
 * The <Frame> then can't adopt its streamed content, takes the fresh-insert
 * path, and re-fetches `src` on the client (target-less).
 *
 * Its own file so `import.meta.url` is distinct from HostFrame's and the named
 * function resolves via `component.name` (the template's pattern).
 */
export let FragmentFrame = clientEntry(import.meta.url, function FragmentFrame() {
    return () => (
        <>
            <Frame
                name="fragment"
                src={routes.data.href(null, { for: "fragment" })}
                fallback={<div>Loading frag...</div>}
            />
            <span style={{ color: "#888" }}> ← Frame is the bare Fragment's first child</span>
        </>
    );
});
