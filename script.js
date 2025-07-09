// =============================
// Dynamic Quote Generator Script
// =============================

//  Array of Quotes
let quotes =  JSON.parse(localStorage.getItem('quotes')) ||[
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "You miss 100% of the shots you don’t take.", category: "Motivation" },
  { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", category: "Inspiration" }
];


const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");



// ------------------------------
// Function: Display Random Quotes
// ------------------------------
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<strong>${quote.category}</strong>: "${quote.text}"`;


 // Save to sessionStorage
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// ------------------------------
// Function: Create Add Quote Form
// ------------------------------
function createAddQuoteForm() {
  // create Form container
  const formDiv = document.createElement("div");

  // create input for quote text
  const quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";
  quoteInput.id = "newQuoteText";

  // create input for category
  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";
  categoryInput.id = "newQuoteCategory";

  // create submit button
  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";

  //Event handler
  addButton.addEventListener("click", function() {
    addQuote(quoteInput.value.trim(), categoryInput.value.trim());
    quoteInput.value = "";
    categoryInput.value = "";
  });

  // Append elements
  formDiv.appendChild(quoteInput);
  formDiv.appendChild(categoryInput);
  formDiv.appendChild(addButton);

  // Add to body
  document.body.appendChild(document.createElement("h2")).textContent = "Add a New Quote";
  document.body.appendChild(formDiv);
}

// ------------------------------
// Function: Add Quote
// ------------------------------
function addQuote(text, category) {
  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }
  const newQ = { text, category };
  quotes.push(newQ);
  quoteDisplay.innerHTML = `<strong>${category}</strong>: "${text}"`;
}

// ------------------------------
// Function: Save to localStorageFunction
// ------------------------------
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ------------------------------
// Function: Import JSON
// ------------------------------
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) throw "Invalid JSON format";
      quotes.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Failed to import quotes: " + err);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ------------------------------
// Function: Export JSON
// ------------------------------
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// ------------------------------
// Restore last viewed quote from session
// ------------------------------
const lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
if (lastQuote) {
  quoteDisplay.innerHTML = `<strong>${lastQuote.category}</strong>: "${lastQuote.text}"`;
}

// Setup event listener
newQuoteButton.addEventListener("click", showRandomQuote);
createAddQuoteForm();

// Dynamically add import and export controls
document.body.appendChild(document.createElement("h2")).textContent = "Import / Export Quotes";
const importInput = document.createElement("input");
importInput.type = "file";
importInput.accept = ".json";
importInput.addEventListener("change", importFromJsonFile);

const exportButton = document.createElement("button");
exportButton.textContent = "Export Quotes";
exportButton.addEventListener("click", exportToJsonFile);

document.body.appendChild(importInput);
document.body.appendChild(exportButton);