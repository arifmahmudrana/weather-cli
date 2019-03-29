const errMsg = require('../utils/err-msg');
const infoMsg = require('../utils/info');

module.exports = async (lat, lng) => {
  infoMsg(`Requesting for weather, lat: ${lat} lng: ${lng}`);
  infoMsg(
    `Requesting: https://api.darksky.net/forecast/${
      process.env.DARKSKY_KEY
    }/${lat},${lng}?exclude=minutely,hourly,daily,alerts,flags&units=si`
  );

  const res = await require('axios').get(
    `https://api.darksky.net/forecast/${process.env.DARKSKY_KEY}/${lat},${lng}`,
    {
      params: {
        exclude: 'minutely,hourly,daily,alerts,flags',
        units: 'si'
      }
    }
  );

  const { currently } = res.data;
  if (currently) {
    let {
      summary,
      temperature,
      humidity,
      precipProbability: precipitation
    } = currently;

    temperature += '°C';
    humidity = parseInt(humidity * 100) + '%';
    precipitation = parseInt(precipitation * 100) + '%';

    return {
      summary,
      temperature,
      humidity,
      precipitation
    };
  }

  errMsg('No weather update found');
};
