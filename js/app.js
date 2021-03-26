const buttonIncome = document.querySelector(".form__button--income");
const buttonExpense = document.querySelector(".form__button--expense");
const movementsContainer = document.querySelector(".movements");
const balance = document.querySelector(".accounts__balance");
const inputIncomeDetail = document.querySelector(
   ".form__input__income--detail"
);
const inputIncomeAmount = document.querySelector(
   ".form__input__income--amount"
);
const inputExpenseDetail = document.querySelector(
   ".form__input__expense--detail"
);
const inputExpenseAmount = document.querySelector(
   ".form__input__expense--amount"
);
const addAccountBtn = document.querySelector(".new__account__button");
const addAccountBtnSelect = document.querySelector(".select__add-account");
const selectAccount = document.querySelector("#accounts");
const closeModal = document.querySelector(".close-modal");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const newAccountName = document.querySelector(".new-account__input__name");
const newAccountAmount = document.querySelector(".new-account__input__amount");
const accountName = document.querySelector(".account__name");
const operations = document.querySelector(".operations");
const formIncome = document.querySelector(".form__income");
const formExpense = document.querySelector(".form__expense");
const accountExpenseDetail = document.querySelector(".expense__detail");
const accountIncomeDetail = document.querySelector(".income__detail");

class Movement {
   constructor(movDetail, amount, type = "income") {
      this.movDetail = movDetail;
      this.type = type;
      this._setAmount(amount);
   }

   _setAmount(amount) {
      if (this.type === "expense") {
         return (this.amount = -amount);
      }

      this.amount = amount;
   }
}

class Account {
   constructor(name, initialAmount, owner) {
      this.name = name;
      this.owner = owner;
      this.movements = [];
      this._setInitialAmount(initialAmount);
   }

   addNewMovement(movement) {
      this.movements.push(movement);
   }

   _setInitialAmount(amount) {
      this.initialAmount = amount;
      this.movements.push(new Movement("Saldo inicial", amount));
   }
}

class User {
   constructor(name, password) {
      this.name = name;
      this.password = password;
   }

   createAccount(accountName, initialAmount) {
      return new Account(accountName, initialAmount, this.name);
   }
}

class App {
   constructor() {
      this.user = new User("admin", "admin");
      this.accounts = [];

      // Current account
      this.currentAccount;

      // Event handlers
      buttonIncome.addEventListener("click", this._addIncome.bind(this));
      buttonExpense.addEventListener("click", this._addExpense.bind(this));
      addAccountBtn.addEventListener("click", this._addAccount.bind(this));
      selectAccount.addEventListener(
         "change",
         this._changeAccountAndDisplayMovements.bind(this)
      );
      // prettier-ignore
      addAccountBtnSelect.addEventListener('click', this._openModal)
      closeModal.addEventListener("click", this._closeModal);
      operations.addEventListener("click", this._listenerDelegation.bind(this));

      this._displayAccounts();
   }

   _listenerDelegation(e) {
      const target = e.target;

      if (target.closest(".operations__income__button")) {
         this._displayIncomeForm();
      } else if (target.closest(".operations__expense__button")) {
         this._displayExpenseForm();
      } else if (target.closest(".operations__transfer__button")) {
         this._displayTransferForm();
      }
   }

   _openModal() {
      modal.classList.remove("hidden");
      overlay.classList.remove("hidden");
   }

   _closeModal() {
      modal.classList.add("hidden");
      overlay.classList.add("hidden");
   }

   _createExpenseCategories() {
      const filterCategories = this.currentAccount.movements.filter(
         (mov) => mov.amount < 0
      );
      const categories = new Set(filterCategories.map((el) => el.movDetail));

      this._displayCategories(categories, -1);
   }

   _createIncomeCategories() {
      const filterCategories = this.currentAccount.movements.filter(
         (mov) => mov.amount > 0 && mov.movDetail !== "Saldo inicial"
      );
      const categories = new Set(filterCategories.map((el) => el.movDetail));

      this._displayCategories(categories, 1);
   }

   _displayCategories(categories, type) {
      const cat = [...categories];

      let movs = [];

      if (type < 0) {
         cat.forEach((c) => {
            movs.push({
               mov: c,
               amount: this.currentAccount.movements
                  .filter((el) => el.movDetail === c && el.amount < 0)
                  .reduce((acc, curr) => {
                     return acc + curr.amount;
                  }, 0),
            });
         });

         if (movs.length === 0) return;

         accountExpenseDetail.innerHTML = "";

         let html = ``;

         movs.forEach((c) => {
            html += `
              <li class="account__detail__li">
                <p>${c.mov}</p>
                <p>${c.amount}</p>
              </li>
            `;
         });

         accountExpenseDetail.insertAdjacentHTML("afterbegin", html);
      } else {
         cat.forEach((c) => {
            movs.push({
               mov: c,
               amount: this.currentAccount.movements
                  .filter((el) => el.movDetail === c && el.amount > 0)
                  .reduce((acc, curr) => {
                     return acc + curr.amount;
                  }, 0),
            });
         });

         if (movs.length === 0) return;

         accountIncomeDetail.innerHTML = "";

         let html = ``;

         movs.forEach((c) => {
            html += `
              <li class="account__detail__li">
                <p>${c.mov}</p>
                <p>${c.amount}</p>
              </li>
            `;
         });

         accountIncomeDetail.insertAdjacentHTML("afterbegin", html);
      }
   }

   //  _createCategoriesHTML(movs) {}

