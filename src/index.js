//index.js

// Import necessary functions and objects
import {
  displayTransactions,
  updateChart,
  transactions,
} from "./modules/transactions.js";

// Function to parse transactions from text input
function parseTransactions(text) {
  const parsedTransactions = [];

  // Split input into lines and process each line
  const lines = text.split("\n");
  lines.forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine.length === 0) return; // Skip empty lines
    const parts = trimmedLine.split("\t");
    if (parts.length >= 4) {
      const date = parts[0].trim();
      const description = parts[1].trim(); // Not used now
      // Replace all non-digit characters except for minus and comma, then replace comma with a period
      const amountString = parts[2].replace(/[^\d,-]/g, "").replace(",", ".");
      const amount = parseFloat(amountString);

      const accountBalanceString = parts[3]
        .replace(/[^\d,-]/g, "")
        .replace(",", ".");
      const accountBalance = parseFloat(accountBalanceString); // Not used for now

      if (!isNaN(amount)) {
        parsedTransactions.push({
          category: "Undefined",
          amount: amount,
          date: date,
        });
      }
    }
  });
  return parsedTransactions;
}

// Event listener for adding transactions
document.getElementById("addTransactionsBtn").addEventListener("click", () => {
  const inputText = document.getElementById("transactionInput").value;
  const newTransactions = parseTransactions(inputText);

  // Clear textarea after parsing
  document.getElementById("transactionInput").value = "";

  // Add new transactions to the existing transactions array
  transactions.push(...newTransactions);
  // Redisplay transactions and update chart
  displayTransactions();
  updateChart();
});

// Event listeners for checkboxes
document.getElementById("showIncome").addEventListener("change", updateChart);
document.getElementById("showExpenses").addEventListener("change", updateChart);
document
  .querySelectorAll(".filterYear")
  .forEach((cb) => cb.addEventListener("change", updateChart));
document
  .querySelectorAll(".filterMonth")
  .forEach((cb) => cb.addEventListener("change", updateChart));
document
  .querySelectorAll(".filterCategory")
  .forEach((cb) => cb.addEventListener("change", updateChart));

// When the document is fully loaded, render the transactions and the chart
document.addEventListener("DOMContentLoaded", () => {
  displayTransactions();
  updateChart();
});
