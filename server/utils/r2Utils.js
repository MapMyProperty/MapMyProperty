const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const r2Client = require('../config/r2Config');

const deleteFromR2 = async (filename) => {
    try {
        const command = new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: filename,
        });
        await r2Client.send(command);
        console.log(`Successfully deleted ${filename} from R2`);
        return true;
    } catch (error) {
        console.error(`Error deleting ${filename} from R2:`, error);
        return false;
    }
};

module.exports = { deleteFromR2 };
