// NOT FOUND MIDDLEWARE
const notFound = (req, res, next) => {
    const error = new Error(`Not Found -${req.originalUrl}`);
    res.status(404);
    next(error);
};

// OTHER ROUTES MIGHT HAVE AN ERROR LIKE A DB LOOKUP OR WE HAVE A ROUTE WHERE WE
// NEED TO RETURN A DIFFERENT STATUS CODE, I DONT WANT EVERY ERROR TO HAVE A 404 STATUS CODE THATS
// WHY 'notFound' WAS CREATED ABOVE BUT BELOW IS A GENERAL ERROR HANDLER SO IN MY OTHER ROUTES IF THEY SET OTHER 
// STATUS CODE THEY WILL JUST FORWARD THE ERROR ON AND THE BELOW FUNCTION WILL HANDLE IT

// ANY OTHER TYPE OF ERROR
const errorHandler = (error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode)
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? '👶' : error.stack,
    })
}

module.exports = {
    notFound,
    errorHandler
};