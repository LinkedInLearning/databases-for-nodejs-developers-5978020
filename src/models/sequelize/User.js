export default (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: { type: DataTypes.STRING, allowNull: false }
  });

  User.associate = (models) => {
    User.hasMany(models.Order, { foreignKey: "userId", as: "orders" });
  };
  return User;
};
