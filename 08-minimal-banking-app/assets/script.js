"use strict";

//////////////////////////////////////////////////////////////////////////////////
// User data
const account1 = {
  name: "John Doe",
  transactions: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  password: 1234,
};

const account2 = {
  name: "Mary Jane",
  transactions: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  password: 5678,
};

const accounts = [account1, account2];

//////////////////////////////////////////////////////////////////////////////////
// Page elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance_value");
const labelSumIn = document.querySelector(".summary_value-in");
const labelSumOut = document.querySelector(".summary_value-out");
const labelSumInterest = document.querySelector(".summary_value-interest");

const sectionApp = document.querySelector(".app");
const divTransactions = document.querySelector(".transactions");

const btnLogin = document.querySelector(".login_button");
const btnSort = document.querySelector(".sort_button");
const btnTransfer = document.querySelector(".form_button-transfer");
const btnLoan = document.querySelector(".form_button-loan");
const btnClose = document.querySelector(".form_button-close");

const inputLoginUsername = document.querySelector(".login_input-user");
const inputLoginPassword = document.querySelector(".login_input-password");
const inputTransferTo = document.querySelector(".form_input-receiver");
const inputTransferAmount = document.querySelector(".form_input-amount");
const inputLoanAmount = document.querySelector(".form_input-loan-amount");
const inputCloseUsername = document.querySelector(".form_input-user");
const inputClosePassword = document.querySelector(".form_input-password");

//////////////////////////////////////////////////////////////////////////////////
// Functions

const displayTransactions = (transactions) => {
  // Empty transactions not linked to specific user
  divTransactions.innerHTML = "";

  transactions.forEach((transaction, i) => {
    // Determine transaction type
    const type = transaction > 0 ? "deposit" : "withdrawal";

    // HTML template
    const html = `
            <div class="transactions_row">
                <div class="transactions_type transactions_type-${type}">
                    #${i + 1} ${type}
                </div>
                <div class="transactions_amount">${transaction}</div>
            </div>
        `;

    // Display in HTML (insert as first child element in transactions)
    divTransactions.insertAdjacentHTML("afterbegin", html);
  });
};

displayTransactions(account1.transactions);

const createUsernames = (accs) => {
  accs.forEach((acc) => {
    acc.username = acc.name
      .toLowerCase()
      .split(" ") // split each name into array
      .map((name) => name[0]) // take first letter of each name
      .join(""); // join initials into a string
  });
};

createUsernames(accounts);

const calcDisplayBalance = (transactions) => {
  // Add transactions & return net total
  const balance = transactions.reduce((acc, cur) => {
    return acc + cur;
  }, 0); // initial value = 0
  labelBalance.textContent = `$ ${balance}`;
};

calcDisplayBalance(account1.transactions);

const calcDisplaySummary = (acc) => {
  const inflows = acc.transactions
    .filter((transaction) => transaction > 0) // only take deposits
    .reduce((acc, tran) => acc + tran, 0); // add all deposits
  labelSumIn.textContent = `$ ${inflows}`;

  const outflows = acc.transactions
    .filter((transaction) => transaction < 0)
    .reduce((acc, tran) => acc + tran, 0);
  labelSumOut.textContent = `$ ${Math.abs(outflows)}`;

  const interest = acc.transactions
    .filter((transaction) => transaction > 0) // only deposits can earn interests
    .map((deposit) => (deposit * acc.interestRate) / 100) // interest per deposit
    .reduce((acc, int) => acc + int, 0); // total interests earned
  labelSumInterest.textContent = `$ ${interest}`;
};

calcDisplaySummary(account1);

//////////////////////////////////////////////////////////////////////////////////
// Event handlers
let currentAccount;

const loginUser = (event) => {
  // Prevent form from refreshing & submitting
  event.preventDefault();

  // Check if username exists
  currentAccount = accounts.find((acc) => {
    return acc.username === inputLoginUsername.value;
  });
  console.log(currentAccount);

  // Returns undefined if account doesn't exist
  if (currentAccount?.password === Number(inputLoginPassword.value)) {
    // Display UI & message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.name.split(" ")[0]
    }!`; // first name
    sectionApp.style.opacity = 100;

    // Clear login inputs
    inputLoginUsername.value = inputLoginPassword.value = "";
    inputLoginPassword.blur();

    // Display transactions
    displayTransactions(currentAccount.transactions);

    // Display balance
    calcDisplayBalance(currentAccount.transactions);

    // Display summary
    calcDisplaySummary(currentAccount);
  }
};

btnLogin.addEventListener("click", loginUser);
