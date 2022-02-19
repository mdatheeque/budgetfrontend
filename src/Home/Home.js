// import react
import React, { useState, useEffect, useContext } from "react";

//import CSS related to home - separate file kept for ease of use.
import "./Home.css";

//importing helper api functions which are neccessary for this component or page alone
import { addABudget, getSumOfBudgetTypes } from "./helper/apicalls";


//All the react icon imports
import {
  FaAngleDoubleRight,
  FaChartBar,
  FaEdit,
  FaMoneyBillWave,
} from "react-icons/fa";
import { GiExpense, GiCash } from "react-icons/gi";
import { RiBankFill } from "react-icons/ri";

//import toast to trigger
import { toast } from "react-toastify";

//context and action type imports
import { BudgetContext } from "../Context/BudegetContext";
import { ADD_SUM_BUDGET, IS_UPDATED } from "../Context/action.types";

//This is the HOME page component
//This contains : 
//1. The overview of the app.
//2. Input fields to add a budget transaction
//3. An overall overview of all the types of budgets
const Home = () => {

  //destructuring central state and dispatch from the context
  const { state, dispatch } = useContext(BudgetContext);

  //destructuring the neccessary values from the state
  const { sumOfBudgets, isUpdated } = state;

  //All sub states or this component states
  const [subTransType, setSubTransType] = useState([
    "Fixed Expense",
    "Recurring Expense",
    "Non-Recurring Expense",
    "Whammy Expense",
  ]);

  const [values, setValues] = useState({
    budgetType: "Expense",
    budgetTypesType: "Fixed Expense",
    category: "Atheeque Work",
    budgetReceivedThroughOrUsedOn: "",
    comments: "",
    amount: "",
    status: false,
  });

  //Use Effect to get the overview value from the DB and execute them again if a transaction is added
  useEffect(() => {
    setValues({ ...values, status: false });
    preload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.status]);

  

  //preloads
  const preload = () => {

    //helper function to get the overview values alone from the DB
    getSumOfBudgetTypes().then((data) => {

      //Search function to identify the individual key from the array of objects 
      function search(nameKey, myArray) {
        for (var i = 0; i < myArray.length; i++) {
          if (myArray[i]._id === nameKey) {
            return myArray[i];
          }
        }
      }

      //Execution of the search function with the respected key values
      let expenseDB = search("expense", data);
      let incomeDB = search("income", data);
      let savingsDB = search("savings", data);


      //Setting up all the data into a temporary obj to dispatch into the central state
      const sumOfBudgets = {
        expense: expenseDB.total,
        income: incomeDB.total,
        savings: savingsDB.total,
        cashInHand: incomeDB.total - expenseDB.total - savingsDB.total,
      };


      //dispatching the fetched overview value to the central state
      dispatch({
        type : ADD_SUM_BUDGET,
        payload : sumOfBudgets
      })

      //This will flip the switch and this will make the useEffect from App.js to retrigger to fetch the new data
      dispatch({
        type: IS_UPDATED,
        payload : !isUpdated
      })

    });
  };

  //destructing deep down from the retreived state
  const { expense, income, savings, cashInHand } = sumOfBudgets;

  //toast functions
  const successToast = () => toast.success("Budget addedd successfully");
  const errorToast = (err) => toast.error(err);

  //On change and submits

  const onChangeType = () => {

    //Three types of transaction can be done (expense, income, saving)
    //and each of them have their own respective sub transaction types.
    //As an initial step we are inserting the expense transaction and its sub transaction into the dropdown fields
    //directly inside the HTML
    //To change them this onChangeType function is used

    //Getting transaction type from the ID
    const transType = document.getElementById("transType").value;

    //Standard type and its sub types
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

    //filtering out the other transactions 
    const selectedTransTypeData = transTypeData.filter(
      (TransTypeData) => TransTypeData.type === transType
    );

    //Setting the sub transaction back to this component state and further inserted into input field in HTML
    setSubTransType(selectedTransTypeData[0].data);

    //Setting the intial value back to the HTML (A value will be provided, the dropdown will not be left empty)
    setValues({
      ...values,
      budgetType: selectedTransTypeData[0].type,
      budgetTypesType: selectedTransTypeData[0].data[0],
    });
  };

  //Higher order function which sets the value state whenever the input fileds change.
  //The advantage of higher order function is not to call all the state values one by one
  const handleChange = (name) => (event) => {
    event.preventDefault();
    setValues({ ...values, [name]: event.target.value });
  };

  //End submit function which submits all the writte values into the DB
  const submitValues = async () => {

    //addABudget is the helper function which talks with the DB and inserts the data
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

        //Returing Success toast
        successToast();
      })
      .catch((err) => {
        //Returning Error toast
        errorToast(err);
      });

    //Setting back values to normal once the data got updated successfully
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
  };

  // Ui parts

  //This is the about part of the home page
  const Aboutapp = () => (

    //Grid display has been used here
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

  //This contains all the input fields
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

  //This part contains the overview of all the budget
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
            <h1>₹ {income}</h1>
          </div>
        </div>
        <div className="overview-item">
          <div className="overview-icon-container">
            <GiExpense className="overview-icon" />
          </div>
          <div className="overview-details">
            <div className="label-3">Total Expense</div>
            <h1>₹ {expense}</h1>
          </div>
        </div>
        <div className="overview-item">
          <div className="overview-icon-container">
            <RiBankFill className="overview-icon" />
          </div>
          <div className="overview-details">
            <div className="label-3">Total Savings</div>
            <h1>₹ {savings}</h1>
          </div>
        </div>
        <div className="overview-item">
          <div className="overview-icon-container">
            <GiCash className="overview-icon" />
          </div>
          <div className="overview-details">
            <div className="label-3">Total Cash in Hand</div>
            <h1>₹ {cashInHand}</h1>
          </div>
        </div>
      </div>
    </div>
  );

  //Core return statemnet of this Home Component
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
