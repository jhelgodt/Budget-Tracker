// modules/transactions.js

// Import necessary dependencies
import Chart from "chart.js/auto";

// Define an array of transactions
export const transactions = [];
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

function getQuarter(month) {
  return Math.floor((month - 1) / 3) + 1;
}

function groupByQuarter(transactions) {
  const groupedData = {};

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const year = date.getFullYear();
    const quarter = getQuarter(date.getMonth() + 1);

    if (!groupedData[year]) {
      groupedData[year] = {};
    }

    if (!groupedData[year][quarter]) {
      groupedData[year][quarter] = {};
    }
    if (!groupedData[year][quarter][transaction.category]) {
      groupedData[year][quarter][transaction.category] = 0;
    }

    groupedData[year][quarter][transaction.category] += transaction.amount;
  });

  return groupedData;
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

  const groupedData = groupByQuarter(filteredTransactions);

  // Ensure the order of years is maintained
  const orderedYears = ["2021", "2022", "2023", "2024"];
  const labels = [];
  const datasets = [];

  orderedYears.forEach((year) => {
    if (selectedYears.includes(year)) {
      for (let q = 1; q <= 4; q++) {
        labels.push(`${year} Q${q}`);
      }
    }
  });

  const categoryData = {};
  selectedCategories.forEach((category) => {
    categoryData[category] = new Array(labels.length).fill(0);
  });

  Object.keys(groupedData).forEach((year) => {
    if (orderedYears.includes(year)) {
      Object.keys(groupedData[year]).forEach((quarter) => {
        const label = `${year} Q${quarter}`;
        const index = labels.indexOf(label);
        Object.keys(groupedData[year][quarter]).forEach((category) => {
          categoryData[category][index] = groupedData[year][quarter][category];
        });
      });
    }
  });

  selectedCategories.forEach((category) => {
    datasets.push({
      label: category,
      data: categoryData[category],
      fill: false,
      borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      tension: 0.1,
    });
  });

  const data = {
    labels: labels,
    datasets: datasets,
  };

  if (transactionChart) {
    transactionChart.data = data;
    transactionChart.update();
  } else {
    transactionChart = new Chart(ctx, {
      type: "line",
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
