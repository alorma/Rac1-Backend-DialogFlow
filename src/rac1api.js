var https = require('https');
var axios = require('axios');
var util = require('util');

var programNow = async function ()  {
  var result = await axios.get(`https://api.audioteca.rac1.cat/api/app/v1/now`);
  return result.data.result.program;
}

module.exports = {
  now: programNow
}
