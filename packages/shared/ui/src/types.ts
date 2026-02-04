/**
 * Button types for the calculator keypad
 */
export type ButtonType = "digit" | "operator" | "action" | "equals";

/**
 * Calculator button configuration
 */
export interface ButtonConfig {
  label: string;
  value: string;
  type: ButtonType;
  span?: number; // For buttons that span multiple columns
}

/**
 * Standard calculator button layout
 */
export const CALCULATOR_BUTTONS: ButtonConfig[][] = [
  [
    { label: "C", value: "clear", type: "action" },
    { label: "(", value: "(", type: "operator" },
    { label: ")", value: ")", type: "operator" },
    { label: "/", value: "/", type: "operator" },
  ],
  [
    { label: "7", value: "7", type: "digit" },
    { label: "8", value: "8", type: "digit" },
    { label: "9", value: "9", type: "digit" },
    { label: "*", value: "*", type: "operator" },
  ],
  [
    { label: "4", value: "4", type: "digit" },
    { label: "5", value: "5", type: "digit" },
    { label: "6", value: "6", type: "digit" },
    { label: "-", value: "-", type: "operator" },
  ],
  [
    { label: "1", value: "1", type: "digit" },
    { label: "2", value: "2", type: "digit" },
    { label: "3", value: "3", type: "digit" },
    { label: "+", value: "+", type: "operator" },
  ],
  [
    { label: "0", value: "0", type: "digit", span: 2 },
    { label: ".", value: ".", type: "digit" },
    { label: "=", value: "equals", type: "equals" },
  ],
];

/**
 * Calculator state
 */
export interface CalculatorState {
  expression: string;
  result: string;
  error: string | null;
  isEvaluated: boolean;
}

/**
 * Calculator actions
 */
export interface CalculatorActions {
  appendValue: (value: string) => void;
  clear: () => void;
  backspace: () => void;
  evaluate: () => void;
  evaluateRemote: () => Promise<void>;
}
