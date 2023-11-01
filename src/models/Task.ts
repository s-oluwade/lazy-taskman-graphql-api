import {Model, Sequelize, DataTypes} from 'sequelize';

export default function _Task(sequelize: Sequelize) {
  class Task extends Model {
    declare id: number;
    declare title: string;
    declare label: string;
    declare priority: string;
    declare dueDate: string;
    declare status: string;
    declare progress: number;
    declare cursor: number;
  }

  Task.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      label: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      priority: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      dueDate: {
        type: new DataTypes.STRING(128),
        allowNull: true,
      },
      status: {
        type: new DataTypes.STRING(128),
        allowNull: false,
        defaultValue: 'todo',
      },
      progress: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      cursor: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: 'Task',
      sequelize, // passing the `sequelize` instance is required
    }
  );

  Task.sync();

  return Task;
}
