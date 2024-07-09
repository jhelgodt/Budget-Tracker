// app.js

const transactions = [
  { type: "income", category: "Salary", amount: 5000 },
  { type: "expense", category: "Groceries", amount: 150 },
  { type: "expense", category: "Utilities", amount: 200 },
  { type: "expense", category: "Entertainment", amount: 100 },
  { type: "income", category: "Freelance", amount: 1200 },
  { type: "expense", category: "Rent", amount: 1200 },
  { type: "expense", category: "Travel", amount: 300 },
  { type: "expense", category: "Health", amount: 100 },
  { type: "income", category: "Investment", amount: 400 },
  { type: "expense", category: "Miscellaneous", amount: 50 },
];

function renderTransactions() {
  const tableBody = document.querySelector("#transactionTable tbody");
  tableBody.innerHTML = "";

  transactions.forEach((transaction) => {
    const row = document.createElement("tr");
    row.innerHTML = `
          <td>${transaction.type}</td>
          <td>${transaction.category}</td>
          <td>${transaction.amount}</td>
      `;
    tableBody.appendChild(row);
  });
}

function renderExpenseChart() {
  const ctx = document.getElementById("expenseChart").getContext("2d");
  const expenseTransactions = transactions.filter(
    (transaction) => transaction.type === "expense"
  );
  const expenseCategories = expenseTransactions.reduce((acc, transaction) => {
    acc[transaction.category] =
      (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {});

  const chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(expenseCategories),
      datasets: [
        {
          label: "Expenses by Category",
          data: Object.values(expenseCategories),
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

document.addEventListener("DOMContentLoaded", () => {
  renderTransactions();
  renderExpenseChart();
});
