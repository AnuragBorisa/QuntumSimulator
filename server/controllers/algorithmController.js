import { spawn } from 'child_process';
import Simulation from '../models/Simulation.js';  // Import the Simulation model

export const runAlgorithm = async (req, res) => {
    const { id, algorithm, n, target_state } = req.body;  // Get simulation ID from the body

    if (!id) {
        return res.status(400).json({ error: 'Simulation ID is missing' });
    }

    try {
        console.log(`Running algorithm: ${algorithm}, n: ${n}, target_state: ${target_state}`);

        // Ensure the target state and number of qubits are valid
        if (!n || !target_state) {
            return res.status(400).json({
                error: 'Missing required parameters: n or target_state',
            });
        }

        if (target_state.length !== n) {
            return res.status(400).json({
                error: `Target state length (${target_state.length}) does not match number of qubits (n=${n})`,
            });
        }

        let scriptPath = '';
        switch (algorithm.toLowerCase()) {
            case 'grover':
                scriptPath = './pythonAlgo.py';  // Adjust the path to your Python script
                break;
            default:
                return res.status(400).json({ error: 'Unknown algorithm' });
        }

        console.log(`Executing Python script: ${scriptPath}`);

        // Spawn a child process to run the Python script
        const pythonProcess = spawn('/usr/bin/python3', [scriptPath, n, target_state]);

        let result = '';
        let errorData = '';

        // Capture output from the Python script
        pythonProcess.stdout.on('data', (data) => {
            console.log(`Python Output: ${data.toString()}`);
            result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Algorithm execution error: ${data.toString()}`);
            errorData += data.toString();
        });

        pythonProcess.on('close', async (code) => {
            if (code === 0) {
                console.log(`Algorithm execution result: ${result}`);

                // Update the simulation with the results
                try {
                    const simulation = await Simulation.findByPk(id);  // Find the simulation by its ID
                    if (!simulation) {
                        return res.status(404).json({ error: 'Simulation not found' });
                    }

                    // Update the simulation's results and state
                    simulation.results = result;
                    simulation.state = 'completed';  // Mark as completed
                    await simulation.save();

                    res.status(200).json({ result });
                } catch (err) {
                    console.error('Error updating simulation with results:', err);
                    res.status(500).json({ error: 'Error updating simulation with results' });
                }
            } else {
                console.error(`Python script exited with code: ${code}`);
                res.status(500).json({ error: `Failed to execute algorithm: ${errorData || 'Unknown error'}` });
            }
        });
    } catch (err) {
        console.error('Error running the algorithm:', err);
        res.status(500).json({ error: 'Server error' });
    }
};
