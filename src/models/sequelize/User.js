import { DataTypes } from "sequelize";

export default (sequelize) => {
  const User = sequelize.define("User", {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: { type: DataTypes.STRING, allowNull: false }
  });
  return User;
};

User.associate = (models) => {
  User.hasMany(models.Order, { foreignKey: "userId", as: "orders" });
};
