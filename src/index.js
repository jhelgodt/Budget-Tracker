//index.js

// Import necessary functions and objects
import {
  displayTransactions,
  updateChart,
  transactions,
} from "./modules/transactions.js";

// Define the categories with their corresponding keywords
const categoryKeywords = {
  Salary: ["salary", "wage", "income", "lön"],
  "The Swedish Social Insurance Agency": [
    "försäkringskassan",
    "social insurance",
    "fkassa",
  ],
  "The Swedish Tax Agency": [
    "skatteverket",
    "tax agency",
    "återbetalning skatt",
  ],
  Savings: [
    "månadssparande",
    "fondab",
    "överföring 9159 7613489",
    "överf. j. helgodt",
  ],
  Groceries: [
    "coop",
    "rawfoodshop",
    "ica",
    "lidl",
    "mathem",
    "klarna*icaniwill",
    "max burgers",
    "zettle_*kennys gelato",
    "din delikatessboo",
    "nyx*impactsolutionsweden",
    "hemmakvall",
    "systembolaget",
    "picsmart",
    "pressbyraan",
    "swedish wild",
    "hemköp",
    "överföring 9273 3100572",
  ],
  Utilities: [
    "utility",
    "union.akassa",
    "unionen",
    "telenor",
    "bankkort",
    "csn",
    "centrala studiest",
  ],
  Entertainment: [
    "entertainment",
    "movie",
    "music",
    "game",
    "spotify",
    "netflix",
    "bookbeat",
    "apple.com/bill",
    "filmstaden",
    "nintendo",
    "audible",
    "sf anytime",
    "tinder",
    "hbo",
    "ticketmaster",
  ],
  RentAndMortgage: [
    "rent",
    "mortgage",
    "electricity",
    "water",
    "internet",
    "sbab",
    "henrikdalkaj",
    "ränta",
    "ellevio",
    "sbc",
    "hedvig",
    "fastighetsägarna",
    "godel",
    "bankgiro insättning 456205873790",
  ],
  HouseholdItems: [
    "office depot",
    "jysk",
    "bauhaus",
    "$hléns",
    "ikea",
    "clas ohlson",
    "etsy",
    "cervera",
    "clean casa",
  ],
  Clothes: [
    "clothes",
    "apparel",
    "fashion",
    "uniqlo",
    "nelly",
    "stadium",
    "nike",
    "sjostadens kem & skrad",
    "filippak",
    "bestsecret",
    "woodbird",
    "h&m",
    "zalando",
    "johnhenric",
    "adaysmarch",
    "etc",
    "sellpy",
    "björn borg retail",
    "se.aboutyou.com",
  ],
  "Electronics and Gadgets": [
    "electronics",
    "gadget",
    "phone",
    "kjell",
    "laptop",
    "elgiganten",
    "cdon",
    "temu",
  ],
  Sports: [
    "sport",
    "padel",
    "panda",
    "gym",
    "fitness",
    "golfklubb",
    "playtomic",
    "yoga",
    "friskis&svet",
    "sweetspot",
    "golfstar",
    "klarna*gymgrossisten",
    "nyx*golfbollsautomat",
    "golfförbundet",
    "kivi,sonia",
    "sats",
    "friskis",
    "jesper söderman",
    "eagle one",
    "tomsgolfskola",
    "henrik eriksson",
    "bikramyoga",
    "fors golf",
    "kivi sonia",
    "robmooregolfa",
    "matchi",
    "golfer",
    "alba golf s",
    "zoezi",
  ],
  "Personal Care": [
    "shampoo",
    "soap",
    "toothpaste",
    "apotekgruppen",
    "lumoral.com",
    "tubble",
    "mottagningen sjostaden",
    "hargenget",
    "whoop",
    "solarieapp",
    "apotek",
    "athleticgreens",
    "sparadiset",
    "flowlife",
    "hörseltjänst",
    "posture",
    "achedaway",
    "xinglin",
    "bokadirekt",
    "shopify, tuen mun",
    "apotea",
    "hemplybalance",
    "svenskhalsokost.se",
    "reuma",
    "rehaboteket",
    "bt.cx",
    "sp moergo, lower hutt",
    "löpkliniken",
  ],
  Transportation: [
    "transport",
    "bus",
    "train",
    "mioo",
    "fuel",
    "storstockholms lokaltrafik",
    "sl",
    "sj.se",
    "bikester",
    "sjöstadencykelhörna ab",
    "okq8",
    "cykel",
    "easypark",
    "bolt",
  ],
  Health: [
    "health",
    "medicine",
    "doctor",
    "danvikstull",
    "hospital",
    "ultraljudscentrum",
    "synsam",
    "mottagningen sjostaden",
    "frejdfysio",
    "receptonline",
    "aqua dental",
    "mindler",
  ],
  "Food and Beverage": [
    "restaurant",
    "cafe",
    "bar",
    "golfrestaurang",
    "pizza",
    "waynes",
    "fabrique",
    "imas sthlm",
    "max",
    "marin tapas",
    "ett par kök & bar",
    "nacka golfrestaurang",
    "panini",
    "burgers",
    "delivery hero",
  ],
  Miscellaneous: [
    "miscellaneous",
    "other",
    "städ",
    "polisen",
    "torgforsaljning",
    "happies",
    "linkedin",
    "swish",
    "github",
    "vipassana",
  ],
  Undefined: [],
};

