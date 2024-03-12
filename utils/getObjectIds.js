const mongoose = require("mongoose");

const getObjectIds = (arr) => {
  return arr.map((item) => mongoose.Types.ObjectId(item.id));
};

module.exports = getObjectIds;
