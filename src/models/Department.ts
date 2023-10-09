import {Model, Sequelize, DataTypes} from 'sequelize';

export default function _Department (sequelize: Sequelize) {
  class Department extends Model {
    declare id: number;
    declare deptNo: string;
    declare deptName: string;
  }

  Department.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      deptNo: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      deptName: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
    },
    {
      tableName: 'Department',
      sequelize, // passing the `sequelize` instance is required
    }
  );

  return Department;
};
