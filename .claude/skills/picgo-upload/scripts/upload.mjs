#!/usr/bin/env node
/**
 * PicGo/PicList Image Upload Script
 *
 * Uploads local images to image hosting service via PicGo API.
 *
 * Usage:
 *   node upload.mjs /path/to/image.png [image2.png ...]
 *   PICGO_SERVER="http://custom:port" node upload.mjs /path/to/image.png
 *
 * Output:
 *   - Success: Prints uploaded URLs to stdout (one per line)
 *   - Failure: Prints error to stderr, exits with non-zero code
 *
 * Exit codes:
 *   0 - Success
 *   1 - Upload failed
 *   2 - No images provided
 */

import fs from 'fs';
import path from 'path';
import http from 'http';

// Configuration
const PICGO_SERVER = process.env.PICGO_SERVER || 'http://127.0.0.1:36677';
const UPLOAD_ENDPOINT = '/upload';

// Parse arguments
const imagePaths = process.argv.slice(2);

if (imagePaths.length === 0) {
  console.error('Error: No image paths provided');
  console.error('Usage: node upload.mjs /path/to/image.png [image2.png ...]');
  process.exit(2);
}

// Convert to absolute paths
const absolutePaths = imagePaths.map(p => {
  if (path.isAbsolute(p)) return p;
  return path.resolve(process.cwd(), p);
});

// Validate all paths exist
for (const imgPath of absolutePaths) {
  if (!fs.existsSync(imgPath)) {
    console.error(`Error: File not found: ${imgPath}`);
    process.exit(1);
  }
}

// Parse server URL
const serverUrl = new URL(PICGO_SERVER);

/**
 * Call PicGo upload API
 * @param {string[]} paths - Absolute paths to images
 * @returns {Promise<string[]>} - Uploaded URLs
 */
async function uploadImages(paths) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ list: paths });
    
    const options = {
      hostname: serverUrl.hostname,
      port: serverUrl.port || 80,
      path: UPLOAD_ENDPOINT,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.success && response.result) {
            resolve(response.result);
          } else {
            reject(new Error(response.message || 'Upload failed'));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(new Error(`Connection failed: ${err.message}. Is PicGo/PicList running?`));
    });

    req.write(body);
    req.end();
  });
}

// Main
(async () => {
  try {
    // Debug output to stderr (won't interfere with stdout capture)
    console.error(`Uploading ${absolutePaths.length} image(s) to ${PICGO_SERVER}...`);
    
    const urls = await uploadImages(absolutePaths);
    
    // Output URLs to stdout (one per line)
    for (const url of urls) {
      console.log(url);
    }
    
    console.error(`Successfully uploaded ${urls.length} image(s)`);
    process.exit(0);
    
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
})();
