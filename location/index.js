const errMsg = require('../utils/err-msg');
const infoMsg = require('../utils/info');

module.exports = async location => {
  infoMsg(`Finding lat long from location: ${location}`);
  infoMsg(
    `Requesting: https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      location
    )}.json?access_token=${encodeURIComponent(process.env.MAPBOX_KEY)}&limit=1`
  );

  const res = await require('axios').get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      location
    )}.json`,
    {
      params: {
        access_token: process.env.MAPBOX_KEY,
        limit: 1
      }
    }
  );

  if (res.data.features.length) {
    const [lng, lat] = res.data.features[0].center;
    const loc = res.data.features[0].place_name;
    infoMsg(`lat: ${lat}, long: ${lng}, loc: ${loc}`);
    return { lat, lng, loc };
  }

  errMsg('No lat long found');
};
