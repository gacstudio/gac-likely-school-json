const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
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
    createTable(table, params) {
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

        console.log(query);
        this.db.run(query, (err) => {
            if (err) return console.error(err.message);
        });
    }
    insertIntoTable(table, params, values) {
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
        console.log(query);
        this.db.run(query, values, (err) => {
            if (err) return console.error(err.message);
        });
    }
    readTable(table, params) {
        let sql = `SELECT `;
        params.forEach((param) => {
            sql += `${param},`;
        });
        sql.endsWith(",") ? (sql = sql.slice(0, sql.length - 1)) : sql;
        sql += ` FROM ${table}`;
        console.log(sql);
        this.db.all(sql, (err, rows) => {
            if (err) return console.error(err.message);
            //console.log(rows);
        });
    }

    readTableWhere(table, params, where_con, dest_url) {
        var userData = null;
        let sql = `SELECT `;
        params.forEach((param) => {
            sql += `${param},`;
        });
        sql.endsWith(",") ? (sql = sql.slice(0, sql.length - 1)) : sql;
        sql += ` FROM ${table} WHERE ${where_con}`;
        console.log(sql);
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

                xhr.send(`result=${JSON.stringify(rows)}`);

                return userData;
            })
            .addListener("", () => {});
    }

    /*
    
    createTable("Users",
    [""])
    */
};
