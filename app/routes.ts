import { get, route } from "remix/routes";

export let assetsBase = "/assets";

export let routes = route({
    assets: get(`${assetsBase}/*path`),
    home: get("/"),
    data: get("/data"),
});
