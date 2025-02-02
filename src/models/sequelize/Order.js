export default (sequelize, DataTypes) => {
  const Order = sequelize.define("Order", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Pending"
    }
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    Order.hasMany(models.OrderItem, { foreignKey: "orderId", as: "items" });
  };
  return Order;
};
