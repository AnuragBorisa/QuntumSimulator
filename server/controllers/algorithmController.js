import { spawn } from 'child_process';

export const runAlgorithm = (req, res) => {
    const { algorithm, n, target_state } = req.body;

    console.log(`Running algorithm: ${algorithm}, n: ${n}, target_state: ${target_state}`); // Log input

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
            scriptPath = './pythonAlgo.py'; // Adjust path to Python script
            break;
        default:
            return res.status(400).json({ error: 'Unknown algorithm' });
    }

    console.log(`Executing Python script: ${scriptPath}`); // Log script execution

    const pythonProcess = spawn('/usr/bin/python3', [scriptPath, n, target_state]);

    let result = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (data) => {
        console.log(`Python Output: ${data.toString()}`); // Log Python script output
        result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Algorithm execution error: ${data.toString()}`); // Log Python errors
        errorData += data.toString();
    });

    pythonProcess.on('close', (code) => {
        if (code === 0) {
            console.log(`Algorithm execution result: ${result}`);
            res.status(200).json({ result });
        } else {
            console.error(`Python script exited with code: ${code}`);
            res.status(500).json({ error: `Failed to execute algorithm: ${errorData}` });
        }
    });
};
