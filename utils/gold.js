const { remote } = require("../utils/database.js");
const { logger } = require("../utils/logger.js");

async function add_gold(account, gold) {
  try {
    const gold_add = gold * 100;
    const usercashnow = await remote.query(`call usecash('${account}', '1', '0', '1', '0', '${gold_add}', '1', @error)`);

    if (usercashnow) {
      return true;
    }
  } catch (error) {
    logger("error", `A fatal error occurred while adding gold: ${error.message}`);
  }
  return false;
}

module.exports = { add_gold };
