const Media = require("../models/video.model")
const { deleteFile } = require("./s3.service")

const getMedia = async () => {
    try {
        const media = await Media.find().populate({
            path: 'author',
            select: 'avatar name lastname email'
          });
        return media
    } catch (error) {
        console.error(error)
    }
}

const deleteMedia = async (id) => {
    try {
        const media = await Media.findByIdAndDelete(id)
        await deleteFile(media.filename)
    } catch (error) {
        console.error(error)
        throw new Error("Hubo un error al eliminar la data")
    }
}

module.exports = {
    getMedia,
    deleteMedia,
}