import {Model, Sequelize, DataTypes} from 'sequelize';

export default function _Track (sequelize: Sequelize) {
  class Track extends Model {
    declare id: number;
    declare name: string;
    declare album_id: string;
    declare artist_id: string;
    declare spotify_id: string;
    declare spotify_artist_id: string;
    declare spotify_album_id: string;
    declare external_url: string;
    declare preview_url: string;
  }

  Track.init(
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
      album_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      artist_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      spotify_id: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      spotify_artist_id: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      spotify_album_id: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      external_url: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      preview_url: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
    },
    {
      tableName: 'Track',
      sequelize, // passing the `sequelize` instance is required
    }
  );

  return Track;
};
