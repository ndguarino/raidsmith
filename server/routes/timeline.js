import { file } from 'bun';
import {getPayload} from "../db/index.js";

export const serveTimeline = (req, server, isJson, query) => {
    const timelineId = query.t;

    if (!isJson && timelineId) {
        if (server.upgrade(req, {
            data: {
                model: "timeline",
                record: timelineId,
            }
        })) return null; // Do not return a response;

        return new Response(file(`dist/index.html`));
    }

    if (isJson && timelineId) {
        return new Response(getPayload('timeline', timelineId, '{}')); // TODO send a proper payload
    }

    return new Response("404 Not Found", { status: 404 });
}