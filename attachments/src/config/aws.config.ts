import * as AWS from 'aws-sdk';

export const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRECT_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
