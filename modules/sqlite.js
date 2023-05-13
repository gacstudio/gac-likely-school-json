const sqlite3= require("sqlite3").verbose();
module.exports = class GC_Database{
    db
    constructor(path){
        this.db = new sqlite3.Database(`${path}`, sqlite3.OPEN_READWRITE,(err)=>{
            if(err) return console.error(err.message);
        })
        
    }
    createTable(table, params){
        let query = `CREATE TABLE ${table}(`
        params.forEach((param) => {
            query +=`\n${param.name} ${param.type} ${(param.primary)? 'PRIMARY KEY': ''}${(param.notNull)? 'not null': ''} ${param.check},`;
        });
        (query.endsWith(",")? query = query.slice(0,query.length-1) : query);
        query+=`\n)`;
        
        console.log(query);
        this.db.run(query, (err)=>{
            if(err) return console.error(err.message)
        });
    }
    insertIntoTable(table, params, values){

    }
    readTable(table){
        sql = `SELECT * FROM ${table}`
        db.all(sql,(err,rows)=>{
            if(err) return console.error(err.message)
            rows.forEach((row)=>{
                console.log(row)
            })
        })
    }

    /*
    
    createTable("Users",
    [""])
    */
}