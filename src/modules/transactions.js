// modules/transactions.js

import Chart from "chart.js/auto";

export const transactions = [];

export function displayTransactions() {
  const tableBody = document.querySelector("#transactionTable tbody");
  tableBody.innerHTML = "";

  const transactionsByCategory = transactions.reduce((acc, transaction) => {
    if (!acc[transaction.category]) {
      acc[transaction.category] = [];
    }
    acc[transaction.category].push(transaction);
    return acc;
  }, {});

  const sortedCategories = Object.keys(transactionsByCategory).sort();

  sortedCategories.forEach((category) => {
    const sortedTransactions = transactionsByCategory[category].sort(
      (a, b) => b.amount - a.amount
    );

    sortedTransactions.forEach((transaction) => {
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

function groupByYear(transactions) {
  const groupedData = {};

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const year = date.getFullYear();

    if (!groupedData[year]) {
      groupedData[year] = {};
    }
    if (!groupedData[year][transaction.category]) {
      groupedData[year][transaction.category] = 0;
    }

    groupedData[year][transaction.category] += transaction.amount;
  });

  return groupedData;
}

let transactionChart;

export function updateChart() {
  const ctx = document.getElementById("transactionChart").getContext("2d");
  const showIncome = document.getElementById("showIncome").checked;
  const showExpenses = document.getElementById("showExpenses").checked;
  const viewMode = document.querySelector(
    'input[name="viewMode"]:checked'
  ).value;

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

  const groupedData =
    viewMode === "quarterly"
      ? groupByQuarter(filteredTransactions)
      : groupByYear(filteredTransactions);

  const orderedYears = [
    "2016",
    "2017",
    "2018",
    "2019",
    "2020",
    "2021",
    "2022",
    "2023",
    "2024",
  ];

  const labels = [];
  const datasets = [];

  if (viewMode === "quarterly") {
    orderedYears.forEach((year) => {
      if (selectedYears.includes(year)) {
        for (let q = 1; q <= 4; q++) {
          labels.push(`${year} Q${q}`);
        }
      }
    });
  } else {
    orderedYears.forEach((year) => {
      if (selectedYears.includes(year)) {
        labels.push(year);
      }
    });
  }

  const categoryData = {};
  selectedCategories.forEach((category) => {
    categoryData[category] = new Array(labels.length).fill(0);
  });

  Object.keys(groupedData).forEach((year) => {
    if (orderedYears.includes(year)) {
      if (viewMode === "quarterly") {
        Object.keys(groupedData[year]).forEach((quarter) => {
          const label = `${year} Q${quarter}`;
          const index = labels.indexOf(label);
          Object.keys(groupedData[year][quarter]).forEach((category) => {
            categoryData[category][index] =
              groupedData[year][quarter][category];
          });
        });
      } else {
        const index = labels.indexOf(year);
        Object.keys(groupedData[year]).forEach((category) => {
          categoryData[category][index] = groupedData[year][category];
        });
      }
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

  // Calculate the total amount for the selected categories
  const totalData = new Array(labels.length).fill(0);
  labels.forEach((label, index) => {
    selectedCategories.forEach((category) => {
      totalData[index] += categoryData[category][index];
    });
  });

  // Add the total amount dataset
  datasets.push({
    label: "Total Amount",
    data: totalData,
    fill: false,
    borderColor: "#000000", // Black color for total line
    tension: 0.1,
    borderWidth: 2, // Make the line a bit thicker
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
  displayCategoryTotals();
}

export function displayCategoryTotals() {
  const tableBody = document.querySelector("#categoryTotalsTable tbody");
  tableBody.innerHTML = "";

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

  const totals = filteredTransactions.reduce((acc, transaction) => {
    if (!acc[transaction.category]) {
      acc[transaction.category] = 0;
    }
    acc[transaction.category] += transaction.amount;
    return acc;
  }, {});

  const sortedCategories = Object.keys(totals).sort();

  sortedCategories.forEach((category) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${category}</td>
      <td>${totals[category].toFixed(2)}</td>
    `;
    tableBody.appendChild(row);
  });
}
