//index.js

// Import necessary functions and objects
import {
  displayTransactions,
  updateChart,
  transactions,
} from "./modules/transactions.js";

// Define the categories with their corresponding keywords
const categoryKeywords = {
  Salary: ["salary", "wage", "income"],
  "The Swedish Social Insurance Agency": [
    "försäkringskassan",
    "social insurance",
  ],
  "The Swedish Tax Agency": ["skatteverket", "tax agency"],
  Savings: ["saving", "deposit", "insättning", "månadssparande"],
  Groceries: [
    "grocery",
    "supermarket",
    "food",
    "coop",
    "rawfoodshop",
    "ica",
    "lidl",
    "klarna*icaniwill",
    "max burgers",
    "zettle_*kennys gelato",
    "din delikatessboo",
    "nyx*impactsolutionsweden",
  ],
  Utilities: [
    "utility",
    "union.akassa",
    "unionen",
    "telenor",
    "godel",
    "electricity",
    "water",
    "internet",
    "sbab",
    "henrikdalkaj",
    "ränta",
    "ellevio",
    "sbc",
  ],
  Entertainment: [
    "entertainment",
    "movie",
    "music",
    "game",
    "spotify",
    "bookbeat",
    "apple.com/bill",
  ],
  "Rent and Household": [
    "rent",
    "household",
    "mortgage",
    "electricity",
    "water",
    "internet",
    "sbab",
    "henrikdalkaj",
    "ränta",
    "ellevio",
    "sbc",
  ],
  Clothes: ["clothes", "apparel", "fashion", "uniqlo", "h&m", "zalando"],
  "Electronics and Gadgets": [
    "electronics",
    "gadget",
    "phone",
    "laptop",
    "elgiganten",
  ],
  Sports: [
    "sport",
    "gym",
    "fitness",
    "golfklubb",
    "friskis&svet",
    "klarna*gymgrossisten",
    "nyx*golfbollsautomat",
  ],
  "Personal Care": [
    "shampoo",
    "soap",
    "toothpaste",
    "apotekgruppen",
    "lumoral.com",
  ],
  Transportation: [
    "transport",
    "bus",
    "train",
    "fuel",
    "sl",
    "sjöstadencykelhörna ab",
    "okq8",
  ],
  Health: ["health", "medicine", "doctor", "hospital", "synsam"],
  "Food and Beverage": [
    "restaurant",
    "cafe",
    "bar",
    "golfrestaurang",
    "ett par kök & bar",
    "nacka golfrestaurang",
  ],
  Miscellaneous: ["miscellaneous", "other", "torgforsaljning"],
  Undefined: [],
};

// Function to determine the category based on description

function getCategoryFromDescription(description) {
  description = description.toLowerCase();
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((keyword) => description.includes(keyword))) {
      return category;
    }
  }
  console.log(`Description "${description}" did not match any category`);
  return "Undefined";
}

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
      const description = parts[1].trim();
      // Replace all non-digit characters except for minus and comma, then replace comma with a period
      const amountString = parts[2].replace(/[^\d,-]/g, "").replace(",", ".");
      const amount = parseFloat(amountString);

      const accountBalanceString = parts[3]
        .replace(/[^\d,-]/g, "")
        .replace(",", ".");
      const accountBalance = parseFloat(accountBalanceString); // Not used for now

      // Determine transaction type based on amount
      const type = amount >= 0 ? "income" : "expense";

      if (!isNaN(amount)) {
        const category = getCategoryFromDescription(description);
        parsedTransactions.push({
          category: category,
          type: type,
          amount: amount,
          date: date,
          description: description,
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
