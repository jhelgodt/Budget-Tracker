//index.js

// Import necessary functions and objects
import { displayTransactions, updateChart } from "./modules/transactions.js";

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
