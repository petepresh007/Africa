const { NotAuthorized } = require("../error");
const { verify } = require("jsonwebtoken")

const auth = async (req, res, next) => {
    const authHeaders = req.headers.authorization;

    if (!authHeaders || !authHeaders.startsWith('Bearer')) {
        throw new NotAuthorized("Not authorized to access this route");
    }
    console.log(authHeaders);
    const token = authHeaders.split("=")[1];
    try {
        const decodUser = verify(token, process.env.JWT_SECRET)
        // const {users, userID} = decodUser; one way
        req.users = { users: decodUser.users, userID: decodUser.userID }
        next()
    } catch (error) {
        throw new NotAuthorized("Provide a token")
    }
}

module.exports = auth;