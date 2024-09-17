import Simulation from '../models/Simulation.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



export const createSimulation = async (req, res) => {
  const { title, description, algorithm, parameters, results, state } = req.body;
  try {
    const simulation = await Simulation.create({
      title,
      description,
      algorithm,
      parameters,
      results,
      state,
      StudentId: req.user.id
    });
    res.status(201).json(simulation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const getSimulations = async (req, res) => {
  try {
    const simulations = await Simulation.findAll({ where: { StudentId: req.user.id } });
    res.status(200).json(simulations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const getRecentSimulations = async (req, res) => {
  try {
   
    const simulations = await Simulation.findAll({
      where: { StudentId: req.user.id },
      order: [['createdAt', 'DESC']], 
      limit: 5,  
    });
    res.status(200).json(simulations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


export const getSimulation = async (req, res) => {
  const { id } = req.params;
  try {
    const simulation = await Simulation.findOne({ where: { id, StudentId: req.user.id } });
    if (!simulation) {
      return res.status(404).json({ msg: 'Simulation not found' });
    }
    res.status(200).json(simulation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const updateSimulation = async (req, res) => {
  const { id } = req.params;
  const { title, description, algorithm, parameters, results, state } = req.body;
  try {
    let simulation = await Simulation.findOne({ where: { id, StudentId: req.user.id } });
    if (!simulation) {
      return res.status(404).json({ msg: 'Simulation not found' });
    }

    simulation.title = title || simulation.title;
    simulation.description = description || simulation.description;
    simulation.algorithm = algorithm || simulation.algorithm;
    simulation.parameters = parameters || simulation.parameters;
    simulation.results = results || simulation.results;
    simulation.state = state || simulation.state;

    await simulation.save();
    res.status(200).json(simulation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const deleteSimulation = async (req, res) => {
  const { id } = req.params;
  try {
    const simulation = await Simulation.findOne({ where: { id, StudentId: req.user.id } });
    if (!simulation) {
      return res.status(404).json({ msg: 'Simulation not found' });
    }

    await simulation.destroy();
    res.status(200).json({ msg: 'Simulation deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


export const uploadFile = async (req, res) => {
    const { id } = req.params;
    try {
      let simulation = await Simulation.findOne({ where: { id, StudentId: req.user.id } });
      if (!simulation) {
        return res.status(404).json({ msg: 'Simulation not found' });
      }
      simulation.filePath = req.file.path;
      await simulation.save();
  
      res.status(200).json({ msg: 'File uploaded successfully', filePath: req.file.path });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };

  export const downloadFile = async (req, res) => {
    const { id } = req.params;
    try {
      let simulation = await Simulation.findOne({ where: { id, StudentId: req.user.id } });
      if (!simulation || !simulation.filePath) {
        return res.status(404).json({ msg: 'File not found' });
      }
  
      const filePath = path.join(__dirname, '../', simulation.filePath);
      res.download(filePath);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };