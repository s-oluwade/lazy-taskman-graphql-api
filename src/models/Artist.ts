import {Model, Sequelize, DataTypes} from 'sequelize';

export default function _Artist (sequelize: Sequelize) {
  class Artist extends Model {
    declare id: number;
    declare name: string;
    declare spotify_id: string;
    declare href: string;
    declare external_url: string;
  }

  Artist.init(
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
      external_url: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
    },
    {
      tableName: 'Artist',
      sequelize, // passing the `sequelize` instance is required
    }
  );

  return Artist;
};
