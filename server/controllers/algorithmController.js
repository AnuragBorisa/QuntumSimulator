import { spawn } from 'child_process';

export const runAlgorithm = (req, res) => {
    const { algorithm, n, target_state } = req.body;

    // Determine the Python script to run based on the algorithm name
    let scriptPath = '';

    switch (algorithm.toLowerCase()) {
        case 'grover':
            scriptPath = './pythonAlgo.py';  // Adjust the path to where your Python script is located
            break;
        // You can add more cases here for different algorithms
        default:
            return res.status(400).json({ msg: 'Unknown algorithm' });
    }

    // Spawn a child process to run the Python script
    const pythonProcess = spawn('/usr/bin/python3', ['./pythonAlgo.py', n, target_state]);


    pythonProcess.stdout.on('data', (data) => {
        res.status(200).json({ result: data.toString() });
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error: ${data}`);
        res.status(500).json({ error: data.toString() });
    });
};
