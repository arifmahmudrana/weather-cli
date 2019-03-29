const errMsg = require('../utils/err-msg');
const infoMsg = require('../utils/info');

module.exports = async () => {
  infoMsg(`Searching for lat long from IP`);
  infoMsg(
    `Requesting: https://api.ipdata.co?api-key=${encodeURIComponent(
      process.env.IPDATA_KEY
    )}&limit=1`
  );

  const { data } = await require('axios').get(`https://api.ipdata.co/`, {
    params: {
      'api-key': process.env.IPDATA_KEY,
      limit: 1
    }
  });

  const { latitude: lat, longitude: lng, city, country_name } = data;
  if (!lat || !lng) {
    errMsg('No lat long found');
  }

  loc = `${city}, ${country_name}`;
  infoMsg(`lat: ${lat}, long: ${lng}, loc: ${loc}`);
  return { lat, lng, loc };
};