   _addAccount(e) {
      e.preventDefault();

      // Get data from form
      const name = newAccountName.value;
      const amount = Number(newAccountAmount.value);

      // Close the modal
      modal.classList.add("hidden");
      overlay.classList.add("hidden");

      // Clear the form
      newAccountName.value = newAccountAmount.value = "";

      const account = this.user.createAccount(name, amount);
      this.accounts.push(account);
      this._changeCurrentAccount(account.name);
      this._displayMovements();
      this._displayAccounts();
      this._createExpenseCategories();
      this._createIncomeCategories();
   }

   _changeCurrentAccount(account) {
      this.currentAccount = this.accounts.find((acc) => acc.name === account);
   }

   _changeAccountAndDisplayMovements() {
      const accountSelected =
         selectAccount.options[selectAccount.selectedIndex].value;

      this._changeCurrentAccount(accountSelected);
      this._displayMovements();
      this._createExpenseCategories();
      this._createIncomeCategories();
   }

   _displayIncomeForm() {
      formExpense.classList.add("hidden");
      formIncome.classList.remove("hidden");
   }

   _displayExpenseForm() {
      formIncome.classList.add("hidden");
      formExpense.classList.remove("hidden");
   }

   _displayTransferForm() {}

   _hideForm() {
      formIncome.reset();
      formExpense.reset();

      formIncome.classList.add("hidden");
      formExpense.classList.add("hidden");
   }

   _displayMovements() {
      movementsContainer.innerHTML = "";
      balance.innerHTML = "$0";
      accountName.textContent = `${this._firstWordUpper(
         this.currentAccount.name
      )}`;

      this.currentAccount.movements.forEach((mov) =>
         this._displayMovement(mov)
      );

      this._updateBalance();
   }

   _displayAccounts() {
      if (this.accounts.length === 0) return;

      selectAccount.innerHTML = "";
      let html = ``;

      this.accounts.forEach((acc) => {
         if (acc === this.currentAccount) {
            html += `<option selected value='${this.currentAccount.name}'>${this.currentAccount.name}</option>`;
         } else {
            html += `
           <option value='${acc.name}'>${acc.name}</option>
        `;
         }
      });

      selectAccount.insertAdjacentHTML("beforeend", html);
   }

   _firstWordUpper(word) {
      return word[0].toUpperCase() + word.slice(1);
   }

   _addIncome(e) {
      e.preventDefault();
      if (!this._checkAvailableAccount())
         return alert("Debes seleccionar una cuenta");

      // Get data from form
      const incomeDetail = inputIncomeDetail.value;
      const incomeAmount = Number(inputIncomeAmount.value);

      // Verify data
      if (
         !typeof incomeAmount === "number" ||
         !typeof incomeDetail === "string"
      )
         return;

      const mov = new Movement(
         this._firstWordUpper(incomeDetail),
         incomeAmount
      );

      this.currentAccount.movements.push(mov);

      this._displayMovement(mov);

      this._createIncomeCategories();

      this._updateBalance(mov);

      this._hideForm();
   }

   _addExpense(e) {
      e.preventDefault();

      if (!this._checkAvailableAccount())
         return alert("Debes seleccionar una cuenta");

      // Get data from form
      const expenseDetail = inputExpenseDetail.value;
      const expenseAmount = Number(inputExpenseAmount.value);

      // Verify data
      if (
         !typeof expenseAmount === "number" ||
         !typeof expenseDetail === "string"
      )
         return;

      const mov = new Movement(
         this._firstWordUpper(expenseDetail),
         expenseAmount,
         "expense"
      );
      this.currentAccount.movements.push(mov);

      this._displayMovement(mov);

      this._createExpenseCategories();

      this._updateBalance(mov);

      this._hideForm();
   }

   _checkAvailableAccount() {
      if (!this.currentAccount) return false;
      return true;
   }

   _displayMovement(mov) {
      let html;

      if (mov.type === "expense") {
         html = `
          <div class="movements__box">
            <p class="movements__description">${mov.movDetail}</p>
            <span class="movements__value movements__value--expense">${mov.amount}</span>
          </div>
          `;
      } else {
         html = `
          <div class="movements__box">
            <p class="movements__description">${mov.movDetail}</p>
            <span class="movements__value">${mov.amount}</span>
          </div>
          `;
      }

      movementsContainer.insertAdjacentHTML("afterbegin", html);
   }

   _updateBalance() {
      balance.textContent = `$${this.currentAccount.movements.reduce(
         (acc, curr) => acc + curr.amount,
         0
      )}`;
   }
}

const app = new App();

/*
// Varias cuentas
const user = {
   owner: "luciano",
   password: "mypassword",
   accounts: [
      {
         name: "cuenta corriente",
         movements: [
            {
               description: "sueldo",
               amount: 6000,
            },
            {
               description: "transferencia",
               amount: -1200,
            },
         ],
      },
      {
         name: "mi cartera",
         movements: [
            {
               description: "transferencia",
               amount: 1200,
            },
            {
               description: "nafta",
               amount: -130,
            },
            {
               description: "futbol",
               amount: -200,
            },
         ],
      },
   ],
};

const acc1 = user.accounts
   .find((acc) => acc.name === "cuenta corriente")
   .movements.reduce((acc, curr) => acc + curr.amount, 0);

// const total = acc1.reduce((acc, curr) => acc + curr.amount, 0);
// console.log(acc1);

// console.log(user.accounts);

const calcTotalAccount = function (account) {
   let total = 0;

   console.log(account);
   account.forEach((el) => {
      total += el.movements.reduce((acc, curr) => acc + curr.amount, 0);
   });

   console.log(total);
};

// const calcTotalAllAccounts = function () {
//    console.log(calcTotalAccount);
// };

calcTotalAccount(user.accounts);
*/
