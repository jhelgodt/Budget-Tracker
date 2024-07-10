// Define an array of transactions. Each transaction has a type (income or expense),
// a category, an amount and an date.
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

// Function to render transactions in the HTML table
function renderTransactions() {
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

// Function to render a bar chart of expenses by category
function renderExpenseChart() {
  // Get the context of the canvas element for the chart
  const ctx = document.getElementById("expenseChart").getContext("2d");
  // Filter out only the expense transactions
  const expenseTransactions = transactions.filter(
    (transaction) => transaction.type === "expense"
  );
  // Calculate the total amount for each expense category
  const expenseCategories = expenseTransactions.reduce((acc, transaction) => {
    acc[transaction.category] =
      (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {});

  // Create a new bar chart using Chart.js
  const chart = new Chart(ctx, {
    type: "bar", // Type of chart (bar chart)
    data: {
      labels: Object.keys(expenseCategories), // Categories as labels
      datasets: [
        {
          label: "Expenses by Category",
          data: Object.values(expenseCategories), // Amounts for each category
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

// When the document is fully loaded, render the transactions and the chart
document.addEventListener("DOMContentLoaded", () => {
  renderTransactions();
  renderExpenseChart();
});
