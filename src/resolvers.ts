import 'dotenv/config';
import {Sequelize} from 'sequelize';
import _Album from './models/Album.ts';
import _Artist from './models/Artist.ts';
import _Track from './models/Track.ts';
import _Task from './models/Task.ts';
import _Subtask from './models/Subtask.ts';
import mysql2 from 'mysql2';

const sequelize = new Sequelize(process.env.MYSQLDATABASE!, process.env.MYSQLUSER!, process.env.MYSQLPASSWORD, {
  host: process.env.MYSQLHOST,
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: true,
    },
  },
  define: {
    freezeTableName: true,
    timestamps: false,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

sequelize
  .getQueryInterface()
  .showAllSchemas()
  .then((tableObj) => {
    console.log('// Tables in database', '==========================');
    console.log(tableObj);
  })
  .catch((err) => {
    console.log('showAllSchemas ERROR', err);
  });

try {
  await sequelize.authenticate();
  console.log('Connection to sql database through sequelize has been established.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

// const Employee = _Employee(sequelize, DataTypes);
// const Department = _Department(sequelize);
const Artist = _Artist(sequelize);
const Album = _Album(sequelize);
const Track = _Track(sequelize);
const Task = _Task(sequelize);
const Subtask = _Subtask(sequelize);

export const resolvers = {
  Query: {
    // employees: async () => await Employee.findAll(),
    // departments: async () => await Department.findAll(),
    // employee: async (obj: any, args: any, context: any, info: any) => await Employee.findByPk(args.id),
    // department: async (obj: any, args: any, context: any, info: any) => await Department.findByPk(args.id),
    artists: async () => await Artist.findAll(),
    artist: async (obj: any, args: any, context: any, info: any) => await Artist.findByPk(args.id),
    albums: async () => await Album.findAll(),
    album: async (obj: any, args: any, context: any, info: any) => await Album.findByPk(args.id),
    tracks: async () => await Track.findAll(),
    track: async (obj: any, args: any, context: any, info: any) => await Track.findByPk(args.id),
    tasks: async () => await Task.findAll(),
    task: async (obj: any, args: any, context: any, info: any) => await Task.findByPk(args.id),
    subtasks: async () => await Subtask.findAll(),
    subtask: async (obj: any, args: any, context: any, info: any) => await Subtask.findByPk(args.id),
  },
  Artist: {
    albums: async (parent: any) => (await Album.findAll()).filter((album) => album.artist_id === parent.id),
  },
  Album: {
    tracks: async (parent: any) => (await Track.findAll()).filter((track) => track.album_id === parent.id),
    artist: async (parent: any) => await Artist.findOne({where: {id: parent.artist_id}}),
  },
  Track: {
    artist: async (parent: any) => await Artist.findOne({where: {id: parent.artist_id}}),
    album: async (parent: any) => await Album.findOne({where: {id: parent.album_id}}),
  },
  Task: {
    subtasks: async (parent: any) => (await Subtask.findAll()).filter((subtask) => subtask.taskId === parent.id),
  },
  Subtask: {
    task: async (parent: any) => await Task.findOne({where: {id: parent.taskId}}),
  },
  Mutation: {
    async deleteTask(_: any, args: any) {
      const task = await Task.findOne({where: {id: args.id}});
      task?.destroy();
      // also delete subtasks
      await Subtask.destroy({where: {taskId: args.id}});
      return await Task.findAll();
    },
    /*
     * args.task includes:
     * title, label, priority, dueDate?
     */
    async addTask(_: any, args: any) {
      const createdTask = await Task.create({
        ...args.task,
      });

      await Subtask.create({
        index: (await Subtask.findAll()).length,
        taskId: createdTask.id,
      });

      return createdTask;
    },
    async updateTask(_: any, args: any) {
      await Task.update(args.edits, {where: {id: args.id}});

      return await Task.findOne({where: {id: args.id}});
    },

    async deleteSubtask(_: any, args: any) {
      const subtask = await Subtask.findOne({where: {id: args.id}});
      subtask?.destroy();
      return await Subtask.findAll();
    },
    /*
     * args.subtask includes:
     * taskId, title
     */
    async addSubtask(_: any, args: any) {
      return await Subtask.create({
        index: (await Subtask.findAll()).length,
        ...args.subtask,
      });
    },
    async updateSubtask(_: any, args: any) {
      await Subtask.update(args.edits, {where: {id: args.id}});

      return await Subtask.findOne({where: {id: args.id}});
    },
    async reorderSubtasks(_: any, args: any) {
      const taskId = args.taskId;
      const subtaskId = args.subtaskId;
      const newIndex = args.newIndex;
      const subtaskToBeMoved = await Subtask.findOne({where: {id: subtaskId}});
      if (!subtaskToBeMoved || newIndex === subtaskToBeMoved.index) {
        return;
      }
      const oldIndex = subtaskToBeMoved.index;
      const subtasks = (await Subtask.findAll()).filter((subtask) => subtask.taskId === taskId);

      // newIndex < subtaskToBeMoved.index, meaning we are moving the subtask backwards
      if (newIndex < oldIndex) {
        subtasks.map((subtask) => {
          if (subtask.id === subtaskToBeMoved.id) {
            subtask.index = newIndex;
            return subtask;
          } else if (subtask.index >= newIndex && subtask.index < oldIndex) {
            subtask.index += 1;
            return subtask;
          }
        });
      }
      // newIndex > subtaskToBeMoved.index, meaning we are moving the subtask forward
      else {
        subtasks.map((subtask) => {
          if (subtask.id === subtaskToBeMoved.id) {
            subtask.index = newIndex;
            return subtask;
          } else if (subtask.index <= newIndex && subtask.index > oldIndex) {
            subtask.index -= 1;
            return subtask;
          }
        });
      }
    },
  },
};
