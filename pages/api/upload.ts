import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
import nextConnect from 'next-connect';
import fileUpload from 'express-fileupload';
import streamifier from 'streamifier';
import { isArray } from 'lodash';

cloudinary.config({
  cloud_name: 'woufu',
  api_key: '534334264257422',
  api_secret: 'sVV07G0T2x5Z0VVMa9m23iK2Wdk',
});

interface MyNextApiRequest extends NextApiRequest {
  files?: fileUpload.FileArray;
}

const apiRoute = nextConnect<MyNextApiRequest, NextApiResponse>({
  // Handle any other HTTP method
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(fileUpload());

// Process a POST request
apiRoute.post(async (req, res) => {
  console.log(req.files.file);

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: 'No files were uploaded.' });
  }

  if (!req.body.upload_preset) {
    return res.status(400).json({ message: 'Upload Preset is required' });
  }

  if (!isArray(req.files.file)) {
    const uploadData = req.files.file.data.toString('base64');
    cloudinary.uploader.upload_large(uploadData, function (error, result) {
      console.log(error, result);
    });
    // try {
    //   const data = await uploadFromBuffer(
    //     req.files.file.data,
    //     req.body.upload_preset
    //   );
    //   console.log(data);
    // } catch (err) {
    //   console.log(err);
    // }
  }

  res.status(200).json({ data: 'success' });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

const uploadFromBuffer = (data: any, upload_preset: string) => {
  return new Promise((resolve, reject) => {
    const cld_upload_stream = cloudinary.uploader.upload_stream(
      { folder: upload_preset },
      (error: any, result: any) => {
        if (error) {
          console.log('cloudinary error', error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    streamifier.createReadStream(data).pipe(cld_upload_stream);
  });
};
