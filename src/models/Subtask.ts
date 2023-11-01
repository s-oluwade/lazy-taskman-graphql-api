import {Model, Sequelize, DataTypes} from 'sequelize';

export default function _Subtask(sequelize: Sequelize) {
  class Subtask extends Model {
    declare id: number;
    declare index: number;
    declare taskId: number;
    declare title: string;
    declare status: string;
  }

  Subtask.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      index: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      taskId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      title: {
        type: new DataTypes.STRING(128),
        allowNull: false,
        defaultValue: 'Step 1',
      },
      status: {
        type: new DataTypes.STRING(128),
        allowNull: false,
        defaultValue: 'todo',
      },
    },
    {
      tableName: 'Subtask',
      sequelize, // passing the `sequelize` instance is required
    }
  );

  Subtask.sync();

  return Subtask;
}
