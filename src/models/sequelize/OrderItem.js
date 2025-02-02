export default (sequelize, DataTypes) => {
  const OrderItem = sequelize.define("OrderItem", {
    sku: {
      type: DataTypes.STRING,
      allowNull: false
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  });

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, { foreignKey: "orderId", as: "Order" });
  };

  return OrderItem;
};
