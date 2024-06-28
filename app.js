let chart; // Declare chart variable

function generateChart(transactions) {
  const ctx = document.getElementById("myChart").getContext("2d");
  const categories = [
    "Savings",
    "Income (Insurance agency)",
    "Income (Rent)",
    "Income (Tax refund)",
    "Housing",
    "Electronics",
    "Insurance and fees",
    "Health",
    "Food and groceries",
    "Personal care",
    "Education",
    "Transportation",
    "Entertainment",
    "Undefined",
  ];
  const categoryAmounts = categories.map((category) =>
    transactions
      .filter((t) => t.category === category && t.amount !== 0)
      .reduce((sum, t) => sum + t.amount, 0)
  );

  if (chart) {
    chart.destroy(); // Destroy the old chart before creating a new one
  }
  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: categories,
      datasets: [
        {
          label: "Budget Distribution",
          data: categoryAmounts,
          backgroundColor: [
            "#36a2eb",
            "#ff6384",
            "#ffce56",
            "#ff9f40",
            "#4bc0c0",
            "#9966ff",
            "#c45850",
            "#00aaff",
            "#ff7f50",
            "#32cd32",
            "#ba55d3",
            "#8b4513",
            "#20b2aa",
            "#ff69b4",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Budget distribution",
        },
      },
    },
  });
}

function categorizeTransaction(description) {
  const categories = {
    Savings: ["Månadssparande"],
    "Income (Insurance agency)": ["Insättning från annan bank FKASSA"],
    "Income (Rent)": ["Bankgiro insättning 427096650421"],
    "Income (Tax refund)": ["Återbetalning skatt SK8511210232"],
    Housing: ["rent", "mortgage", "utilities"],
    Electronics: ["electronics", "gadget", "device"],
    "Insurance and fees": ["insurance", "fee"],
    Health: ["health", "doctor", "medicine", "hospital"],
    "Food and groceries": ["food", "groceries", "supermarket"],
    "Personal care": ["personal care", "salon", "spa"],
    Education: ["education", "school", "tuition"],
    Transportation: ["transportation", "bus", "train", "fuel"],
    Entertainment: ["entertainment", "movie", "concert"],
  };
  for (let category in categories) {
    if (
      categories[category].some((keyword) =>
        description.toLowerCase().includes(keyword)
      )
    ) {
      return category;
    }
  }
  return "Undefined";
}

document.addEventListener("DOMContentLoaded", function () {
  initializeDateSelectors();
  loadTransactions();
  generateChart(JSON.parse(localStorage.getItem("transactions")) || []);
});

document
  .getElementById("transaction-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const description = document.getElementById("description").value;
    const amount = document.getElementById("amount").value;
    const year = document.getElementById("year").value;
    const month = document.getElementById("month").value;
    const day = document.getElementById("day").value;

    if (description && amount && year && month && day) {
      const category = categorizeTransaction(description);
      const transaction = {
        description,
        amount: parseFloat(amount),
        date: new Date(year, month - 1, day).toLocaleString(),
        category,
      };
      addTransaction(transaction);
      saveTransaction(transaction);
      document.getElementById("transaction-form").reset();
      generateChart(JSON.parse(localStorage.getItem("transactions")) || []);
    } else {
      alert("Please fill in all fields");
    }
  });

function initializeDateSelectors() {
  const today = new Date();
  const yearSelector = document.getElementById("year");
  const monthSelector = document.getElementById("month");
  const daySelector = document.getElementById("day");

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  // Populate year selector
  yearSelector.innerHTML = "";
  for (let i = currentYear - 10; i <= currentYear + 10; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.text = i;
    if (i === currentYear) {
      option.selected = true;
    }
    yearSelector.appendChild(option);
  }

  // Populate month selector
  monthSelector.innerHTML = "";
  for (let i = 1; i <= 12; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.text = i;
    if (i === currentMonth) {
      option.selected = true;
    }
    monthSelector.appendChild(option);
  }

  // Populate day selector
  daySelector.innerHTML = "";
  for (let i = 1; i <= 31; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.text = i;
    if (i === currentDay) {
      option.selected = true;
    }
    daySelector.appendChild(option);
  }
}

function addTransaction(transaction) {
  const transactionList = document.getElementById("transaction-list");
  const li = document.createElement("li");
  li.textContent = `${transaction.date} - ${transaction.description}: ${transaction.amount} (${transaction.category})`;

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove";
  removeBtn.onclick = () => {
    removeTransaction(transaction, li);
  };
  li.appendChild(removeBtn);

  transactionList.appendChild(li);
}

function removeTransaction(transaction, li) {
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  const updatedTransactions = transactions.filter(
    (t) =>
      t.description !== transaction.description || t.date !== transaction.date
  );
  localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
  li.remove();
  generateChart(updatedTransactions);
}

function saveTransaction(transaction) {
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function loadTransactions() {
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  transactions.forEach((transaction) => addTransaction(transaction));
}

document.getElementById("search").addEventListener("input", function (e) {
  const searchTerm = e.target.value.toLowerCase();
  const transactionList = document.getElementById("transaction-list");
  transactionList.innerHTML = ""; // Empty list

  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  const filteredTransactions = transactions.filter((transaction) =>
    transaction.description.toLowerCase().includes(searchTerm)
  );

  filteredTransactions.forEach((transaction) => addTransaction(transaction));
  generateChart(filteredTransactions);
});
