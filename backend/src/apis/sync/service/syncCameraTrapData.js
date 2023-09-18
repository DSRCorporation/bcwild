const { CameraTrapData, CameraTrapDataPhotos } = require("../models/camera");
const { customCreate } = require("../sequelizeQuery/sync");

const syncCameraTrapData = async (data, { transaction }) => {
  const row = await customCreate(
    CameraTrapData,
    data.data,
    { transaction },
    { record_identifier: data.record_identifier },
  );
  const { photos } = data.data;
  console.debug('photos', photos);
  if (row && photos) {
    const { id } = row;
    const photoPromises = photos.map((photo) =>
      CameraTrapDataPhotos.create(
        {
          image: photo,
          cameraTrapDataId: id,
        },
        { transaction },
      ),
    );
    await Promise.all(photoPromises);
  }
};

module.exports = {
  syncCameraTrapData,
};
