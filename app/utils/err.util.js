
const handleResError = (res, responseCode, responseMessage) => {
    return res.status(200).json({
        responseCode,
        responseMessage,
    })
}

module.exports = { handleResError }