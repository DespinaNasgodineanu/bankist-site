'use strict';

// Data
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
    "2023-12-29T14:11:59.604Z",
    "2024-01-23T17:01:17.194Z",
    "2024-01-26T23:36:17.929Z",
    "2024-01-29T10:51:36.790Z",
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
  
  const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
  };
  
  const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
  };
  
  const accounts = [account1, account2, account3, account4];

  // Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


//Lista transferuri

const formatMovementsDate = function(date, locale) {
        const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2-date1) / (1000*60*60*24));     

        const daysPassed = calcDaysPassed(new Date(),date);

        if(daysPassed === 0) return 'Today';
        if(daysPassed === 1) return 'Yesterday';
        if(daysPassed <= 7) return `${daysPassed} days ago`;
        if(daysPassed >= 30 && daysPassed <= 60) return `One month ago`;
        else {
            // const day = `${date.getDate()}`.padStart(2, 0);
            // const month =`${date.getMonth() + 1}`.padStart(2, 0);
            // const year = date.getFullYear();
            // return `${day}/${month}/${year}`;
            return new Intl.DateTimeFormat(locale).format(date)
        }
}

const formatCurrency = function(value, locale, currency) {
    return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency : currency,
  }).format(value);
}

const displayMovements = function(acc, sort = false) {
    containerMovements.innerHTML =''; // Empty container // .textContent = 0

    const movs = sort ? acc.movements.slice().sort((a,b) => a-b) : acc.movements;

    movs.forEach(function(mov,i) { 
        const typeOfMovement = mov > 0 ? 'deposit' : 'withdrawal';

        const date = new Date(acc.movementsDates[i]); // Looping over 2 arrays
        const displayDate = formatMovementsDate(date,acc.locale);

        const formatedMovement = formatCurrency(mov, acc.locale, acc.currency);

        const html = `<div class="movements__row">
          <div class="movements__type movements__type--${typeOfMovement}">${i+1} ${typeOfMovement}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formatedMovement}</div>
        </div>`;
        containerMovements.insertAdjacentHTML('afterbegin', html)
    });
}



// Calculam current balance

const calcPrintBalance = function(acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc+mov, 0);
  labelBalance.textContent = formatCurrency(acc.balance, acc.locale, acc.currency);
}


// Calc display 

const calcDisplaySummary = function(account){
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov,0);
  labelSumIn.textContent = formatCurrency(incomes,account.locale, account.currency);

  const outies = account.movements
    .filter( mov => mov < 0)
    .reduce((acc,mov) => acc+mov,0)
  labelSumOut.textContent = formatCurrency(outies,account.locale, account.currency);

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => deposit*account.interestRate/100 )
    .filter((interest, i ,arr) => {
      return interest >=1
    }) // Daca dobanda este mai mica decat 1 se aduna
    .reduce((acc,mov) => acc+mov,0)
  labelSumInterest.textContent = formatCurrency(interest,account.locale, account.currency);

}

// Username ul va fi intialele numelui

const createUserName = function(accs) {
  accs.forEach(function(acc) {
     acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  })
 
}

createUserName(accounts);
console.log(accounts);

//Update UI
const updateUI = function(acc) {
  //Display movements
    displayMovements(acc)
    //Display balance
    calcPrintBalance(acc);
    //Display summary
    calcDisplaySummary(acc)
}

//Logout timmer
const startLogOutTImer = function() {
  const tick = function() {
      const min = String(Math.trunc(time / 60)).padStart(2, 0);
      const seconds = String(time % 60).padStart(2, 0);
        //In each call, print the raming time to UI
        labelTimer.textContent = `${min}:${seconds}`;
        //When the time is 0 seconds, stop timer and log out user
          if(time === 0) {
        clearInterval(timer);
        labelWelcome.textContent = 'Log in to get started';
        containerApp.style.opacity = 0;
      }
        // Decrease 1 second
        time--;
     }
   //Set time to 5 minutes 
   let time = 300;
   //Call the timer every second
   tick();
   const timer =  setInterval( tick ,1000);
   return timer;
}

// Event handler login
 
let currentAccount, timer;

// //Fake always logged in
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;


btnLogin.addEventListener('click', function(e) {
  e.preventDefault(); // Prevent form form sumitting
  currentAccount = accounts.find(acc=> acc.userName === inputLoginUsername.value);
  console.log(currentAccount);

  if(currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and welcome message
    labelWelcome.textContent = `Welcome back , ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    // Create current date and time
    const now = new Date();
    const options ={
      hour:'numeric',
      minute:'numeric',
      day:'numeric',
      month:'numeric',
      year:'numeric'
    }
    // const locale = navigator.language; 
    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);

    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    
    //If is already is a timer
    if(timer) clearInterval(timer);
    //timer
    timer = startLogOutTImer();

    updateUI(currentAccount)
    
  } else {
    labelWelcome.textContent = `Wrong username or password`;
    containerApp.style.opacity = 0;
  }
})

/// Transfer money

btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciverAcc =accounts.find(acc => acc.userName === inputTransferTo.value );
  
  inputTransferAmount.value = inputTransferTo.value = ''; //Clean 
  
  if(amount > 0 && currentAccount.balance >=amount &&
     reciverAcc &&
     reciverAcc?.userName !== currentAccount.userName) {
        //Doing the transfer
        currentAccount.movements.push(-amount);
        reciverAcc.movements.push(+amount);

      // Add transfer date
      currentAccount.movementsDates.push(new Date().toISOString());
      reciverAcc.movementsDates.push(new Date().toISOString());

      updateUI(currentAccount)
  
      console.log(`Transfer valid`);

      //Reset timer
      clearInterval(timer);
      timer = startLogOutTImer();

  }

  console.log(amount,reciverAcc);
})

// Add amount to deposit
btnLoan.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  if(amount > 0 && 
    currentAccount.movements.some(mov => mov >= amount*0.1)){
      setTimeout(function(){
        // Add movement
      currentAccount.movements.push(amount);

      // Add transfer date
      currentAccount.movementsDates.push(new Date().toISOString());

      updateUI(currentAccount)
      //Reset timer
      clearInterval(timer);
      timer = startLogOutTImer();
    },2500)
    }
    inputLoanAmount.value = '';

})

// Close the account

btnClose.addEventListener('click', function(e) {
  e.preventDefault();
  const confirmUser = inputCloseUsername.value ;
  const confirmPin = Number(inputClosePin.value);

  inputCloseUsername.value = inputClosePin.value='';
  
  if(confirmUser && confirmUser === currentAccount.userName && 
    confirmPin === currentAccount.pin) {
      const index = accounts.findIndex(acc => acc.userName === currentAccount.userName)
      console.log(index);
      // Delete account
      accounts.splice(index,1); // Eliminam un singur elem cu respexrtivul index

      //Hide UI
      labelWelcome.textContent = 'Log in to get started'
      containerApp.style.opacity = 0;
    }
})

//Sort button 

let sorted = false;
btnSort.addEventListener('click', function(e){
    e.preventDefault();

    displayMovements(currentAccount.movements, !sorted);
    sorted = !sorted;// Flip the value of sort

})


// Transformam valorile afisate in array fara euro

labelBalance.addEventListener('click', function() {
  const movementsUI = Array.from
  (document.querySelectorAll('.movements__value'),
  el => Number(el.textContent.replace('€', '')));

   console.log(movementsUI);
}
)

