const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');

// Load env vars
const envPath = path.join(__dirname, '../.env');
dotenv.config({ path: envPath });

const r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
});

const uploadFileToR2 = async (filePath, fileName) => {
    const fileContent = fs.readFileSync(filePath);

    // Determine content type roughly
    let contentType = 'application/octet-stream';
    if (fileName.endsWith('.png')) contentType = 'image/png';
    if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) contentType = 'image/jpeg';
    if (fileName.endsWith('.webp')) contentType = 'image/webp';
    if (fileName.endsWith('.pdf')) contentType = 'application/pdf';

    const params = {
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileName, // Use original filename as key (or you can add timestamp if needed)
        Body: fileContent,
        ContentType: contentType,
        ACL: 'public-read',
    };

    try {
        await r2Client.send(new PutObjectCommand(params));
        console.log(`✅ Uploaded: ${fileName}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed: ${fileName} - ${error.message}`);
        return false;
    }
};

const migrate = async () => {
    const sourceDir = process.argv[2] || path.join(__dirname, '../public/uploads');

    if (!fs.existsSync(sourceDir)) {
        console.error(`Error: Source directory not found at: ${sourceDir}`);
        console.error('Usage: node scripts/migrateLocalToR2.js <path_to_images_folder>');
        process.exit(1);
    }

    console.log(`--- Starting Migration from: ${sourceDir} ---`);

    try {
        const files = fs.readdirSync(sourceDir);
        let successCount = 0;
        let failCount = 0;

        for (const file of files) {
            if (file === '.DS_Store' || file.startsWith('.')) continue;

            const filePath = path.join(sourceDir, file);
            if (fs.lstatSync(filePath).isDirectory()) continue; // Skip folders

            const success = await uploadFileToR2(filePath, file);
            if (success) successCount++;
            else failCount++;
        }

        console.log('--- Migration Complete ---');
        console.log(`Total Success: ${successCount}`);
        console.log(`Total Failed: ${failCount}`);

    } catch (err) {
        console.error('Migration Error:', err);
    }
};

migrate();
