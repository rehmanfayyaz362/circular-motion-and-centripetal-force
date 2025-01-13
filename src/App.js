import VelocitySimulation from './components/VelocitySimulation';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Circular Motion and Centripetal Force
        </h1>
        <VelocitySimulation />
      </div>
    </div>
  );
}

export default App;