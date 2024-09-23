const { Model, DataTypes } = require('sequelize');
const { Validator } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User, { foreignKey: 'ownerId' });
    }
  }

Spot.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: {
        args: [false],
        msg: 'Street address is required'
      },
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lat: {
      type: DataTypes.DECIMAL(8, 6),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: -90,
        max: 90,
        isWithinRange(value) {  
          if (value < -90 || value > 90) {
            throw new Error('Latitude must be between -90 and 90');
          }
        }
      },
    },
    lng: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: -180,
        max: 180,
        isWithinRange(value) {
          if (value < -180 || value > 180) {
            throw new Error('Longitude must be between -180 and 180');
          }
        }
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, 
      validate: {
        len: [1, 50],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: {
          args: [0],
          msg: 'Price per day must be a positive number'
        }
      },
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
    modelName: 'Spot',
    tableName: 'Spots',
    timestamps: true,
  }
);

return Spot;
}

