const handleResSuccess = (res, responseCode, responseMessage, message) => {
    return res.status(responseCode).json({
        responseCode,
        responseMessage,
        data: message.data,
    })
}

module.exports = { handleResSuccess }