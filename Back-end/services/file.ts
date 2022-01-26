import { Storage } from '@google-cloud/storage';
import { unlinkSync } from 'fs';
import { util } from 'protobufjs';
import fs = util.fs;

const gcs = new Storage({
  projectId: 'ccu-alexandria-library;',
  keyFilename: './config/serviceAccountKey.json',
});

export async function uploadFile(filename: string, file: string) {
  const bucket = gcs.bucket('gs://ccu-alexandria-library.appspot.com');
  try {
    await fs.writeFile(filename, file, { encoding: 'base64' }, () => {
    });
    await bucket.upload(filename);
    unlinkSync(filename);
  } catch (error) {
    console.error('ERROR: uploadFile', error);
  }
}

export async function getLink(filename: string) {
  const bucket = gcs.bucket('gs://ccu-alexandria-library.appspot.com');
  try {
    const file = await bucket.file(filename);
    const now = new Date();
    const expiration = new Date();
    expiration.setMinutes(now.getMinutes() + 30);
    return (await file.getSignedUrl({
      action: 'read',
      expires: expiration,
    })).pop();
  } catch (error) {
    console.error('ERROR: uploadFile', error);
    return undefined;
  }
}
