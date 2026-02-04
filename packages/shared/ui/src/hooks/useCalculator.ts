import { useCallback, useState } from "react";
import { calculate } from "@calculator/engine";
import type { CalculatorActions, CalculatorState } from "../types.js";

const INITIAL_STATE: CalculatorState = {
  expression: "",
  result: "",
  error: null,
  isEvaluated: false,
};

export interface UseCalculatorOptions {
  /** Optional remote evaluation function */
  remoteEvaluate?: (expression: string) => Promise<{
    ok: boolean;
    result?: string;
    error?: { message: string };
  }>;
}

export interface UseCalculatorReturn extends CalculatorState, CalculatorActions {
  /** Whether a remote evaluation is in progress */
  isLoading: boolean;
}

/**
 * Hook that provides calculator state and actions
 */
export function useCalculator(
  options: UseCalculatorOptions = {}
): UseCalculatorReturn {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(false);

  const appendValue = useCallback((value: string) => {
    setState((prev) => {
      // If we just evaluated, start fresh with the new value
      // unless it's an operator, in which case append to result
      if (prev.isEvaluated) {
        const isOperator = ["+", "-", "*", "/"].includes(value);
        if (isOperator && prev.result) {
          return {
            expression: prev.result + value,
            result: "",
            error: null,
            isEvaluated: false,
          };
        }
        return {
          expression: value,
          result: "",
          error: null,
          isEvaluated: false,
        };
      }

      return {
        ...prev,
        expression: prev.expression + value,
        error: null,
      };
    });
  }, []);

  const clear = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const backspace = useCallback(() => {
    setState((prev) => ({
      ...prev,
      expression: prev.expression.slice(0, -1),
      error: null,
      isEvaluated: false,
    }));
  }, []);

  const evaluate = useCallback(() => {
    setState((prev) => {
      if (!prev.expression.trim()) {
        return prev;
      }

      const response = calculate(prev.expression);

      if (response.ok) {
        return {
          expression: prev.expression,
          result: response.result,
          error: null,
          isEvaluated: true,
        };
      }

      return {
        ...prev,
        error: response.error.message,
        isEvaluated: false,
      };
    });
  }, []);

  const evaluateRemote = useCallback(async () => {
    if (!options.remoteEvaluate || !state.expression.trim()) {
      evaluate();
      return;
    }

    setIsLoading(true);
    try {
      const response = await options.remoteEvaluate(state.expression);

      if (response.ok && response.result) {
        setState((prev) => ({
          expression: prev.expression,
          result: response.result!,
          error: null,
          isEvaluated: true,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error: response.error?.message ?? "Remote evaluation failed",
          isEvaluated: false,
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Network error",
        isEvaluated: false,
      }));
    } finally {
      setIsLoading(false);
    }
  }, [state.expression, options.remoteEvaluate, evaluate]);

  return {
    ...state,
    isLoading,
    appendValue,
    clear,
    backspace,
    evaluate,
    evaluateRemote,
  };
}
