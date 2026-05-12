
const balanceEl = document.getElementById("balance");
const incomeAmountEl = document.getElementById("income-amount");
const expenseAmountEl = document.getElementById("expenses-amount");
const list = document.querySelector("ul")
const transactionFormEl = document.getElementById("transaction-form");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("Amount");
const addBtn = document.getElementById("addBtn");
const transactions = [];
 
async function loadTransactions() {
    try {
        const response = await fetch('api.php?action=load');
        if(!response.ok) throw new Error('Network response was not ok');
        
        
        const data= await response.json();
        transactions.length = 0; 
        transactions.push(...data);
        
        updateUI();
    }  catch (error) {
        console.error("Could not load data:", error);
    }
}

loadTransactions();



async function saveTransactions() {
    try {
        const response = await fetch('api.php?action=save',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transactions)
        });
        if (!response.ok) {
            throw new Error(`Failed to save: ${response.status}`);
        }
    } catch (error) {
        console.error("Could not save data:", error);
    }
}


function updateUI() {

    list.innerHTML = "";

    let bal = 0;
    let income = 0;
    let expenses = 0;

    for (let i = 0; i < transactions.length; i++) {
        let t = transactions[i];
        let HTML=``;
        
      


        if (t.Amount > 0) {
                 HTML = `<li>
                             <span class="desc">${t.Description}</span>
                             <span class="amt">+₹${t.Amount.toFixed(2)}</span>
                             <button class="delBtn"onclick="deleteTransaction(${t.id})">X</button>
                         </li>`;
        } else {
             HTML = `<li>
                            <span class="desc">${t.Description}</span>
                            <span class="amt">-₹${Math.abs(t.Amount).toFixed(2)}</span>
                            <button class="delBtn" onclick="deleteTransaction(${t.id})">X</button>
                        </li>`;
        }

        list.innerHTML+=HTML;
 
        bal = bal + t.Amount;

        if (t.Amount > 0) {
            income = income + t.Amount;
        } else{
            expenses += t.Amount;
        }
    }
    balanceEl.innerText = "₹" + bal.toFixed(2);
    incomeAmountEl.innerText = "₹" + income.toFixed(2);
    expenseAmountEl.innerText = "₹" + expenses.toFixed(2);
 }

function deleteTransaction(id) {
    for (let i = 0; i < transactions.length; i++) {
        if (transactions[i].id === id) {
            transactions.splice(i, 1);
            break;
        }
    }
    saveTransactions();
    updateUI();
  
};
   
addBtn.addEventListener("click", (e) =>{
    e.preventDefault();

     
    let des = descriptionEl.value;
    let amount = parseFloat(amountEl.value);
     
    if (des === "" || isNaN(amount) || amount === 0) {
        alert("Please enter a valid description and amount");
        return;
    }

   transactions.push({ id: Date.now(), Description: des, Amount: amount });
    descriptionEl.value = "";
    amountEl.value = "";
    saveTransactions();
    updateUI();
    
});