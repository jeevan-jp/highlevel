import { Router } from "express";
import UploadController from "../controllers/upload.controller";

const uploadRoutes = Router();

/**
 * Upload flow:
 * 1. Frontend will create chunks of fixed size(~50mb) using File.slice() method
 * 2. before uploading the chunk, it will call /uploads/initiate and call s3 to
 *    initiate CreateMultipartUploadCommand(), and get uploadId, key back
 * 3. Frontend will ask for presigned url using uploadId, key and chunkIndex at at /chunk-presigned-url
 *    and upload file on provided url
 * 4. once all the chunks are uploaded, call /complete to CompleteMultipartUploadCommand() on s3
 *
 * Routes required:
 * 1. POST /uploads/initiate - initiate a multipart upload, sends back uploadId and fileName as key
 * 2. POST /uploads/get-presigned-url - Generates a pre-signed URL for a single part (chunk) of the file - Response: { "presignedUrl": "https://..." }
 * 3. POST /uploads/complete - Finalizes the multipart upload, assembling the parts into a single file on S3. - { "location": "https://..." }
 */

uploadRoutes.post("/initiate", UploadController.initiateMultipartUpload);
uploadRoutes.post("/get-presigned-url", UploadController.getPresignedUrl);
uploadRoutes.post("/complete", UploadController.completeMultipartUpload);

export default uploadRoutes;
