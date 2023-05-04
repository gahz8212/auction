const Sequelize = require("sequelize");
module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        nick: { type: Sequelize.STRING(20), allowNull: false },
        email: { type: Sequelize.STRING(150), unique: true, allowNull: false },
        password: { type: Sequelize.STRING(150), allowNull: false },
        money: {
          type: Sequelize.INTEGER,
          defaultValue: 1000,
        },
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
        modelName: "User",
        tableName: "users",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.User.hasMany(db.Auction);
    db.User.hasMany(db.Good);
  }
};
