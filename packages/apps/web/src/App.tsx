import { useState, useCallback } from "react";
import { useCalculator, CALCULATOR_BUTTONS } from "@calculator/ui";
import { createCalculatorClient } from "@calculator/api-client";

const apiClient = createCalculatorClient({
  baseUrl: import.meta.env.VITE_API_URL ?? "http://localhost:3001",
});

export function App() {
  const [useServer, setUseServer] = useState(false);

  const remoteEvaluate = useCallback(async (expression: string) => {
    return apiClient.evaluate(expression);
  }, []);

  const calculator = useCalculator({
    remoteEvaluate: useServer ? remoteEvaluate : undefined,
  });

  const handleButtonClick = useCallback(
    (value: string) => {
      switch (value) {
        case "clear":
          calculator.clear();
          break;
        case "backspace":
          calculator.backspace();
          break;
        case "equals":
          if (useServer) {
            void calculator.evaluateRemote();
          } else {
            calculator.evaluate();
          }
          break;
        default:
          calculator.appendValue(value);
      }
    },
    [calculator, useServer]
  );

  return (
    <div className="calculator">
      <header className="calculator-header">
        <h1>Calculator POC</h1>
        <p>Multi-platform calculator demonstration</p>
      </header>

      <div className="display">
        <div className="expression">{calculator.expression || "\u00A0"}</div>
        <div className={`result ${calculator.error ? "error" : ""}`}>
          {calculator.error
            ? calculator.error
            : calculator.result || "\u00A0"}
          {calculator.isLoading && <span className="loading-indicator" />}
        </div>
      </div>

      <div className="keypad">
        {CALCULATOR_BUTTONS.flat().map((button, index) => (
          <button
            key={index}
            className={`key-button ${button.type}${button.span ? ` span-${button.span}` : ""}`}
            onClick={() => handleButtonClick(button.value)}
            disabled={calculator.isLoading}
          >
            {button.label}
          </button>
        ))}
      </div>

      <div className="toggle-container">
        <input
          type="checkbox"
          id="useServer"
          checked={useServer}
          onChange={(e) => setUseServer(e.target.checked)}
        />
        <label htmlFor="useServer">Use server-side evaluation</label>
      </div>
    </div>
  );
}
