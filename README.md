# Fragment-Nested `<Frame>` Skips Its Hydration Marker

A `<Frame>` that's the first child of a bare fragment in a `clientEntry` doesn't adopt its streamed markers on hydration — it re-fetches on the client (target-less) and ends up duplicating the subtree. Wrap it in a `<div>` and it's fine.

```sh
pnpm install
node --run dev   # localhost:41002
```

Load the page with the console open. The **bug shape** (fragment-nested) re-fetches its frame on the client with no target and you get two copies; the **host-`<div>` control** hydrates clean with one. There's also a plain server-rendered fragment frame (no `clientEntry`) that's fine — so it's specific to the `clientEntry` boundary.

Comes from the comment-skip in `reconcile.ts` (~705): a non-Frame node uses plain `skipComments`, which walks past the `<!-- rmx:f -->` frame-start marker.
