const axios = require("axios");
const { logger } = require("../utils/logger.js");

async function captcha(token, ip, secret_key) {
  try {
    const response = await axios.post(`https://challenges.cloudflare.com/turnstile/v0/siteverify`, null, {
      params: {
        secret: secret_key,
        response: token,
        remoteip: ip,
      },
    });
    //logger("info", "Captcha verification response: ", response);
    return response.data.success;
  } catch (error) {
    logger("error", "Error fetching data from Cloudflare: ", error.message);
    return false;
  }
}

module.exports = { captcha };
