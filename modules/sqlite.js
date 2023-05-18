const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const { IncomingMessage } = require("http");
module.exports = class GC_Database {
    db;
    constructor(path) {
        this.db = new sqlite3.Database(
            `${path}`,
            sqlite3.OPEN_READWRITE,
            (err) => {
                if (err) return console.error(err.message);
            }
        );
    }
    createTable(table, params, QUERY_VERBOSE) {
        let query = `CREATE TABLE ${table}(`;
        params.forEach((param) => {
            query += `\n${param.name} ${param.type} ${
                param.primary ? "PRIMARY KEY" : ""
            }${param.notNull ? "not null" : ""} ${param.check},`;
        });
        query.endsWith(",")
            ? (query = query.slice(0, query.length - 1))
            : query;
        query += `\n)`;

        if (QUERY_VERBOSE) console.log(query);
        this.db.run(query, (err) => {
            if (err) return console.error(err.message);
        });
    }
    insertIntoTable(table, params, values, QUERY_VERBOSE) {
        let query = `INSERT INTO ${table}(`;
        params.forEach((param) => {
            query += `${param},`;
        });
        query.endsWith(",")
            ? (query = query.slice(0, query.length - 1))
            : query;
        query += `) VALUES(`;
        values.forEach((value) => {
            query += `?,`;
        });
        query.endsWith(",")
            ? (query = query.slice(0, query.length - 1))
            : query;
        query += `)`;
        if (QUERY_VERBOSE) console.log(query);

        this.db.run(query, values, (err) => {
            if (err) return console.error(err.message);
        });
    }
    readTable(table, params, QUERY_VERBOSE) {
        let sql = `SELECT `;
        params.forEach((param) => {
            sql += `${param},`;
        });
        sql.endsWith(",") ? (sql = sql.slice(0, sql.length - 1)) : sql;
        sql += ` FROM ${table}`;
        if (QUERY_VERBOSE) console.log(sql);

        this.db.all(sql, (err, rows) => {
            if (err) return console.error(err.message);
            //console.log(rows);
        });
    }

    readTableWhereTo_Client(
        table, // Table name
        params, // Table to read
        where_con, // Where condition
        dest_url, // XHTTP Redirect destination
        original_req, // Original user request
        original_res, // Original instance response
        QUERY_VERBOSE // Print query to console, if true, else continue without printing
    ) {
        var userData = null;
        let sql = `SELECT `;
        params.forEach((param) => {
            sql += `${param},`;
        });
        sql.endsWith(",") ? (sql = sql.slice(0, sql.length - 1)) : sql;
        sql += ` FROM ${table} WHERE ${where_con}`;
        if (QUERY_VERBOSE) console.log(sql);
        var XMLHttpRequest = require("xhr2");

        this.db
            .all(sql, (err, rows) => {
                if (err) return console.error(err.message);
                var xhr = new XMLHttpRequest();
                xhr.open("POST", `${dest_url}`, true);
                xhr.setRequestHeader(
                    "Content-type",
                    "application/x-www-form-urlencoded"
                );
                xhr.onload = function () {
                    // do something to response
                    console.log(this.responseText);
                };

                xhr.send(
                    `result=${JSON.stringify(
                        rows
                    )}&oreq=${original_req}&ores=${original_res}`
                );

                return userData;
            })
            .addListener("", () => {});
    }
};
