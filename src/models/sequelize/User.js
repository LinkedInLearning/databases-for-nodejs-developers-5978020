import argon2 from "argon2";

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
      },
      password: { type: DataTypes.STRING, allowNull: false }
    },
    {
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await argon2.hash(user.password);
          }
        }
      }
    }
  );

  User.prototype.setPassword = async function (plainPassword) {
    const hashedPassword = await argon2.hash(plainPassword);
    this.password = hashedPassword;
  };

  User.prototype.comparePassword = async function (plainPassword) {
    return await argon2.verify(this.password, plainPassword);
  };

  User.associate = (models) => {
    User.hasMany(models.Order, { foreignKey: "userId", as: "orders" });
  };
  return User;
};
