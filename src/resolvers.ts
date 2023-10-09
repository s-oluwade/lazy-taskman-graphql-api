import {Sequelize, DataTypes} from 'sequelize';
import _Employee from './models/Employee.ts';
import _Department from './models/Department.ts';
import 'dotenv/config';

const sequelize = new Sequelize(process.env.MYSQLDATABASE!, process.env.MYSQLUSER!, process.env.MYSQLPASSWORD, {
  host: process.env.MYSQLHOST,
  dialect: 'mysql',
  port: Number(process.env.MYSQLPORT),
  define: {
    freezeTableName: true,
    timestamps: false
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

try {
  await sequelize.authenticate();
  console.log('Connection to sql database through sequelize has been established.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

const Employee = _Employee(sequelize, DataTypes);
const Department = _Department(sequelize);

export const resolvers = {
  Query: {
    employees: async () => await Employee.findAll(),
    departments: async () => await Department.findAll(),
    employee: async (obj: any, args: any, context: any, info: any) => await Employee.findByPk(args.id),
    department: async (obj: any, args: any, context: any, info: any) => await Department.findByPk(args.id)
  },
};
