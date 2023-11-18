import { serve } from "bun";
import url from "node:url";
import {getPayload, setRecord, updateRecord} from './db';
import routes from "./routes/index.js";
import handleFileResponse from "./fileHandler.js";

serve({
    fetch(req, server) {
        const req_url = url.parse(req.url, true);
        const isJson = req_url.pathname.endsWith(".json");
        const pathname = req_url.pathname.substring(1, isJson ? (req_url.pathname.length - 5) : req_url.pathname.length);
        const query = req_url.query;

        const fileResponse = handleFileResponse(req, pathname);
        if (fileResponse) return fileResponse;

        const responder = routes[pathname];
        if (responder) return responder(req, server, isJson, query);

        //TODO 404;
        return new Response("Bun!");
    },
    websocket: {
        message(ws, message) {
            try {
                const parsed = JSON.parse(message);
                if (parsed.action === "load") {
                    ws.send(`{ "action": "load", "payload": ${getPayload(ws.data.model, ws.data.record, '{}')} }`);
                } else if (parsed.action === "update") {
                    updateRecord(ws.data.model, ws.data.record, parsed.payload, parsed.description);
                    ws.publish(`${ws.data.model}_${ws.data.record}`, message);
                } else if (parsed.action === "force_set") {
                    setRecord(ws.data.model, ws.data.record, parsed.payload);
                    ws.publish(`${ws.data.model}_${ws.data.record}`, `{ "action": "load", "payload": ${JSON.stringify(parsed.payload)} }`);
                }
            } catch (e) {
                console.error(e);
            }
        },
        open(ws) {
            ws.subscribe(`${ws.data.model}_${ws.data.record}`);
        },
        close(ws, code, message) {
            ws.unsubscribe(`${ws.data.model}_${ws.data.record}`);
        },
    }
})