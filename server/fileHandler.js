import { file } from "bun";
import { existsSync, statSync } from "fs";

const handleFileResponse = (req, pathname) => {
    const distPath = `dist/${pathname}`;

    if (existsSync(distPath)) {
        const stats = statSync(distPath);
        if (!stats.isDirectory()) {

            const headers = new Headers({
                "Content-Length": "" + stats.size,
                "Last-Modified": stats.mtime.toUTCString(),
                ETag: `W/"${stats.size}-${stats.mtime.getTime()}"`,
            });

            if (req.headers.get("if-none-match") === headers.get("ETag")) {
                return new Response(null, {status: 304});
            }

            const opts = {code: 200, start: 0, end: Infinity, range: false};

            if (req.headers.has("range")) {
                opts.code = 206;
                let [x, y] = req.headers.get("range").replace("bytes=", "").split("-");
                let end = (opts.end = parseInt(y, 10) || stats.size - 1);
                let start = (opts.start = parseInt(x, 10) || 0);

                if (start >= stats.size || end >= stats.size) {
                    headers.set("Content-Range", `bytes */${stats.size}`);
                    return new Response(null, {
                        headers: headers,
                        status: 416,
                    });
                }

                headers.set("Content-Range", `bytes ${start}-${end}/${stats.size}`);
                headers.set("Content-Length", "" + (end - start + 1));
                headers.set("Accept-Ranges", "bytes");
                opts.range = true;
            }

            if (opts.range) {
                return new Response(file(distPath).slice(opts.start, opts.end), {
                    headers,
                    status: opts.code,
                });
            }

            return new Response(file(distPath), {headers, status: opts.code});
        }
    }

    return null;
}

export default handleFileResponse;