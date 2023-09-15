import {Buffer} from 'buffer';
import {Platform} from 'react-native';
import {getUsernameG} from '../../global';
import {getWithAuth, postWithAuth} from '../../network/auth';
import {profileimage_url} from '../../network/path';

const createFormData = (picture, username) => {
  const data = new FormData();
  data.append('image', {
    name: picture.fileName,
    type: picture.type,
    uri:
      Platform.OS === 'ios' ? picture.uri.replace('file://', '') : picture.uri,
  });
  return data;
};

export const uploadProfileImage = async picture => {
  const username = getUsernameG();
  await postWithAuth(profileimage_url, createFormData(picture), {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const fetchProfileImage = async () => {
  const response = await getWithAuth(profileimage_url, {
    responseType: 'arraybuffer',
  });
  const image = Buffer.from(response, 'binary').toString('base64');
  return image;
};
