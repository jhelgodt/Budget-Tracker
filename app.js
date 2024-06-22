document.addEventListener("DOMContentLoaded", function () {
  loadTransactions();
});

document
  .getElementById("transaction-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const description = document.getElementById("description").value;
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;

    if (description && amount && category) {
      const transaction = {
        description,
        amount: parseFloat(amount),
        category,
        date: new Date().toLocaleString(),
      };
      addTransaction(transaction);
      saveTransaction(transaction);
      document.getElementById("transaction-form").reset();
    } else {
      alert("Please fill in all fields");
    }
  });

function addTransaction(transaction) {
  const transactionList = document.getElementById("transaction-list");
  const li = document.createElement("li");
  li.textContent = `${transaction.date} - ${transaction.description}: ${transaction.amount} (${transaction.category})`;
  transactionList.appendChild(li);

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove";
  removeBtn.onclick = () => removeTransaction(transaction, li);
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
  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.description.toLowerCase().includes(searchTerm) ||
      transaction.category.toLowerCase().includes(searchTerm)
  );

  filteredTransactions.forEach((transaction) => addTransaction(transaction));
});
