"use strict";

//////////////////////////////////////////////////////////////////////////////////
// User data
const account1 = {
  name: "John Doe",
  transactions: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  password: 1234,
  transactionDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
};

const account2 = {
  name: "Mary Jane",
  transactions: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  password: 5678,
  transactionDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
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
const labelTimer = document.querySelector(".timer");

const sectionLogin = document.querySelector(".login_form");
const sectionApp = document.querySelector(".app");
const divTransactions = document.querySelector(".transactions");

const btnLogin = document.querySelector(".login_button");
const btnSort = document.querySelector(".sort_button");
const btnTransfer = document.querySelector(".form_button-transfer");
const btnClose = document.querySelector(".form_button-close");

const inputLoginUsername = document.querySelector(".login_input-user");
const inputLoginPassword = document.querySelector(".login_input-password");
const inputTransferTo = document.querySelector(".form_input-receiver");
const inputTransferAmount = document.querySelector(".form_input-amount");

const inputCloseUsername = document.querySelector(".form_input-user");
const inputClosePassword = document.querySelector(".form_input-password");

//////////////////////////////////////////////////////////////////////////////////
// Functions

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

// Transactions unsorted by default
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
                <div class="transactions_amount">${transaction.toFixed(2)}</div>
            </div>
        `;

    // Display in HTML (insert as first child element in transactions)
    divTransactions.insertAdjacentHTML("afterbegin", html);
  });
};

// Add transactions & return net total
const calcDisplayBalance = (acc) => {
  // Creates new property in account object
  acc.balance = acc.transactions.reduce((acc, cur) => {
    return acc + cur;
  }, 0); // initial value = 0
  labelBalance.textContent = `$ ${acc.balance}`;
};

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

// Display transactions, balance & summary
const updatedUI = (acc) => {
  displayTransactions(currentAccount.transactions);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

// Log out user after 10 minutes
const startLogOutTimer = () => {
  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0); // convert to string to use padStart
    const sec = String(time % 60).padStart(2, 0);

    // Print remaining time in UI
    labelTimer.textContent = `${min}:${sec}`;

    // Stop timer & log out user when hit 0 seconds
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Login to get started!";
      sectionApp.style.opacity = 0;
    }

    time--;
  };
  // Set time to 10 minutes
  let time = 600;

  // Call timer every second
  tick();
  const timer = setInterval(tick, 1000); // 1000 milliseconds
  return timer;
};
//////////////////////////////////////////////////////////////////////////////////
// Event handlers
let currentAccount, timer;

// Display current date & time
const now = new Date();
const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0); // zero-indexed
const year = now.getFullYear();
const hour = now.getHours();
const minutes = `${now.getMinutes()}`.padStart(2, 0);
labelDate.textContent = `${day}/${month}/${year} ${hour}:${minutes}`;

// Login functionality
const loginUser = (event) => {
  // Prevent form from refreshing & submitting
  event.preventDefault();

  // Check if username exists
  currentAccount = accounts.find((acc) => {
    return acc.username === inputLoginUsername.value;
  });

  // Returns undefined if account doesn't exist
  if (currentAccount?.password === Number(inputLoginPassword.value)) {
    // Display UI & message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.name.split(" ")[0]
    }!`; // take first name
    sectionApp.style.opacity = 100;
    sectionLogin.style.display = "none";

    // Clear login inputs
    inputLoginUsername.value = inputLoginPassword.value = "";
    inputLoginPassword.blur();

    // Show UI
    updatedUI(currentAccount);

    // Reset timer each time user logs in
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
  }
};

btnLogin.addEventListener("click", loginUser);

// Transfer money functionality
const transferAmount = (event) => {
  //Prevent form from refreshing and submitting
  event.preventDefault();

  const amount = Number(inputTransferAmount.value);

  // Check if username exists
  const receiverAcc = accounts.find((acc) => {
    acc.username === inputTransferTo.value;
  });

  // Clear input fields
  inputTransferTo.value = inputTransferAmount.value = " ";

  // Update transactions to reflect transfer
  if (
    amount > 0 &&
    receiverAcc &&
    receiverAcc?.username !== currentAccount.username &&
    currentAccount.balance >= amount
  ) {
    currentAccount.transaction.push(-amount);
    receiverAcc.transactions.push(amount);

    // Update UI
    updatedUI(currentAccount);

    // Reset timer if transfer money
    clearInterval(timer);
    timer = startLogOutTimer();
  }
};

btnTransfer.addEventListener("click", transferAmount);

// Close existing account
const closeAccount = (event) => {
  event.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.password === inputClosePassword.value
  ) {
    // Loops through each account to find which username matches input value
    const index = accounts.findIndex((acc) => {
      acc.username === currentAccount.username;
    });

    console.log(index);

    // Delete account from array
    accounts.splice(index, 1);

    // Hide UI
    sectionApp.style.opacity = 0;
  }

  // Clear input fields
  inputCloseUsername.value = inputClosePassword.value = "";
};

btnClose.addEventListener("click", closeAccount);
