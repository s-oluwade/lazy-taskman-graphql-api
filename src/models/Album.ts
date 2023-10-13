import {Model, Sequelize, DataTypes} from 'sequelize';

export default function _Album (sequelize: Sequelize) {
  class Album extends Model {
    declare id: number;
    declare name: string;
    declare spotify_id: string;
    declare href: string;
    declare artist_id: string;
    declare release_date: string;
    declare total_tracks: string;
  }

  Album.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      spotify_id: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      href: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      artist_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      release_date: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      total_tracks: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
    },
    {
      tableName: 'Album',
      sequelize, // passing the `sequelize` instance is required
    }
  );

  return Album;
};
