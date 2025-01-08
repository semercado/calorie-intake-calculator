import { CalorieCalculator } from "./components/CalorieCalculator";

function App() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Calorie Intake Calculator
        </h1>
        <CalorieCalculator />
      </div>
    </div>
  );
}

export default App;