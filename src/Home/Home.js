import React, { useState, useEffect } from "react";
import "./Home.css";

import { addABudget, getSumOfBudgetTypes } from "./helper/apicalls";

import {
  FaAngleDoubleRight,
  FaChartBar,
  FaEdit,
  FaMoneyBillWave,
} from "react-icons/fa";
import { GiExpense, GiCash } from "react-icons/gi";
import { RiBankFill } from "react-icons/ri";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  //All states
  const [subTransType, setSubTransType] = useState([
    "Fixed Expense",
    "Recurring Expense",
    "Non-Recurring Expense",
    "Whammy Expense",
  ]);

  const [overViewValues, setOverViewValues] = useState({
    expense: 0,
    income: 0,
    savings: 0,
    cashInHand: 0,
  });

  const [values, setValues] = useState({
    budgetType: "Expense",
    budgetTypesType: "Fixed Expense",
    category: "Atheeque Work",
    budgetReceivedThroughOrUsedOn: "",
    comments: "",
    amount: "",
    status: false,
  });

  //Use Effect
  useEffect(() => {
    setValues({ ...values, status: false });
    preload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.status]);

  const { expense, income, savings, cashInHand } = overViewValues;

  //preloads
  const preload = () => {
    getSumOfBudgetTypes().then((data) => {
      function search(nameKey, myArray) {
        for (var i = 0; i < myArray.length; i++) {
          if (myArray[i]._id === nameKey) {
            return myArray[i];
          }
        }
      }

      let expenseDB = search("expense", data);
      let incomeDB = search("income", data);
      let savingsDB = search("savings", data);

      setOverViewValues({
        ...overViewValues,
        expense: expenseDB.total,
        income: incomeDB.total,
        savings: savingsDB.total,
        cashInHand: incomeDB.total - expenseDB.total - savingsDB.total,
      });
    });
  };

  //toasts
  const successToast = () => toast.success("Budget addedd successfully");
  const errorToast = (err) => toast.error(err);

  //On change and submits

  const onChangeType = () => {
    const transType = document.getElementById("transType").value;
    const transTypeData = [
      {
        type: "Expense",
        data: [
          "Fixed Expense",
          "Recurring Expense",
          "Non-Recurring Expense",
          "Whammy Expense",
        ],
      },
      {
        type: "Income",
        data: ["Earned Income", "Investment Income", "Passive Income"],
      },
      {
        type: "Savings",
        data: ["Stocks", "Gold", "Other"],
      },
    ];

    console.log(transTypeData);
    console.log(transType);
    const selectedTransTypeData = transTypeData.filter(
      (TransTypeData) => TransTypeData.type === transType
    );
    console.log(selectedTransTypeData);
    setSubTransType(selectedTransTypeData[0].data);
    setValues({
      ...values,
      budgetType: selectedTransTypeData[0].type,
      budgetTypesType: selectedTransTypeData[0].data[0],
    });
  };

  const handleChange = (name) => (event) => {
    event.preventDefault();
    setValues({ ...values, [name]: event.target.value });
  };

  const submitValues = async () => {
    addABudget(values)
      .then((data) => {
        console.log(data);

        if (data.err) {
          return errorToast(data.err);
        }
        setValues({
          ...values,
          budgetType: "Expense",
          budgetTypesType: "Fixed Income",
          category: "Atheeque Work",
          budgetReceivedThroughOrUsedOn: "",
          comments: "",
          amount: "",
          status: true,
        });
        successToast();
      })
      .catch((err) => {
        console.log(err);
        errorToast(err);
      });

    setValues({
      ...values,
      budgetType: "Expense",
      budgetTypesType: "Fixed Income",
      category: "Atheeque Work",
      budgetReceivedThroughOrUsedOn: "",
      comments: "",
      amount: "",
      status: false,
    });

    console.log(values);
  };

  // Ui parts
  const Aboutapp = () => (
    <div className="grid-item-1">
      <h1>Personal</h1>
      <h1 style={{ display: "block" }}>Budget App</h1>
      <div className="para">
        <p>A single place budget tracker App</p>
        <p>Which gives you the sophistication</p>
        <p>of the following :</p>
      </div>
      <div className="icons">
        <div className="icon-container">
          <div className="icon-item">
            <FaAngleDoubleRight className="icon" />
            <h4>Add a transaction</h4>
          </div>
          <div className="icon-item">
            <FaChartBar className="icon" />
            <h4>Analyze Budgets</h4>
          </div>
          <div className="icon-item">
            <FaEdit className="icon" />
            <h4>And edit them</h4>
            <h4>if needed !</h4>
          </div>
        </div>
      </div>
    </div>
  );

  const AddATransaction = () => (
    <div className="grid-item-2">
      <h3>Add a Transaction</h3>
      <div className="input-continer">
        <div className="firstRow">
          <div className="input-item">
            <label className="label-4">Transaction type</label>
            <select
              onChange={onChangeType}
              value={values.budgetType}
              id="transType"
            >
              <option value="Expense">Expense</option>
              <option value="Income">Income</option>
              <option value="Savings">Savings</option>
            </select>
          </div>
          <div className="input-item">
            <label className="label-4">Sub Transaction type</label>
            <select
              id="subTransType"
              onChange={handleChange("budgetTypesType")}
              value={values.budgetTypesType}
            >
              {subTransType.map((eachType, index) => (
                <option key={index} value={eachType}>
                  {eachType}
                </option>
              ))}
            </select>
          </div>
          <div className="input-item">
            <label className="label-4">Category</label>
            <select onChange={handleChange("category")} id="category">
              <option value="Atheeque work">Atheeque Work</option>
              <option value="Shop">Shop</option>
              <option value="AsquareDesigns">Asquare Designs</option>
            </select>
          </div>
        </div>
        <div className="secondRow">
          <div className="input-item">
            <label className="label-4">Received / Spent on</label>
            <input
              type="text"
              value={values.budgetReceivedThroughOrUsedOn}
              onChange={handleChange("budgetReceivedThroughOrUsedOn")}
              id="receiveOrSpentOn"
            />
          </div>
          <div className="input-item">
            <label className="label-4">Comments</label>
            <textarea
              name="comments"
              value={values.comments}
              onChange={handleChange("comments")}
              id="comments"
              rows="5"
            ></textarea>
          </div>
          <div className="input-item">
            <label className="label-4">Amount</label>
            <input
              type="text"
              value={values.amount}
              onChange={handleChange("amount")}
              id="amount"
            />
          </div>
        </div>
        <h4 className="button" onClick={submitValues}>
          <span className="button-helper"></span>Submit
        </h4>
      </div>
    </div>
  );

  const BudgetOverview = () => (
    <div className="grid-item-3">
      <h2>Total Budget Overview</h2>
      <div className="overview-container">
        <div className="overview-item">
          <div className="overview-icon-container">
            <FaMoneyBillWave className="overview-icon" />
          </div>
          <div className="overview-details">
            <div className="label-3">Total Income</div>
            <h1>₹ {income.toLocaleString()}</h1>
          </div>
        </div>
        <div className="overview-item">
          <div className="overview-icon-container">
            <GiExpense className="overview-icon" />
          </div>
          <div className="overview-details">
            <div className="label-3">Total Expense</div>
            <h1>₹ {expense.toLocaleString()}</h1>
          </div>
        </div>
        <div className="overview-item">
          <div className="overview-icon-container">
            <RiBankFill className="overview-icon" />
          </div>
          <div className="overview-details">
            <div className="label-3">Total Savings</div>
            <h1>₹ {savings.toLocaleString()}</h1>
          </div>
        </div>
        <div className="overview-item">
          <div className="overview-icon-container">
            <GiCash className="overview-icon" />
          </div>
          <div className="overview-details">
            <div className="label-3">Total Cash in Hand</div>
            <h1>₹ {cashInHand.toLocaleString()}</h1>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container">
      <div className="grid-container">
        {Aboutapp()}
        {AddATransaction()}
        {BudgetOverview()}
      </div>
    </div>
  );
};

export default Home;
