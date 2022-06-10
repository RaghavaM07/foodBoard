class DbError extends Error{
    constructor(msg, code) {
        super(msg, code) 
        this.code = code
        this.msg = msg
    }
}

module.exports = DbError
