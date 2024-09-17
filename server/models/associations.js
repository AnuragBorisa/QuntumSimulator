import Student from './Student.js';
import Simulation from './Simulation.js';

const setupAssociations = () => {
  Student.hasMany(Simulation, { foreignKey: 'StudentId', as: "savedSimulations" });
  Student.hasOne(Simulation, { foreignKey: 'currentSimulationStateId', as: "currentSimulationState" });
  Simulation.belongsTo(Student, { foreignKey: 'StudentId', as: 'student' });
};

export default setupAssociations;
