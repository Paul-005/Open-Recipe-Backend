const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs")

const s3Client = new S3Client({
    region: "us-east-1", // Change to the appropriate region
    endpoint: "https://cellar-c2.services.clever-cloud.com", // Clever Cloud Cellar endpoint
    credentials: {
        accessKeyId: "P4V79PGR6EJSHL2PV8IO",
        secretAccessKey: "YuADCJZDdVEaMpUlChrDdkcdzYPAtZt3oRDFfTGM"
    }
});

module.exports = s3Client;