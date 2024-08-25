import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import Simulation from "./Simulation.js";
const Student = sequelize.define("Student", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'student',
  },
  recents: { type: DataTypes.JSON, allowNull: true },
  liked: { type: DataTypes.JSON, allowNull: true },
  resetPasswordToken: { type: DataTypes.STRING, allowNull: true },
  resetPasswordExpires: { type: DataTypes.DATE, allowNull: true },
});
Student.hasMany(Simulation, { as: "savedSimulations" });
Student.hasOne(Simulation, { as: "currentSimulationState" });
export default Student;
