import {Model, Sequelize, DataTypes} from 'sequelize';
import {DataType} from 'sequelize-typescript';

// class Employee extends Model {
//   declare id: number;
//   declare employeeName: string;
//   declare department: string;
//   declare phone: number | null;
//   declare job: string | null;
//   declare sex: string;
//   declare hireDate: string | null;
// }

export default function _Employee (sequelize: Sequelize, DataTypes: typeof DataType) {
  return sequelize.define(
    'Employee',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      employeeName: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      department: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      phone: {
        type: new DataTypes.NUMBER(),
        allowNull: true,
      },
      job: {
        type: new DataTypes.STRING(128),
        allowNull: true,
      },
      sex: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      hireDate: {
        type: new DataTypes.STRING(128),
        allowNull: true,
      },
    },
    {
      tableName: 'Employee',
    }
  );
};
