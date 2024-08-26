import sys
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
from qiskit.circuit.library import GroverOperator
from qiskit.visualization import plot_histogram

def run_grover(n, target_state):
    # Create a quantum circuit with n qubits
    qc = QuantumCircuit(n)
    qc.h(range(n))  # Apply Hadamard to all qubits

    # Define the oracle for the target state
    oracle = QuantumCircuit(n)
    oracle.z(target_state)

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
    target_state = int(sys.argv[2])

    result = run_grover(n, target_state)
    print(result)
