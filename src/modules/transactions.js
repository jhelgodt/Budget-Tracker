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

  // Calculate the average total amount
  const totalSum = totalData.reduce((acc, val) => acc + val, 0);
  const averageTotalAmount = totalSum / totalData.length;
  const averageTotalData = new Array(labels.length).fill(averageTotalAmount);

  // Add the average total amount dataset
  datasets.push({
    label: "Average Total Amount",
    data: averageTotalData,
    fill: false,
    borderColor: "#FF0000", // Red color for average line
    tension: 0.1,
    borderDash: [10, 5], // Dashed line for the average
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
  // Define the categories to include in the calculation
  const specifiedCategories = [
    "Groceries",
    "Entertainment",
    "Clothes",
    "RentAndMortgage",
    "Utilities",
    "Sports",
    "FoodAndBeverage",
    "Miscellaneous",
    "Health",
    "PersonalCare",
    "Transportation",
    "ElectronicsAndGadgets",
    "HouseholdItems",
    "Vacation",
  ];

  // Define the annual budget for 2024 (example value, adjust as needed)
  const annualBudget2024 = 250000; // Example budget in SEK

  // Filter transactions for the year 2024 and specified categories
  const filtered2024Transactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      transactionDate.getFullYear() === 2024 &&
      specifiedCategories.includes(t.category)
    );
  });

  // Calculate total income and expenses for the filtered transactions
  const totalIncome2024 = filtered2024Transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses2024 = filtered2024Transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const currentTotal = totalIncome2024 + totalExpenses2024;
  const remainingBudget2024 = annualBudget2024 + currentTotal;

  // Display current total
  document.getElementById(
    "currentTotal"
  ).innerText = `Current Total: ${currentTotal.toLocaleString()} SEK`;

  // Display remaining budget
  document.getElementById(
    "remainingBudget"
  ).innerText = `Remaining Budget: ${remainingBudget2024.toLocaleString()} SEK`;

  // Add goal line
  const goalLine = {
    label: "Goal (-250,000 SEK)",
    data: new Array(labels.length).fill(-250000),
    borderColor: "orange",
    borderWidth: 2,
    borderDash: [10, 5],
    fill: false,
    pointRadius: 0,
  };

  transactionChart.data.datasets.push(goalLine);
  transactionChart.update();

  if (currentTotal < -250000) {
    document.getElementById("currentTotal").style.color = "red";
  } else {
    document.getElementById("currentTotal").style.color = "green";
  }
  function displayRemainingBudget(remainingBudget) {
    const categoryPercentages = {
      Groceries: 20,
      Savings: 17,
      RentAndMortgage: 15,
      Sports: 10,
      PersonalCare: 8,
      Utilities: 8,
      Transportation: 5,
      Clothes: 4,
      ElectronicsAndGadgets: 3,
      FoodAndBeverage: 3,
      HouseholdItems: 3,
      Entertainment: 3,
      Miscellaneous: 2,
      Health: 2,
      Vacation: 0,
    };

    function getRemainingMonthsInYear() {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      const currentDay = currentDate.getDate();

      const endOfYear = new Date(currentYear, 11, 31); // December 31 of the current year
      const totalDaysInMonth = new Date(
        currentYear,
        currentMonth + 1,
        0
      ).getDate(); // Total days in the current month

      // Calculate the remaining days in the current month
      const remainingDaysInMonth = totalDaysInMonth - currentDay;

      // Calculate the remaining months and fraction
      const remainingMonths =
        11 - currentMonth + remainingDaysInMonth / totalDaysInMonth;

      return remainingMonths;
    }

    const categoryRemainingBudget = {};
    const currentSpendingThisAndLastMonth = {}; // Object to hold current and last month's spending per category

    // Calculate remaining budget per category and current spending for the month and last month
    for (const category in categoryPercentages) {
      categoryRemainingBudget[category] =
        (remainingBudget * categoryPercentages[category] * 2) /
        100 /
        getRemainingMonthsInYear();

      // Calculate the current spending for each category in the current month plus last month
      currentSpendingThisAndLastMonth[category] = transactions
        .filter((t) => {
          const transactionDate = new Date(t.date);
          return (
            transactionDate.getFullYear() === 2024 &&
            (transactionDate.getMonth() === new Date().getMonth() ||
              transactionDate.getMonth() === new Date().getMonth() - 1) &&
            t.category === category
          );
        })
        .reduce((sum, t) => sum + t.amount, 0);
    }

    const categoryRemainingBudgetDiv = document.getElementById(
      "categoryRemainingBudget"
    );
    categoryRemainingBudgetDiv.innerHTML =
      "<h3>Remaining Budget by Category and two months for 2024:</h3>";

    for (const category in categoryRemainingBudget) {
      const remainingAmount = categoryRemainingBudget[category].toFixed(2);
      const currentSpentAmount =
        currentSpendingThisAndLastMonth[category].toFixed(2); // Get current month's spending + last months spending
      categoryRemainingBudgetDiv.innerHTML += `<p>${category}: ${remainingAmount} SEK remaining, ${-currentSpentAmount} SEK spent this month and last month</p>`;
    }
  }

  displayRemainingBudget(remainingBudget2024);
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function displayCategoryTotals() {
  const tableBody = document.querySelector("#categoryTotalsTable tbody");
  const tableHead = document.querySelector("#categoryTotalsTable thead");

  // Clear the existing table data
  tableBody.innerHTML = "";
  tableHead.innerHTML = "<tr><th>Category</th></tr>";

  const showIncome = document.getElementById("showIncome").checked;
  const showExpenses = document.getElementById("showExpenses").checked;

  const selectedYears = Array.from(
    document.querySelectorAll(".filterYear:checked")
  ).map((cb) => cb.value);
  const selectedCategories = Array.from(
    document.querySelectorAll(".filterCategory:checked")
  ).map((cb) => cb.value);

  // Filter and group transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    const yearMatch =
      selectedYears.length === 0 ||
      selectedYears.includes(transactionDate.getFullYear().toString());
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(transaction.category);
    return (
      ((showIncome && transaction.type === "income") ||
        (showExpenses && transaction.type === "expense")) &&
      yearMatch &&
      categoryMatch
    );
  });

  // Group transactions by category and year
  const totalsByCategoryAndYear = filteredTransactions.reduce(
    (acc, transaction) => {
      const date = new Date(transaction.date);
      const year = date.getFullYear();

      if (!acc[transaction.category]) {
        acc[transaction.category] = {};
      }

      if (!acc[transaction.category][year]) {
        acc[transaction.category][year] = 0;
      }

      acc[transaction.category][year] += transaction.amount;
      return acc;
    },
    {}
  );

  // Create table header row with years
  const headerRow = document.createElement("tr");
  headerRow.innerHTML =
    "<th>Category</th>" +
    selectedYears.map((year) => `<th>${year}</th>`).join("");
  tableHead.appendChild(headerRow);

  // Create table rows for each category
  Object.keys(totalsByCategoryAndYear).forEach((category) => {
    const row = document.createElement("tr");
    const rowData =
      `<td>${category}</td>` +
      selectedYears
        .map(
          (year) =>
            `<td>${
              totalsByCategoryAndYear[category][year]
                ? totalsByCategoryAndYear[category][year].toFixed(2)
                : "0.00"
            }</td>`
        )
        .join("");
    row.innerHTML = rowData;
    tableBody.appendChild(row);
  });

  // Calculate totals for the selected categories
  const totalRow = document.createElement("tr");
  totalRow.innerHTML =
    "<td>Total</td>" +
    selectedYears
      .map((year) => {
        const total = Object.values(totalsByCategoryAndYear).reduce(
          (sum, categoryTotals) => {
            return sum + (categoryTotals[year] || 0);
          },
          0
        );
        return `<td>${total.toFixed(2)}</td>`;
      })
      .join("");
  tableBody.appendChild(totalRow);
}
