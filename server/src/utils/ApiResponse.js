class ApiResponse {
    constructor(status, data, message , statusCode) {
        return ({
            status,
            message,
            data,
            statusCode
        });
    }
}

module.exports = ApiResponse;