"use strict";

// Data
// const account1 = {
//   owner: "Jonas Schmedtmann",
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: "Jessica Davis",
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: "Steven Thomas Williams",
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: "Sarah Smith",
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];
//////////////////////////////////////////////////////////////////////// New Data

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2024-08-10T23:36:17.929Z",
    "2024-08-17T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

///////////////////////  format date

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed < 7) return `${daysPassed} days`;
  else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

//////////////////////////////////    Formated currencies
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};
//////////////////////////////////

const displayMovements = function (arr, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort
    ? arr.movements.slice().sort((a, b) => a - b)
    : arr.movements;
  movs.forEach(function (movement, i) {
    const type = movement > 0 ? "deposit" : "withdrawal";
    const date = new Date(arr.movementsDates[i]);
    const displayDate = formatMovementDate(date, arr.locale);
    const formatedMov = formatCur(movement, arr.locale, arr.currency);

    const html = `
  <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formatedMov} </div>
        </div>
`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
// displayMovements(account1.movements);

/////////////////////////////////////////////////  Print Balance

const calcDisplayBalance = function (accs) {
  accs.balance = `${accs.movements.reduce((acc, cur) => acc + cur, 0)}`;
  labelBalance.textContent = formatCur(
    accs.balance,
    accs.locale,
    accs.currency
  );
};
// calcDisplayBalance(account1.movements);
//////////////////////////////////////////////////////// Summery in/out

const calcDisplaySummery = function (arr, intrest) {
  const depositeSum = arr.movements
    .filter((item) => item > 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumIn.textContent = formatCur(depositeSum, arr.locale, arr.currency);
  const withdrawlSum = arr.movements
    .filter((item) => item < 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumOut.textContent = formatCur(
    Math.abs(withdrawlSum),
    arr.locale,
    arr.currency
  );
  const intrestRate = arr.movements
    .filter((item) => item > 0)
    .map((item) => (item * intrest) / 100)
    .filter((item) => item > 1)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumInterest.textContent = formatCur(
    intrestRate,
    arr.locale,
    arr.currency
  );
};
// calcDisplaySummery(account1.movements, account1.interestRate);

/////////////////////////////////////////////////////// Username

const creatUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((item) => item[0])
      .join("");
  });
};
creatUserName(accounts);

////////////////////////////////////////////////////// update UI
const updateUI = function (acc) {
  //display movements
  displayMovements(acc);

  //display balance
  calcDisplayBalance(acc);

  //display summery
  calcDisplaySummery(acc, acc.interestRate);
};

/////////////////////////////////////////////////// Timer

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // In each call print the remaing time
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Please login to get started ";
      containerApp.style.opacity = 0;
    }
    // Decrease 1 sec
    time--;
  };
  // set time to 5 min
  let time = 120;
  // call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
/////////////////////////////////////////////////// Login
let currentAccount, timer;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (item) => item.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === +inputLoginPin.value) {
    //display UI end message
    document.querySelector(
      ".welcome"
    ).textContent = `Hi🖐, dear ${currentAccount.owner.split(" ", 1)}`;
    containerApp.style.opacity = 100;

    ///// International time  Experimenting API

    const now = new Date();
    const option = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      // weekday: "long",
    };
    labelDate.textContent = Intl.DateTimeFormat(
      currentAccount.locale,
      option
    ).format(now);

    // Create current date and time
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const minutes = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes} `;

    //clear the input fields
    inputLoginPin.value = inputLoginUsername.value = "";
    inputLoginPin.blur();

    //////////// Timer

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    //// Update UI
    updateUI(currentAccount);
  } else {
    console.log("wrong pass");
  }
});

/////////////////////////////////////////////////// Transfer

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const recieverAccount = accounts.find(
    (item) => item.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    recieverAccount &&
    currentAccount.balance >= amount &&
    recieverAccount.username !== currentAccount.username
  ) {
    // recording the transfer
    currentAccount.movements.push(-amount);
    recieverAccount.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    recieverAccount.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);
    // reset Timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
  inputTransferAmount.value = inputTransferTo.value = "";
  inputTransferAmount.blur();
  // console.log(amount, recieverAccount, currentAccount);
});

////////////////////////////////////////////////////   Loan

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((item) => item >= amount * 0.1)
  ) {
    setTimeout(function () {
      currentAccount.movements.push(amount);
      // add date of loan
      currentAccount.movementsDates.push(new Date().toISOString());

      updateUI(currentAccount);
      // reset Timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 3000);
  }
  inputLoanAmount.value = "";
});

//////////////////////////////////////////////////// Close Account

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    const index = accounts.findIndex(
      (item) => item.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = "Please login to get started ";
  }
  inputCloseUsername.value = inputClosePin.value = "";
});
/////////////////////////////////////////////////// Sort

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////// Get Max

const getMax = function (accs) {
  // console.log(accs);
  const max = accs.reduce((item, arr) => Math.max(item, arr), accs[0]);
  console.log(max);
};
// getMax(account1.movements);
////////////////////////////////////////////// Eur/USD
const eurToUSD = 1.1;
const movementUSD = account1.movements.map((item) => item * eurToUSD);
const movementsDescriptions = account1.movements.map((item, i) => {
  return `Movement ${i + 1}: You ${
    item > 0 ? "deposited" : "withdrew"
  } ${Math.abs(item)}`;
});
