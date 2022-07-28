import React, { useContext, useEffect, useState } from "react";
import { FaMoneyBillWave } from "react-icons/fa";
import { GiExpense } from "react-icons/gi";
import { RiBankFill } from "react-icons/ri";
import { ADD_BUDGET, IS_UPDATED } from "../Context/action.types";
import { BudgetContext } from "../Context/BudegetContext";
import "./dashboard.css";
import { getAllBudgets } from "./helper/apicalls";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const Dashboard = () => {
  //destructuring central state and dispatch from the context
  const { state, dispatch } = useContext(BudgetContext);

  const [monthToDateObj, setMonthToDateObj] = useState({
    income: 0,
    expense: 0,
    savings: 0,
    isLoaded: false,
  });

  const [incomeTypes, setIncomeTypes] = useState([]);
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [savingsTypes, setSavingsTypes] = useState([]);

  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  //Preloading data function which sets all the fetched data into the central state
  const getallbudgets = async () => {
    //getAllBudgets is a helper function which talks with the backend and gets us all the budget data
    const result = await getAllBudgets();
    console.log(result, "result ");
    let typeIncomeTempData = [];
    let typeexpenseTempData = [];
    let typesavingsTempData = [];
    result.budgets.forEach((eachItm) => {
      let eachitmCreatedMonth = new Date(eachItm.createdAt).getMonth();
      let currentMonth = new Date().getMonth();
      if (eachitmCreatedMonth === currentMonth) {
        console.log(eachItm, " conidtioned item");
        switch (eachItm.budgetType) {
          case "savings":
            typesavingsTempData.push(eachItm);
            tempStateMonthObj.savings =
              tempStateMonthObj.savings + eachItm.amount;

            return;

          case "income":
            console.log("inside income");
            typeIncomeTempData.push(eachItm);
            tempStateMonthObj.income =
              tempStateMonthObj.income + eachItm.amount;
            return;

          case "expense":
            typeexpenseTempData.push(eachItm);
            tempStateMonthObj.expense =
              tempStateMonthObj.expense + eachItm.amount;

            return;

          default:
            break;
        }
      }
    });

    console.log(tempStateMonthObj, " temp state");

    setMonthToDateObj({
      ...monthToDateObj,
      isLoaded: true,
      savings: tempStateMonthObj.savings,
      income: tempStateMonthObj.income,
      expense: tempStateMonthObj.expense,
    });
    console.log(typeIncomeTempData, typeexpenseTempData, typesavingsTempData);
    setIncomeTypes([...typeIncomeTempData])
    setExpenseTypes([...typeexpenseTempData])
    setSavingsTypes([...typesavingsTempData])

    //after receving data - setting the fetched values to the central state for other components to use
    dispatch({
      type: ADD_BUDGET,
      payload: result.budgets,
    });
  };

  // preload use effect. This effect will also be affcted whenever a new budget is updated to the DB.
  // Inorder to set this into motion, we always have to flip the switch of isUpdated from the central State.

  const { allBudgets, isUpdated } = state;
  console.log(allBudgets);
  let tempStateMonthObj = {
    income: 0,
    expense: 0,
    savings: 0,
    isLoaded: false,
  };

  useEffect(() => {
    getallbudgets();
  }, [isUpdated]);

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <div className="grid-container">
        <div className="dashboard__grid-container">
          <h3 style={{ textAlign: "left", margin: "10px 0px" }}>
            Month to date
          </h3>
          {monthToDateObj.isLoaded && (
            <div className="dashboard__grid-items">
              <div className="overview-item">
                <div className="overview-icon-container">
                  <FaMoneyBillWave className="overview-icon" />
                </div>
                <div className="overview-details">
                  <div className="label-3">Total Income</div>
                  <h1>₹ {monthToDateObj.income}</h1>
                </div>
              </div>
              <div className="overview-item">
                <div className="overview-icon-container">
                  <GiExpense className="overview-icon" />
                </div>
                <div className="overview-details">
                  <div className="label-3">Total Expense</div>
                  <h1>₹ {monthToDateObj.expense}</h1>
                </div>
              </div>
              <div className="overview-item">
                <div className="overview-icon-container">
                  <RiBankFill className="overview-icon" />
                </div>
                <div className="overview-details">
                  <div className="label-3">Total Savings</div>
                  <h1>₹ {monthToDateObj.savings}</h1>
                </div>
              </div>
            </div>
          )}
          <BarChart
            width={500}
            height={300}
            data={incomeTypes}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis dataKey='amount' />
            <Tooltip />
            <Legend />
            <Bar dataKey="budgetTypesType" stackId="a" fill="#8884d8" />
            <Bar dataKey="amount" stackId="b" fill="#82ca9d" />
            <Bar dataKey="uv" fill="#ffc658" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
