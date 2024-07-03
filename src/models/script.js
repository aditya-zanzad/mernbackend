"use strict";

const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
let pieChart, lineChart;

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function generateID() {
  return new Date().getTime();
}

function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add a Transaction Name and Amount');
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value
    };

    transactions.push(transaction);

    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    text.value = '';
    amount.value = '';
  }
}

function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';

  const item = document.createElement('li');
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  item.innerHTML =  `
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span> 
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">X</button></li>
  `;
  list.appendChild(item);
}

function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, val) => (acc += val), 0).toFixed(2);
  const income = amounts.filter(transaction => transaction > 0).reduce((acc, val) => (acc += val), 0).toFixed(2);
  const expense = amounts.filter(transaction => transaction < 0).reduce((acc, val) => (acc += val), 0).toFixed(2);

  balance.innerHTML = `$${total}`;
  money_plus.innerHTML = `$${income}`;
  money_minus.innerHTML = `$${Math.abs(expense)}`;

  const pieData = {
    labels: ['Income', 'Expense'],
    datasets: [{
      data: [income, Math.abs(expense)],
      backgroundColor: ['#36A2EB', '#FF6384']
    }]
  };

  const lineData = {
    labels: transactions.map(transaction => transaction.text),
    datasets: [{
      label: 'Amount',
      data: amounts,
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  // Initialize or update the pie chart
  const pieChartCtx = document.getElementById('pieChart').getContext('2d');
  if(pieChart) {
    pieChart.data = pieData;
    pieChart.update();
  } else {
    pieChart = new Chart(pieChartCtx, {
      type: 'pie',
      data: pieData,
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  // Initialize or update the line chart
  const lineChartCtx = document.getElementById('lineChart').getContext('2d');
  if(lineChart) {
    lineChart.data = lineData;
    lineChart.update();
  } else {
    lineChart = new Chart(lineChartCtx, {
      type: 'line',
      data: lineData,
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}

function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

form.addEventListener('submit', addTransaction);

init();
