const CustomApiError = require("./customApiError");

class NotAuthorized extends CustomApiError{
    constructor(message){
        super(message);
        this.statusCode = 401;
    }
}
module.exports = NotAuthorized;