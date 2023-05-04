const Sequelize = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const User = require("./user");
const Good = require("./good");
const Auction = require("./auction");
const Image = require("./image");
const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.User = User;
db.Good = Good;
db.Auction = Auction;
db.Image = Image;
User.init(sequelize);
Good.init(sequelize);
Auction.init(sequelize);
Image.init(sequelize);
User.associate(db);
Good.associate(db);
Auction.associate(db);
Image.associate(db);
module.exports = db;
