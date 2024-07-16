// modules/transactions.js

// Import necessary dependencies
import Chart from "chart.js/auto";

// Define an array of transactions
export const transactions = [
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
// Add more transactions as needed

// Function to display transactions in the table
export function displayTransactions() {
  const tableBody = document.querySelector("#transactionTable tbody");
  tableBody.innerHTML = "";

  transactions.forEach((transaction) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${transaction.type}</td>
      <td>${transaction.description}</td>
      <td>${transaction.category}</td>
      <td>${transaction.amount}</td>
      <td>${new Date(transaction.date).toLocaleDateString()}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Variable to store the chart instance
let transactionChart;

// Function to update the chart
export function updateChart() {
  const ctx = document.getElementById("transactionChart").getContext("2d");
  const showIncome = document.getElementById("showIncome").checked;
  const showExpenses = document.getElementById("showExpenses").checked;

  const selectedYears = Array.from(
    document.querySelectorAll(".filterYear:checked")
  ).map((cb) => cb.value);
  const selectedMonths = Array.from(
    document.querySelectorAll(".filterMonth:checked")
  ).map((cb) => cb.value);
  const selectedCategories = Array.from(
    document.querySelectorAll(".filterCategory:checked")
  ).map((cb) => cb.value);

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    const yearMatch =
      selectedYears.length === 0 ||
      selectedYears.includes(transactionDate.getFullYear().toString());
    const monthMatch =
      selectedMonths.length === 0 ||
      selectedMonths.includes(
        (transactionDate.getMonth() + 1).toString().padStart(2, "0")
      );
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(transaction.category);
    return (
      ((showIncome && transaction.type === "income") ||
        (showExpenses && transaction.type === "expense")) &&
      yearMatch &&
      monthMatch &&
      categoryMatch
    );
  });

  const transactionData = filteredTransactions.reduce((acc, transaction) => {
    acc[transaction.category] =
      (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {});

  const data = {
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
  };

  if (transactionChart) {
    transactionChart.data = data;
    transactionChart.update();
  } else {
    transactionChart = new Chart(ctx, {
      type: "bar",
      data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
