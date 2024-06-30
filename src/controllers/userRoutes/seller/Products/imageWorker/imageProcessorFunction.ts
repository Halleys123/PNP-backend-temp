import { Worker } from 'worker_threads';
import path from 'path';
import { ProductModel } from '../../../../../models/products/schema/products';
import mongoose, { Schema } from 'mongoose';
function imageProcessorFunction(images: [], productId: Schema.Types.ObjectId) {
  const worker = new Worker(path.resolve(__dirname, 'imageWorker.ts'));

  worker.postMessage(images);

  worker.on('message', async (result) => {
    console.log(result);
    if (result.error) {
    } else {
      try {
        console.log(JSON.stringify(productId));
        console.log(await ProductModel.findById(productId));
        const pro = await ProductModel.findByIdAndUpdate(productId, {
          $set: { images: result },
        });
        console.log(pro);
      } catch (e) {
        console.log(e);
      }
    }
  });

  worker.on('error', (error) => {});

  worker.on('exit', (code) => {
    if (code !== 0) {
    }
  });
}
export { imageProcessorFunction };
