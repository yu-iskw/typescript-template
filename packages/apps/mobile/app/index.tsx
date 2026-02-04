import { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Switch,
  ActivityIndicator,
} from "react-native";
import { useCalculator, CALCULATOR_BUTTONS } from "@calculator/ui";
import { createCalculatorClient } from "@calculator/api-client";
import Constants from "expo-constants";

const API_URL =
  Constants.expoConfig?.extra?.apiUrl ?? "http://localhost:3001";

const apiClient = createCalculatorClient({
  baseUrl: API_URL,
});

export default function CalculatorScreen() {
  const [useServer, setUseServer] = useState(false);

  const remoteEvaluate = useCallback(async (expression: string) => {
    return apiClient.evaluate(expression);
  }, []);

  const calculator = useCalculator({
    remoteEvaluate: useServer ? remoteEvaluate : undefined,
  });

  const handleButtonPress = useCallback(
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

  const getButtonStyle = (type: string) => {
    switch (type) {
      case "operator":
        return styles.operatorButton;
      case "equals":
        return styles.equalsButton;
      case "action":
        return styles.actionButton;
      default:
        return styles.digitButton;
    }
  };

  const getButtonTextStyle = (type: string) => {
    switch (type) {
      case "equals":
        return styles.equalsButtonText;
      case "action":
        return styles.actionButtonText;
      default:
        return styles.buttonText;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.calculator}>
        <View style={styles.header}>
          <Text style={styles.title}>Calculator POC</Text>
          <Text style={styles.subtitle}>Multi-platform demonstration</Text>
        </View>

        <View style={styles.display}>
          <Text style={styles.expression} numberOfLines={2}>
            {calculator.expression || " "}
          </Text>
          <View style={styles.resultRow}>
            <Text
              style={[styles.result, calculator.error && styles.error]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {calculator.error
                ? calculator.error
                : calculator.result || " "}
            </Text>
            {calculator.isLoading && (
              <ActivityIndicator
                size="small"
                color="#4ecca3"
                style={styles.loading}
              />
            )}
          </View>
        </View>

        <View style={styles.keypad}>
          {CALCULATOR_BUTTONS.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((button, btnIndex) => (
                <TouchableOpacity
                  key={btnIndex}
                  style={[
                    styles.button,
                    getButtonStyle(button.type),
                    button.span === 2 && styles.spanTwo,
                  ]}
                  onPress={() => handleButtonPress(button.value)}
                  disabled={calculator.isLoading}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[styles.buttonText, getButtonTextStyle(button.type)]}
                  >
                    {button.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Server-side evaluation</Text>
          <Switch
            value={useServer}
            onValueChange={setUseServer}
            trackColor={{ false: "#3a3a5a", true: "#4ecca3" }}
            thumbColor={useServer ? "#ffffff" : "#a0a0a0"}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  calculator: {
    flex: 1,
    padding: 16,
    justifyContent: "flex-end",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 14,
    color: "#a0a0a0",
    marginTop: 4,
  },
  display: {
    backgroundColor: "#16213e",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    minHeight: 120,
    justifyContent: "flex-end",
  },
  expression: {
    fontSize: 20,
    color: "#a0a0a0",
    textAlign: "right",
    marginBottom: 8,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  result: {
    fontSize: 40,
    fontWeight: "700",
    color: "#4ecca3",
    textAlign: "right",
    flex: 1,
  },
  error: {
    color: "#e94560",
    fontSize: 18,
  },
  loading: {
    marginLeft: 10,
  },
  keypad: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  spanTwo: {
    flex: 2.1,
    aspectRatio: undefined,
    height: 70,
  },
  digitButton: {
    backgroundColor: "#0f3460",
  },
  operatorButton: {
    backgroundColor: "#e94560",
  },
  actionButton: {
    backgroundColor: "#0f3460",
  },
  equalsButton: {
    backgroundColor: "#4ecca3",
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#ffffff",
  },
  actionButtonText: {
    color: "#a0a0a0",
  },
  equalsButtonText: {
    color: "#1a1a2e",
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#2a2a4a",
  },
  toggleLabel: {
    fontSize: 14,
    color: "#a0a0a0",
  },
});
