import { DataTypes } from 'sequelize';
import sequelize from '../config/dbConfig.js';

const Simulation = sequelize.define('Simulation', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  algorithm: { type: DataTypes.STRING, allowNull: false },
  parameters: { type: DataTypes.JSON, allowNull: true },
  results: { type: DataTypes.JSON, allowNull: true },
  state: { type: DataTypes.JSON, allowNull: true },
  filePath: { type: DataTypes.STRING, allowNull: true },  
});

export default Simulation;
