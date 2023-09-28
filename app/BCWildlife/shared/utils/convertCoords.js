import proj4 from 'proj4';

const epsg26910DefForZone = zone => {
  return `+proj=utm +zone=${zone} +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs`;
};

export const latLonToUtm10 = (lat, lon) => {
  try {
    const latParsed = parseFloat(lat.toString());
    const lonParsed = parseFloat(lon.toString());

    console.log(`converting lat: ${latParsed} and lon: ${lonParsed} to UTM10`);

    let zone = Math.floor(lon / 6) + 31;
    if (zone > 60) zone = 60;

    const utm = proj4(
      'EPSG:4326',
      epsg26910DefForZone(zone), // epsg:26910
      [lonParsed, latParsed],
    );

    return {
      easting: utm[0],
      northing: utm[1],
    };
  } catch (e) {
    console.log(
      `Could not convert latlon to UTM10, error ${JSON.stringify(e)}`,
    );
    return {
      easting: undefined,
      northing: undefined,
    };
  }
};

export const utm10ToLatLon = (easting, northing) => {
  try {
    const eastingParsed = parseFloat(easting.toString());
    const northingParsed = parseFloat(northing.toString());

    console.log(`converting easting: ${eastingParsed} and northing: ${northingParsed} to latlon`);

    const latlon = proj4(epsg26910DefForZone(10), 'EPSG:4326', [
      eastingParsed,
      northingParsed,
    ]);
    return {
      lat: latlon[1],
      lon: latlon[0],
    };
  } catch (e) {
    console.log(
      `Could not convert UTM10 to latlon, error ${JSON.stringify(e)}`,
    );
    return {
      lat: undefined,
      lon: undefined,
    };
  }
};
