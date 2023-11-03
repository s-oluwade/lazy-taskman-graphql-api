import 'dotenv/config';
import {Sequelize} from 'sequelize';
// import _Album from './models/Album.ts';
// import _Artist from './models/Artist.ts';
// import _Track from './models/Track.ts';
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

// const Artist = _Artist(sequelize);
// const Album = _Album(sequelize);
// const Track = _Track(sequelize);
const Task = _Task(sequelize);
const Subtask = _Subtask(sequelize);

export const resolvers = {
  Query: {
    // artists: async () => await Artist.findAll(),
    // artist: async (obj: any, args: any, context: any, info: any) => await Artist.findByPk(args.id),
    // albums: async () => await Album.findAll(),
    // album: async (obj: any, args: any, context: any, info: any) => await Album.findByPk(args.id),
    // tracks: async () => await Track.findAll(),
    // track: async (obj: any, args: any, context: any, info: any) => await Track.findByPk(args.id),
    tasks: async () => {
      const result = await Task.findAll();
      return result;
    },
    task: async (obj: any, args: any, context: any, info: any) => await Task.findByPk(args.id),
    subtasks: async (obj: any, args: any, context: any, info: any) =>
      (await Subtask.findAll()).filter((subtask) => subtask.taskId === args.taskId),
    subtask: async (obj: any, args: any, context: any, info: any) => await Subtask.findByPk(args.id),
  },
  // Artist: {
  //   albums: async (parent: any) => (await Album.findAll()).filter((album) => album.artist_id === parent.id),
  // },
  // Album: {
  //   tracks: async (parent: any) => (await Track.findAll()).filter((track) => track.album_id === parent.id),
  //   artist: async (parent: any) => await Artist.findOne({where: {id: parent.artist_id}}),
  // },
  // Track: {
  //   artist: async (parent: any) => await Artist.findOne({where: {id: parent.artist_id}}),
  //   album: async (parent: any) => await Album.findOne({where: {id: parent.album_id}}),
  // },
  Task: {
    subtasks: async (parent: any) =>
      (await Subtask.findAll()).filter((subtask) => subtask.taskId === parent.id).sort((a, b) => a.index - b.index),
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
      const taskId = subtask?.taskId;
      subtask?.destroy();
      const subtasks = (await Subtask.findAll()).filter((subtask) => subtask.taskId === taskId);

      // sorts the subtasks by index first, then reindexes them
      subtasks
        .sort((a, b) => a.index - b.index)
        .map(async (subtask, index) => {
          // updates the index locally and in the database
          await Subtask.update({index: index}, {where: {id: subtask.id}});
          subtask.index = index;
          return subtask;
        });

      return (await Subtask.findAll()).filter((subtask) => subtask.taskId === taskId);
    },
    /*
     * args.subtask includes:
     * taskId, title
     */
    async addSubtask(_: any, args: any) {
      const subtasks = (await Subtask.findAll()).filter((subtask) => subtask.taskId === args.subtask.taskId);
      // sorts the subtasks by index first, then reindexes them
      subtasks
        .sort((a, b) => a.index - b.index)
        .map(async (subtask, index) => {
          // updates the index locally and in the database
          await Subtask.update({index: index}, {where: {id: subtask.id}});
          subtask.index = index;
          return subtask;
        });

      return await Subtask.create({
        index: subtasks.length,
        ...args.subtask,
      });
    },
    async updateSubtask(_: any, args: any) {
      await Subtask.update(args.edits, {where: {id: args.id}});
      const thisSubtask = await Subtask.findByPk(args.id);
      if (thisSubtask) {
        // get all subtasks in the task
        const subtasks = (await Subtask.findAll()).filter((subtask) => subtask.taskId === thisSubtask.taskId);
        const cursor = subtasks.sort((a, b) => a.index - b.index).findLastIndex((t) => t.status === 'done') + 1;
        let finished = 0;
        let taskStatus = 'todo';
        subtasks.forEach(async (subtask) => {
          if (subtask.status === 'done') {
            finished += 1;
          }
          else if (subtask.status !== 'todo') {
            taskStatus = 'in progress';
          }

          if (subtask.index > cursor) {
            await Subtask.update({status: 'todo'}, {where: {id: subtask.id}});
          }
        });

        const progress = Math.ceil((finished / subtasks.length) * 100);
        if (progress === 100) {
          taskStatus = 'done';
        }

        await Task.update({progress: progress, status: taskStatus, cursor: cursor}, {where: {id: thisSubtask.taskId}});
      }

      return thisSubtask;
    },
    // for now, assumes subtasks have the correct indexing i.e. 0, 1, 2, 3 ...
    async reorderSubtasks(_: any, args: any) {
      const newIndex = args.newIndex;
      const subtaskToBeMoved = await Subtask.findOne({where: {id: args.subtaskId}});
      if (!subtaskToBeMoved || newIndex === subtaskToBeMoved.index) {
        return;
      }
      const oldIndex = subtaskToBeMoved.index;
      const subtasks = (await Subtask.findAll()).filter((subtask) => subtask.taskId === subtaskToBeMoved.taskId);
      const cursor = subtasks.sort((a, b) => a.index - b.index).findLastIndex((t) => t.status === 'done') + 1;

      // newIndex < subtaskToBeMoved.index, meaning we are moving the subtask backwards
      if (newIndex < oldIndex) {
        subtasks.map(async (subtask) => {
          if (subtask.id === subtaskToBeMoved.id) {
            subtask.index = newIndex;
          } else if (subtask.index >= newIndex && subtask.index < oldIndex) {
            subtask.index += 1;
          }

          if (subtask.index > cursor) {
            await Subtask.update({status: 'todo'}, {where: {id: subtask.id}});
          }
          
          await Subtask.update({index: subtask.index}, {where: {id: subtask.id}});
          return subtask;
        });
      }
      // newIndex > subtaskToBeMoved.index, meaning we are moving the subtask forward
      else {
        subtasks.map(async (subtask) => {
          if (subtask.id === subtaskToBeMoved.id) {
            subtask.index = newIndex;
          } else if (subtask.index <= newIndex && subtask.index > oldIndex) {
            subtask.index -= 1;
          }

          if (subtask.index > cursor) {
            await Subtask.update({status: 'todo'}, {where: {id: subtask.id}});
          }

          await Subtask.update({index: subtask.index}, {where: {id: subtask.id}});
          return subtask;
        });
      }

      await Task.update({cursor: cursor}, {where: {id: subtaskToBeMoved.taskId}});

      return subtasks;
    },
  },
};
