const Media = require("../models/video.model")

const getMedia = async () => {
    try {
        const media = Media.find()
        return media
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    getMedia
}