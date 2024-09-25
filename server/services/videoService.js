let Vimeo = require('vimeo').Vimeo;
let client = new Vimeo(process.env.VIMEO_CLIENT_ID, process.env.VIMEO_CLIENT_SECRET, process.env.VIMEO_ACCESS_TOKEN);
const fs = require('fs');

const generateUploadLink = async (fileName, fileSize) => {
  return new Promise((resolve, reject) => {
    client.request({
      method: 'POST',
      path: '/me/videos',
      query: {
        name: fileName,
        upload: {
          approach: 'tus',
          size: fileSize
        },
      }
    }, (error, body, statusCode) => {
      if (error) {
        reject({
          status: statusCode || 500,
          message: error.message,
          data: null
        });
      } else {
        resolve({
          status: 200,
          message: 'Upload link generated successfully.',
          data: {
            uri: body.uri,
            uploadLink: body.upload.upload_link
          }
        });
      }
    });
  });
};

const uploadThumbnailService = async (videoUri, thumbnailPath) => {
  try {
    const pictureResponse = await new Promise((resolve, reject) => {
      client.request({
        method: 'GET',
        path: `${videoUri}?fields=metadata.connections.pictures.uri`,
        query: {
          active: true,
          time: 0,
        }
      }, (error, body) => {
        if (error) {
          return reject({ status: 500, message: error.message });
        }
        resolve(body);
      });
    });

    // Get the upload link for the thumbnail
    const uploadLink =  await createThumbnailResource(pictureResponse.metadata.connections.pictures.uri);
    
    // Upload the thumbnail to the video
    const uploadResponse = await fetch(uploadLink, {
      method: 'PUT',
      body: fs.readFileSync(thumbnailPath),
      headers:{
        Authorization: `Bearer ${process.env.VIMEO_ACCESS_TOKEN}`,
        Accept: 'application/vnd.vimeo.*+json;version=3.4',
      }
    });
    if (!uploadResponse.ok) {
      throw { status: uploadResponse.status, message: `Error: ${uploadResponse.statusText}` };
    }

    // Set the thumbnail as active
    const responseData = await uploadResponse.json();
    const path = responseData.Path;
    if (path) {
      const pictureId = path.split('/').pop();
      const patchURL = `${pictureResponse.metadata.connections.pictures.uri}/${pictureId}`;
      const thumbnailResponse = await setThumbnailActive(patchURL);

      // Delete the temporary thumbnail file
      fs.unlink(thumbnailPath, (err) => {
        if (err) {
          return ({
            status: 500,
            message: 'Error deleting temporary file.',
            data: null 
          });
        }
      });
      return thumbnailResponse;
    }
  } catch (error) {
    return {
      status: error.status || 500,
      message: error.message,
      data: null
    };
  }
};

// This function creates a thumbnail resource
const createThumbnailResource = async (picturesUri) => {
  return new Promise((resolve, reject) => {
    client.request({
      method: 'POST',
      path: picturesUri,
      query: {
        upload: {
          approach: 'tus',
        }
      }
    }, (error, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body.link); 
      }
    });
  });
};

// This function sets the thumbnail upload as active
const setThumbnailActive = (picturesUri) => {
  return new Promise((resolve, reject) => {
    client.request({
      method: 'PATCH',
      path: picturesUri,
      query: { 
        active: true, 
        time: 0 
      },
    }, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve({
          status: 200,
          message: 'Thumbnail uploaded successfully.',
          data: null 
        });
      }
    });
  });
};

const uploadMetadataService = async (videoUri, title, description) => {
  return new Promise((resolve, reject) => {
    client.request({
      method: 'PATCH',
      path: videoUri,
      query: {
        name: title,
        description: description
      }
    }, (error, body) => {
      if (error) {
        reject({ status: 500, message: error.message });
      } else {
        resolve({ status: 200, message: 'Video metadata updated successfully', data: body });
      }
    });
  });
};

module.exports = {
  generateUploadLink,
  uploadThumbnailService,
  uploadMetadataService
};
