import {DataTypes, Model, Sequelize} from 'sequelize';

export default function _Tasklist(sequelize: Sequelize) {
  class Tasklist extends Model {
    declare id: number;
    declare userId: number;
    declare name: string;
    declare description: string;
  }

  Tasklist.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      name: {
        type: new DataTypes.STRING(128),
        allowNull: false,
        unique: true,
      },
      description: {
        type: new DataTypes.STRING(128),
        allowNull: true,
      },
    },
    {
      tableName: 'TaskList',
      sequelize, // passing the `sequelize` instance is required
    }
  );

  Tasklist.sync();
  // Tasklist.sync({force: false, alter: true});

  return Tasklist;
}
