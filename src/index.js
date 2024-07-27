//index.js

// Import necessary functions and objects
import {
  displayTransactions,
  updateChart,
  transactions,
  displayCategoryTotals,
} from "./modules/transactions.js";

// Define the categories with their corresponding keywords
const categoryKeywords = {
  Clothes: [
    "adaysmarch",
    "apparel",
    "björn borg retail",
    "breadandboxers",
    "clothes",
    "etc",
    "fashion",
    "filippak",
    "gococo",
    "h&m",
    "johnhenric",
    "nelly",
    "nike",
    "se.aboutyou.com",
    "sjostadens kem",
    "stadium",
    "sellpy",
    "uniqlo",
    "volt",
    "woodbird",
    "zalando",
    "acne",
    "eton",
    "654",
    "frank dandy",
    "boozt",
    "best of brands",
    "patagonia",
  ],
  ElectronicsAndGadgets: [
    "cdon",
    "elgiganten",
    "electronics",
    "gadget",
    "kjell",
    "laptop",
    "phone",
    "temu",
    "webhallen",
    "siba",
    "houseofsoko",
    "digital inn",
  ],
  Entertainment: [
    "adlibris",
    "apple.com/bill",
    "audible",
    "bookbeat",
    "entertainment",
    "filmstaden",
    "game",
    "hbo",
    "inferno online",
    "kindle",
    "movie",
    "netflix",
    "nintendo",
    "roll20",
    "sf anytime",
    "spotify",
    "ticketmaster",
    "tinder",
    "itunes.com",
    "storytel",
  ],
  FoodAndBeverage: [
    "bar",
    "burgers",
    "cafe",
    "delivery hero",
    "espresso",
    "fabrique",
    "food",
    "generator",
    "golfrestaurang",
    "imas sthlm",
    "lindeberg",
    "marin tapas",
    "soft corner",
    "max",
    "nacka golfrestaurang",
    "nyström",
    "panini",
    "sandys",
    "pizza",
    "qopla",
    "restaurant",
    "sodra teatern",
    "blueberry",
    "waynes",
    "starbucks",
  ],
  Groceries: [
    "coop",
    "din delikatessboo",
    "goodstore",
    "paradiset",
    "hemmakvall",
    "hemköp",
    "hemkop",
    "ica",
    "klarna*icaniwill",
    "lidl",
    "malma",
    "mathem",
    "max burgers",
    "nara dej",
    "nyx*impactsolutionsweden",
    "picsmart",
    "recoorganic",
    "pressbyraan",
    "pressbyrån",
    "rawfoodshop",
    "swedish wild",
    "systembolaget",
    "willys",
    "överföring 9273 3100572",
    "zettle_*kennys gelato",
    "recorganic",
  ],
  Health: [
    "aqua dental",
    "danvikstull",
    "doctor",
    "frejdfysio",
    "health",
    "hospital",
    "mindler",
    "mottagningen sjostaden",
    "receptonline",
    "synsam",
    "ultraljud",
    "ultraljudscentrum",
    "vaccin",
  ],
  HouseholdItems: [
    "$hléns",
    "amazon",
    "åhlens",
    "bauhaus",
    "cervera",
    "clas ohlson",
    "clean casa",
    "dustinhome",
    "etsy",
    "fruugo",
    "ikea",
    "jordklok",
    "jysk",
    "mio stockholm city",
    "office depot",
    "dis ab",
  ],
  Miscellaneous: [
    "github",
    "happies",
    "lekia",
    "linkedin",
    "miscellaneous",
    "other",
    "polisen",
    "städ",
    "swish",
    "torgforsaljning",
    "vipassana",
    "zoom",
  ],
  PersonalCare: [
    "achedaway",
    "apotea",
    "apotek",
    "apotekgruppen",
    "athleticgreens",
    "bokadirekt",
    "bt.cx",
    "hargenget",
    "flowlife",
    "hemplybalance",
    "hellas",
    "hörseltjänst",
    "kicks",
    "lumoral.com",
    "lumi",
    "löpkliniken",
    "mottagningen sjostaden",
    "naprapat",
    "posture",
    "reuma",
    "rehaboteket",
    "shopify, tuen mun",
    "solarieapp",
    "sparadiset",
    "svenskhalsokost.se",
    "tubble",
    "whoop",
    "xinglin",
    "hargenget",
  ],
  Property: [
    "betalning till pappa",
    "house purchase",
    "insättning från annan bank fr pia",
    "mortgage",
    "property",
    "slutlikvid",
    "insättning från annan bank ulf",
    "insättning från annan bank frånulf",
    "insättning från annan bank pia",
    "insättning från annan bank frånpappa",
  ],
  RentAndMortgage: [
    "427096650421",
    "476771287870",
    "481082236896",
    "484426136464",
    "bankgiro insättning 456205873790",
    "electricity",
    "ellevio",
    "elstöd",
    "fastighetsägarna",
    "godel",
    "hedvig",
    "henrikdalkaj",
    "hyra",
    "internet",
    "mortgage",
    "ränta",
    "rent",
    "sbc",
    "sbab",
    "avibetalning 9152-1720888",
    "91521720888",
    "brf",
    "airbnb",
  ],
  Salary: [
    "income",
    "lön",
    "salary",
    "wage",
    "insättning från annan bank ersättning",
    "insättning från annan bank a-kassa",
  ],
  Savings: [
    "avanza",
    "fondab",
    "månadssparande",
    "överf. j. helgodt",
    "överföring 9159 7613489",
    "överföring",
    "överf. . helgodt",
  ],
  Sports: [
    "alba golf s",
    "kletterverket",
    "bikramyoga",
    "cloudgolf",
    "e3 rehab",
    "eagle one",
    "inbalance",
    "bruce",
    "fitness",
    "fors golf",
    "friskis",
    "friskis&svet",
    "golfboll",
    "golfklubb",
    "golfer",
    "golfförbundet",
    "gym",
    "hale",
    "henrik eriksson",
    "jesper söderman",
    "kivi sonia",
    "kivi,sonia",
    "klarna*gymgrossisten",
    "matchi",
    "nyx*golfbollsautomat",
    "padel",
    "panda",
    "playtomic",
    "racket",
    "robmooregolfa",
    "semente",
    "sats",
    "sport",
    "sweetspot",
    "tomsgolfskola",
    "tyreso golf",
    "yoga",
    "zoezi",
    "surfspot",
    "urban om",
  ],
  TheSwedishSocialInsuranceAgency: [
    "fkassa",
    "försäkringskassan",
    "social insurance",
  ],
  TheSwedishTaxAgency: ["återbetalning skatt", "skatteverket", "tax agency"],
  Transportation: [
    "bikester",
    "bolt",
    "cykel",
    "easypark",
    "fuel",
    "mioo",
    "klarna *ab storstockho, stockholm",
    "okq8",
    "parkering",
    "sj.se",
    "klarna/sl",
    "sjöstadencykelhörna ab",
    "storstockholms lokaltrafik",
    "transport",
    "arlanda express",
    "sl slussen",
    "fix my bike",
    "parkering",
    "sl telefonplan",
    "sl t-centralen",
  ],
  Undefined: [],
  Utilities: [
    "akassa",
    "bankkort",
    "centrala studiest",
    "csn",
    "telia",
    "telenor",
    "union.akassa",
    "unionen",
    "utility",
    "moderna",
    "3 abbonemang",
    "hi3g",
    "tele2",
    "sveriges ingenjörer",
  ],
  Vacation: [
    "björn, paris, boende",
    "ericeira",
    "flight",
    "holiday",
    "hotel",
    "travel",
    "lapoint",
    "vacation",
    "scandinavia 1172447416297, sto",
    "lufthansa",
  ],
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
  displayCategoryTotals();
});

// Event listeners for checkboxes
document.getElementById("showIncome").addEventListener("change", () => {
  updateChart();
  displayCategoryTotals(); // Add this line
});
document.getElementById("showExpenses").addEventListener("change", () => {
  updateChart();
  displayCategoryTotals(); // Add this line
});
document.querySelectorAll(".filterYear").forEach((cb) =>
  cb.addEventListener("change", () => {
    updateChart();
    displayCategoryTotals(); // Add this line
  })
);
document.querySelectorAll(".filterMonth").forEach((cb) =>
  cb.addEventListener("change", () => {
    updateChart();
    displayCategoryTotals(); // Add this line
  })
);
document.querySelectorAll(".filterCategory").forEach((cb) =>
  cb.addEventListener("change", () => {
    updateChart();
    displayCategoryTotals(); // Add this line
  })
);

// When the document is fully loaded, render the transactions and the chart
document.addEventListener("DOMContentLoaded", () => {
  displayTransactions();
  updateChart();
  displayCategoryTotals(); // Add this line
});
