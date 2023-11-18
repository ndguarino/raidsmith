import {serveTimeline} from "./timeline.js";
import {serveHome} from "./home.js";

const routes = {
    "": serveHome,
    timeline: serveTimeline,
}

export default routes;