// Function to determine the category based on description

function getCategoryFromDescription(description) {
  description = description.toLowerCase();
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((keyword) => description.includes(keyword))) {
      return category;
    }
  }
  console.log(`Description "${description}" did not match any category`);
  return "Undefined";
}

// Function to parse transactions from text input
function parseTransactions(text) {
  const parsedTransactions = [];

  // Split input into lines and process each line
  const lines = text.split("\n");
  lines.forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine.length === 0) return; // Skip empty lines
    const parts = trimmedLine.split("\t");
    if (parts.length >= 4) {
      const date = parts[0].trim();
      const description = parts[1].trim();
      // Replace all non-digit characters except for minus and comma, then replace comma with a period
      const amountString = parts[2].replace(/[^\d,-]/g, "").replace(",", ".");
      const amount = parseFloat(amountString);

      const accountBalanceString = parts[3]
        .replace(/[^\d,-]/g, "")
        .replace(",", ".");
      const accountBalance = parseFloat(accountBalanceString); // Not used for now

      // Determine transaction type based on amount
      const type = amount >= 0 ? "income" : "expense";

      if (!isNaN(amount)) {
        const category = getCategoryFromDescription(description);
        parsedTransactions.push({
          category: category,
          type: type,
          amount: amount,
          date: date,
          description: description,
        });
      }
    }
  });
  return parsedTransactions;
}

// Event listener for adding transactions
document.getElementById("addTransactionsBtn").addEventListener("click", () => {
  const inputText = document.getElementById("transactionInput").value;
  const newTransactions = parseTransactions(inputText);

  // Clear textarea after parsing
  document.getElementById("transactionInput").value = "";

  // Add new transactions to the existing transactions array
  transactions.push(...newTransactions);
  // Redisplay transactions and update chart
  displayTransactions();
  updateChart();
});

// Event listeners for checkboxes
document.getElementById("showIncome").addEventListener("change", updateChart);
document.getElementById("showExpenses").addEventListener("change", updateChart);
document
  .querySelectorAll(".filterYear")
  .forEach((cb) => cb.addEventListener("change", updateChart));
document
  .querySelectorAll(".filterMonth")
  .forEach((cb) => cb.addEventListener("change", updateChart));
document
  .querySelectorAll(".filterCategory")
  .forEach((cb) => cb.addEventListener("change", updateChart));

// When the document is fully loaded, render the transactions and the chart
document.addEventListener("DOMContentLoaded", () => {
  displayTransactions();
  updateChart();
});
