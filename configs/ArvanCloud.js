import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
   region: "ir-thr-at1",
  endpoint: process.env.ARVAN_ENDPOINT,
  credentials: {
    accessKeyId: process.env.ARVAN_ACCESS_KEY,
    secretAccessKey: process.env.ARVAN_SECRET_KEY,
  },
  forcePathStyle: true,
});

export default s3;