import { clientEntry, Frame } from "remix/ui";

import { routes } from "./routes.ts";

/**
 * CONTROL. Identical frame, but wrapped in a host <div>. The element's child-diff
 * reaches the <Frame> with the frame-aware skip (`skipCommentsExceptFrameStart`),
 * so the marker survives, the frame adopts its streamed content, and there is NO
 * client re-fetch. The only difference from the bug shape is this wrapper.
 *
 * Its own file so `import.meta.url` is distinct from FragmentFrame's and the named
 * function resolves via `component.name` (the template's pattern).
 */
export let HostFrame = clientEntry(import.meta.url, function HostFrame() {
    return () => (
        <div>
            <Frame
                name="host"
                src={routes.data.href(null, { for: "host" })}
                fallback={<div>Loading host...</div>}
            />
            <span style={{ color: "#888" }}> ← Frame wrapped in a host &lt;div&gt;</span>
        </div>
    );
});
