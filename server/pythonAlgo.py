import sys
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
from qiskit.circuit.library import GroverOperator
from qiskit.visualization import plot_histogram

def run_grover(n, target_state):
    # Ensure the target state has the correct length
    if len(target_state) != n:
        raise ValueError(f"Target state length ({len(target_state)}) does not match number of qubits (n={n})")

    # Create a quantum circuit with n qubits
    qc = QuantumCircuit(n)
    qc.h(range(n))  # Apply Hadamard to all qubits

    # Define the oracle for the target state
    oracle = QuantumCircuit(n)
    
    # Apply Z-gate on the qubits that match the target state
    for idx, bit in enumerate(target_state):
        if bit == 1:
            oracle.z(idx)

    # Grover's diffusion operator
    grover_op = GroverOperator(oracle)

    # Apply the Grover operator to the circuit
    qc.compose(grover_op, inplace=True)
    qc.measure_all()

    # Initialize the Aer simulator
    simulator = AerSimulator()

    # Transpile the circuit for the simulator
    compiled_circuit = transpile(qc, simulator)

    # Run the compiled circuit on the simulator
    result = simulator.run(compiled_circuit, shots=1024).result()

    # Get the results of the simulation
    counts = result.get_counts()

    return counts


if __name__ == "__main__":
    # Expecting parameters n and target_state from command line arguments
    n = int(sys.argv[1])
    target_state = [int(x) for x in sys.argv[2].strip('"')]

    result = run_grover(n, target_state)
    print(result)
