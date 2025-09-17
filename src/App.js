import './App.css';
import { BrowserRouter } from "react-router-dom";
import ExpenseTracker from "./components/ExpenseTracker"

function App() {
  return (
    <BrowserRouter>
      <ExpenseTracker />
    </BrowserRouter>
  );
}

export default App;
