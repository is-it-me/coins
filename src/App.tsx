import CurrencyContainer from "./container/CurrencyContainer";
import "./index.css";
export default function App() {
  const interest: string[] = ["bitcoin", "ethereum", "matic-network", "argon"];
  return (
    <div className="App">
      <CurrencyContainer interest={interest} />
    </div>
  );
}
