const { remote } = require("../utils/database.js");
const { logger } = require("../utils/logger.js");

async function create_account(data) {
  try {
    const account = await remote.query(`call adduser('${data.login}','${data.password}','0','0','${data.truename}','0','${data.email}','0','0','0','0','0','0','0','0','0','${data.password}')`);

    if (account) {
      return true;
    }
  } catch (error) {
    logger("error", `A fatal error occurred while create account: ${error.message}`);
  }
  return false;
}

module.exports = { create_account };
