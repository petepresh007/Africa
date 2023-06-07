const pageNotFound = (req, res, next)=>res.status(404).json({msg:`<p>404 error</p>, page not found`});
module.exports = pageNotFound;