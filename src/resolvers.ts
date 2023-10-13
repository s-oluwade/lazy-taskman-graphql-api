import 'dotenv/config';
import {Sequelize} from 'sequelize';
import _Album from './models/Album.ts';
import _Artist from './models/Artist.ts';
import _Track from './models/Track.ts';

const sequelize = new Sequelize(process.env.MYSQLDATABASE!, process.env.MYSQLUSER!, process.env.MYSQLPASSWORD, {
  host: process.env.MYSQLHOST,
  dialect: 'mysql',
  port: Number(process.env.MYSQLPORT),
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
};
