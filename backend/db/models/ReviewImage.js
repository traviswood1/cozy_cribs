'use strict';
const { Model, DataTypes } = require('sequelize');




module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {
    static associate(models) {
      // define association here
      ReviewImage.belongsTo(models.Review, { foreignKey: 'reviewId' });
    }
  }

ReviewImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    reviewId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Reviews',
        key: 'id'
      },
      onDelete: 'cascade'
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'ReviewImage',
    tableName: 'ReviewImages',
    timestamps: true,
  }
);

return ReviewImage;
}
