// Define an array of transactions. Each transaction has a type (income or expense),
// a category, an amount and a date.
const transactions = [
  { type: "income", category: "Salary", amount: 5000, date: "2024-07-01" },
  { type: "expense", category: "Groceries", amount: 150, date: "2024-07-02" },
  { type: "expense", category: "Utilities", amount: 200, date: "2024-07-03" },
  {
    type: "expense",
    category: "Entertainment",
    amount: 100,
    date: "2024-07-04",
  },
  { type: "income", category: "Freelance", amount: 1200, date: "2024-07-05" },
  { type: "expense", category: "Rent", amount: 1200, date: "2024-07-06" },
  { type: "expense", category: "Travel", amount: 300, date: "2024-07-07" },
  { type: "expense", category: "Health", amount: 100, date: "2024-07-08" },
  { type: "income", category: "Investment", amount: 400, date: "2024-07-09" },
  {
    type: "expense",
    category: "Miscellaneous",
    amount: 50,
    date: "2024-07-10",
  },
];

// Function to display transactions in the table
function displayTransactions() {
  // Get the table body element from the HTML
  const tableBody = document.querySelector("#transactionTable tbody");
  // Clear any existing rows in the table
  tableBody.innerHTML = "";

  // Loop through each transaction and create a new row in the table
  transactions.forEach((transaction) => {
    const row = document.createElement("tr");
    row.innerHTML = `
          <td>${transaction.type}</td>
          <td>${transaction.category}</td>
          <td>${transaction.amount}</td>
          <td>${new Date(transaction.date).toLocaleDateString()}</td>
      `;
    // Add the new row to the table body
    tableBody.appendChild(row);
  });
}

// Global variable to store the chart instance
let chart;

// Function to create and update the chart
function updateChart() {
  // Get the context of the canvas element for the chart
  const ctx = document.getElementById("expenseChart").getContext("2d");
  const showIncome = document.getElementById("showIncome").checked;
  const showExpenses = document.getElementById("showExpenses").checked;

  const filteredTransactions = transactions.filter(
    (transaction) =>
      (showIncome && transaction.type === "income") ||
      (showExpenses && transaction.type === "expense")
  );

  // Calculate the total amount for each expense category
  const transactionData = filteredTransactions.reduce((acc, transaction) => {
    acc[transaction.category] =
      (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {});

  // If a chart instance exists, destroy it before creating a new one
  if (chart) {
    chart.destroy();
  }

  // Create a new bar chart using Chart.js
  chart = new Chart(ctx, {
    type: "bar", // Type of chart (bar chart)
    data: {
      labels: Object.keys(transactionData), // Categories as labels
      datasets: [
        {
          label: "Transactions by Category",
          data: Object.values(transactionData), // Amounts for each category
          backgroundColor: "rgba(255, 99, 132, 0.2)", // Bar color
          borderColor: "rgba(255, 99, 132, 1)", // Bar border color
          borderWidth: 1, // Border width
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true, // Start the y-axis at zero
        },
      },
    },
  });
}

// Event listeners for checkboxes
document.getElementById("showIncome").addEventListener("change", updateChart);
document.getElementById("showExpenses").addEventListener("change", updateChart);

// When the document is fully loaded, render the transactions and the chart
document.addEventListener("DOMContentLoaded", () => {
  displayTransactions();
  updateChart();
});
