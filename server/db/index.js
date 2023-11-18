import { Database } from "bun:sqlite";
import { applyPatch } from 'fast-json-patch';

export const db = new Database("raidsmith.sqlite", { create: true });

///////////////////////////////////
//Queries
///////////////////////////////////

export const getPayload = (model, record, defaultPayload) => {
    console.log("getPayload", model, record)
    const result = db
        .query("SELECT data FROM raidsmith_cache WHERE model = $model AND record = $record")
        .get({ $model: model, $record: record });

    if (result) {
        console.log(result);
        return result.data;
    }

    return defaultPayload;
}

export const setRecord = (model, record, shape) => {
    db
        .query("INSERT INTO raidsmith_cache (model, record, data) VALUES ($model, $record, $data) ON CONFLICT(model, record) DO UPDATE SET data=excluded.data")
        .run({
            $model: model,
            $record: record,
            $data: JSON.stringify(shape)
        });
}

export const updateRecord = (model, record, patch, description) => {
    try {
        const payload = JSON.parse(getPayload(model, record, "{}"));
        const newPayload = applyPatch(payload, patch, true, false).newDocument;
        console.log("updateRecord", model, record, patch, description, payload, newPayload)

        const queryA = db
            .query("INSERT INTO raidsmith_updates (model, record, inserted_at, change_patch, change_description) VALUES ($model, $record, $inserted_at, $change_patch, $change_description);");
        queryA.run({
                $model: model,
                $record: record,
                $inserted_at: Date.now(),
                $change_patch: JSON.stringify(patch),
                $change_description: description
            });
        console.log("queryA", queryA.toString());

        const queryB = db
            .query("INSERT INTO raidsmith_cache (model, record, data) VALUES ($model, $record, $data) ON CONFLICT(model,record) DO UPDATE SET data=excluded.data");
        queryB.run({
                $model: model,
                $record: record,
                $data: JSON.stringify(newPayload)
            });
        console.log("queryB", queryB.toString())
    } catch (e) {
        console.error(e);
    }
}

///////////////////////////////////
// Migrations
///////////////////////////////////
const checkMigration = (version, migration) => {
    const currentVersion = db.query('PRAGMA user_version;').get()["user_version"];
    if (currentVersion < version) {
        db.exec(migration);
        db.exec(`PRAGMA user_version = ${version};`);
    }
}

checkMigration(1, [
    "CREATE TABLE IF NOT EXISTS",
    "raidsmith_updates",
    "(",
        "model TEXT,",
        "record TEXT,",
        "inserted_at INT,",
        "change_patch TEXT,",
        "change_description TEXT",
    ");"
    ].join(" ")
);

checkMigration(2, [
    "CREATE TABLE IF NOT EXISTS",
    "raidsmith_cache",
    "(",
        "model TEXT,",
        "record TEXT,",
        "data TEXT,",
        "UNIQUE (model, record) ON CONFLICT REPLACE",
    ");"
].join(" "));