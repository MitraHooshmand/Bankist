"use strict";

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

//////////////////////////////////

const displayMovements = function (arr) {
  containerMovements.innerHTML = "";
  arr.forEach(function (movement, i) {
    const type = movement > 0 ? "deposit" : "withdrawal";

    const html = `
  <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${movement} €</div>
        </div>
`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
// displayMovements(account1.movements);

/////////////////////////////////////////////////  Print Balance

const calcDisplayBalance = function (accs) {
  accs.balance = `${accs.movements.reduce((acc, cur) => acc + cur, 0)}`;
  labelBalance.textContent = accs.balance + "€";
};
// calcDisplayBalance(account1.movements);
//////////////////////////////////////////////////////// Summery in/out

const calcDisplaySummery = function (arr, intrest) {
  const depositeSum = arr
    .filter((item) => item > 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumIn.textContent = `${depositeSum} €`;
  const withdrawlSum = arr
    .filter((item) => item < 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumOut.textContent = `${Math.abs(withdrawlSum)} €`;
  const intrestRate = arr
    .filter((item) => item > 0)
    .map((item) => (item * intrest) / 100)
    .filter((item) => item > 1)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumInterest.textContent = `${intrestRate} €`;
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
  displayMovements(acc.movements);

  //display balance
  calcDisplayBalance(acc);

  //display summery
  calcDisplaySummery(acc.movements, acc.interestRate);
};

let currentAccount;
/////////////////////////////////////////////////// Login
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (item) => item.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display UI end message
    document.querySelector(
      ".welcome"
    ).textContent = `Hi🖐, dear ${currentAccount.owner.split(" ", 1)}`;
    containerApp.style.opacity = 100;
    //clear the input fields
    inputLoginPin.value = inputLoginUsername.value = "";
    inputLoginPin.blur();
    //// Update UI
    updateUI(currentAccount);
  } else {
    console.log("wrong pass");
  }
});

/////////////////////////////////////////////////// Transfer

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAccount = accounts.find(
    (item) => item.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    recieverAccount &&
    currentAccount.balance >= amount &&
    recieverAccount.username !== currentAccount.username
  ) {
    console.log("transfer is valid");
    currentAccount.movements.push(-amount);
    recieverAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputTransferAmount.value = inputTransferTo.value = "";
  inputTransferAmount.blur();
  // console.log(amount, recieverAccount, currentAccount);
});
//////////////////////////////////////////////////// Close Account

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
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

// console.log(movementsDescriptions);
/////////////////////////////////////////////////////////

// const deposites = account1.movements.filter((item) => item > 0);
// console.log(deposites);

// const withdrawls = account1.movements.filter((item) => item <= 0);
// console.log(withdrawls);

// const balance = account1.movements.reduce((acc, cur) => acc + cur, 0);

/////////////////// challenge

// test data 1 [5,2,4,1,15,8,3]
// test data 2 [16,6,10,5,6,1,4]

// const calcAverageHumanAge = function (arr) {
// const humanAge = arr.map((item) => (item <= 2 ? 2 * item : 16 + item * 4));
// const adultDogs = humanAge.filter((item) => item >= 18);
// const averageDogAges =
//   adultDogs.reduce((acc, curr) => acc + curr, 0) / adultDogs.length;
// console.log(humanAge);
// console.log(adultDogs);
// console.log(averageDogAges);
//////////////////////////////////////////second type => chaining method
//   const humanAge = arr
//     .map((item) => (item <= 2 ? 2 * item : 16 + item * 4))
//     .filter((item) => item >= 18)
//     .reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
//     console.log(humanAge);
// };

// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// const calcAverageHumanAge = function (arr) {
//   const humanAge = arr.map((item) => (item <= 2 ? 2 * item : 16 + item * 4));
//   console.log(humanAge);
// };

// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
