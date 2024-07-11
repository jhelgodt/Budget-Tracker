// modules/transactions.js

// Import necessary dependencies
import Chart from "chart.js/auto";

// Define an array of transactions
const transactions = [
  { type: "income", category: "Salary", amount: 5000, date: "2024-07-01" },
  { type: "expense", category: "Groceries", amount: 150, date: "2024-07-02" },
  { type: "expense", category: "Utilities", amount: 200, date: "2024-07-03" },
  // Add more transactions as needed
];

// Function to display transactions in the table
export function displayTransactions() {
  const tableBody = document.querySelector("#transactionTable tbody");
  tableBody.innerHTML = "";

  transactions.forEach((transaction) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${transaction.type}</td>
      <td>${transaction.category}</td>
      <td>${transaction.amount}</td>
      <td>${new Date(transaction.date).toLocaleDateString()}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Function to update the chart
export function updateChart() {
  const ctx = document.getElementById("expenseChart").getContext("2d");
  const showIncome = document.getElementById("showIncome").checked;
  const showExpenses = document.getElementById("showExpenses").checked;

  const filteredTransactions = transactions.filter(
    (transaction) =>
      (showIncome && transaction.type === "income") ||
      (showExpenses && transaction.type === "expense")
  );

  const transactionData = filteredTransactions.reduce((acc, transaction) => {
    acc[transaction.category] =
      (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {});

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(transactionData),
      datasets: [
        {
          label: "Transactions by Category",
          data: Object.values(transactionData),
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
