import {Platform} from 'react-native';
import {postWithAuth} from '../../network/auth';
import {uploadimage_url} from '../../network/path';

const createFormData = (images, body = {}) => {
  const data = new FormData();
  images.forEach(image =>
    data.append('image', {
      name: image.fileName,
      type: image.type,
      uri: Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri,
    }),
  );
  Object.keys(body).forEach(key => {
    data.append(key, body[key]);
  });

  return data;
};

export const uploadImages = async images =>
  postWithAuth(uploadimage_url, createFormData(images), {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
