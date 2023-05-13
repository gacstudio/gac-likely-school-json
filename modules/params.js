module.exports = class Params {
    constructor(name="", type="", primary = false, notNull = false, check="") {
        this.name = name;
        this.type = type;
        this.primary = primary;
        this.notNull = notNull;
        this.check = this.#isCheck(check);
    }
//Params("Name","Varchar(100)", ,notNull)
    #isCheck(ch) {
        if (!/check\([a-zA-Z]*\)/.test(ch))
            return ""
        return ch
    }
}