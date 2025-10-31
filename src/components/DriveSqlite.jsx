import React, { useState } from "react";
import initSqlJs from "sql.js";

// DriveSqlite.jsx
// Simple component that loads an SQLite file from Google Drive (given fileId and access token),
// allows inserting simple key/value rows into a `kv` table, and uploads the updated DB back.
//
// Requirements / assumptions:
// - The user will provide a valid OAuth access token with scope `https://www.googleapis.com/auth/drive.file`
//   or broader (`drive`). The token must be usable from the browser.
// - The Drive file must be the raw SQLite blob (binary). We fetch it with `alt=media`.
// - This component uses sql.js (WASM) to operate on the DB in-memory and exports the updated
//   database bytes which are then uploaded back to Drive using the Drive upload endpoint.
//
// Security note: tokens are handled only in-memory by this component and are not stored.

export default function DriveSqlite() {
    const [accessToken, setAccessToken] = useState("");
    const [fileId, setFileId] = useState("");
    const [loading, setLoading] = useState(false);
    const [dbInstance, setDbInstance] = useState(null);
    const [SQL, setSQL] = useState(null);
    const [rows, setRows] = useState([]);
    const [keyInput, setKeyInput] = useState("");
    const [valueInput, setValueInput] = useState("");
    const [message, setMessage] = useState("");

    async function loadDbFromDrive() {
        if (!accessToken || !fileId) {
            setMessage("Provide access token and fileId");
            return;
        }

        setLoading(true);
        setMessage("");
        try {
            // Initialize sql.js (WASM). locateFile points to the hosted wasm by sql.js project.
            const SQL = await initSqlJs({
                locateFile: (file) => `https://sql.js.org/dist/${file}`,
            });

            // Fetch the raw file bytes from Drive
            const res = await fetch(
                `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Failed to download file: ${res.status} ${text}`);
            }

            const arrayBuffer = await res.arrayBuffer();
            const u8 = new Uint8Array(arrayBuffer);

            // Load DB from bytes
            const db = new SQL.Database(u8);
            setSQL(SQL);
            setDbInstance(db);
            setMessage("DB loaded in memory");
            loadRowsFromDb(db);
        } catch (err) {
            console.error(err);
            setMessage(`Error loading DB: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }

    function loadRowsFromDb(db) {
        try {
            // ensure table exists before selecting
            db.run("CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT);");
            const res = db.exec("SELECT key, value FROM kv;");
            if (!res || res.length === 0) {
                setRows([]);
                return;
            }
            const values = res[0].values || [];
            setRows(values.map((r) => ({ key: r[0], value: r[1] })));
        } catch (err) {
            console.error(err);
            setMessage(`Error reading rows: ${err.message}`);
        }
    }

    function insertIntoDb() {
        if (!dbInstance) {
            setMessage("No DB loaded");
            return;
        }
        if (!keyInput) {
            setMessage("Key is required");
            return;
        }
        try {
            dbInstance.run("CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT);");
            dbInstance.run("INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?);", [
                keyInput,
                valueInput,
            ]);
            setMessage("Row inserted locally in memory");
            loadRowsFromDb(dbInstance);
            setKeyInput("");
            setValueInput("");
        } catch (err) {
            console.error(err);
            setMessage(`Insert error: ${err.message}`);
        }
    }

    async function uploadDbToDrive() {
        if (!dbInstance || !accessToken || !fileId) {
            setMessage("DB, access token and fileId are required to upload");
            return;
        }
        setLoading(true);
        setMessage("");
        try {
            const binary = dbInstance.export(); // Uint8Array
            const blob = new Blob([binary], { type: "application/octet-stream" });

            // Upload the raw bytes back to the same Drive file using media upload (PATCH)
            const uploadUrl = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`;
            const res = await fetch(uploadUrl, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/octet-stream",
                },
                body: blob,
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Upload failed: ${res.status} ${text}`);
            }

            const json = await res.json();
            setMessage(`Upload successful (id: ${json.id || fileId})`);
        } catch (err) {
            console.error(err);
            setMessage(`Upload error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="drive-sqlite-component" style={{ padding: 12 }}>
            <h3>Drive-backed SQLite (experimental)</h3>
            <p style={{ fontSize: 13, color: "#666" }}>
                Paste a Google Drive OAuth access token and the fileId of a SQLite file. The
                component will load the DB into memory (sql.js), allow simple inserts into a
                key/value table, and upload the updated DB back to Drive.
            </p>

            <div style={{ marginBottom: 8 }}>
                <label>Access token (OAuth):</label>
                <input
                    style={{ width: "100%" }}
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    placeholder="ya29..."
                />
            </div>

            <div style={{ marginBottom: 8 }}>
                <label>Drive fileId:</label>
                <input
                    style={{ width: "100%" }}
                    value={fileId}
                    onChange={(e) => setFileId(e.target.value)}
                    placeholder="Google Drive file ID (not URL)"
                />
            </div>

            <div style={{ marginBottom: 8 }}>
                <button onClick={loadDbFromDrive} disabled={loading}>
                    {loading ? "Loading..." : "Load DB from Drive"}
                </button>
                &nbsp;
                <button onClick={uploadDbToDrive} disabled={loading || !dbInstance}>
                    {loading ? "Uploading..." : "Upload DB to Drive"}
                </button>
            </div>

            <hr />

            <div style={{ marginTop: 8 }}>
                <h4>Insert / Update key-value</h4>
                <input
                    placeholder="key"
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                />
                &nbsp;
                <input
                    placeholder="value"
                    value={valueInput}
                    onChange={(e) => setValueInput(e.target.value)}
                />
                &nbsp;
                <button onClick={insertIntoDb} disabled={!dbInstance}>
                    Insert locally
                </button>
            </div>

            <div style={{ marginTop: 12 }}>
                <h4>Rows</h4>
                {rows.length === 0 ? (
                    <div style={{ color: "#666" }}>No rows found</div>
                ) : (
                    <table border={1} cellPadding={6}>
                        <thead>
                            <tr>
                                <th>Key</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r) => (
                                <tr key={r.key}>
                                    <td>{r.key}</td>
                                    <td>{r.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div style={{ marginTop: 12, color: message.startsWith("Error") ? "red" : "green" }}>
                {message}
            </div>

            <div style={{ marginTop: 12, fontSize: 12, color: "#666" }}>
                <strong>Notes:</strong>
                <ul>
                    <li>
                        You must provide a valid OAuth access token with Drive scope (drive.file or drive).
                    </li>
                    <li>
                        This is experimental — the browser downloads the full DB into memory. It's best for
                        small DB files only.
                    </li>
                    <li>
                        The component uses sql.js WASM from the public sql.js CDN. If you need offline
                        behavior, download the wasm and serve it from your app and change locateFile.
                    </li>
                </ul>
            </div>
        </div>
    );
}
