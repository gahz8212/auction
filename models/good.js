const Sequelize = require("sequelize");
module.exports = class Good extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        name: { type: Sequelize.STRING(30), allowNull: false },

        price: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
        createdAt: {
          type: "TIMESTAMP",
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          type: "TIMESTAMP",
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        paranoid: false,
        modelName: "Good",
        tableName: "goods",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.Good.belongsTo(db.User, { as: "Sold" });
    db.Good.belongsTo(db.User, { as: "Owner" });
    db.Good.hasMany(db.Auction);
    db.Good.hasMany(db.Image);
  }
};
