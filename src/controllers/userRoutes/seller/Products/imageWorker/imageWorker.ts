import { parentPort } from 'worker_threads';
import fs from 'fs/promises';
import { cloudinary } from '../../cloudinary';

function generateSevenDigitRandomNumber(): number {
  return Math.floor(1000000 + Math.random() * 9000000);
}

async function processImage(base64ImageData: string): Promise<string> {
  const imageName = generateSevenDigitRandomNumber();
  const filePath = `${imageName}.png`;

  await fs.writeFile(filePath, base64ImageData, 'base64');
  console.log(`File ${filePath} created`);

  const result = await cloudinary.uploader.upload(filePath);
  console.log(`Image uploaded to Cloudinary with URL: ${result.url}`);

  await fs.unlink(filePath);
  console.log(`File ${filePath} removed`);

  return result.url;
}

if (!parentPort) {
  throw new Error('No parent port');
}

parentPort.on('message', async (images: string[]) => {
  try {
    const imageUploadPromises = images.map((element: string) => {
      const base64ImageData = element.replace(/^data:image\/\w+;base64,/, '');
      return processImage(base64ImageData);
    });

    const uploadedImageUrls = await Promise.all(imageUploadPromises);
    parentPort!.postMessage(uploadedImageUrls);
  } catch (error: any) {
    parentPort!.postMessage({ error: error.message });
  }
});
