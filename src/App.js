// React imports
import React, { useReducer, useEffect } from "react";
import "./App.css";

//import Home Page
import Home from "./Home/Home";

//import ToastContainer and its CSS to perform Toastify notification
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//context, reducer and action type imports
import { BudgetContext } from "./Context/BudegetContext";
import reducer from "./Context/reducer";
import { ADD_BUDGET } from "./Context/action.types";

//helper imports
import { getAllBudgets } from "./Dashboard/helper/apicalls";

//Context API - 1st step - Creating an initial state

const initialState = {
  sumOfBudgets: {},
  allBudgets: [],
  isUpdated: false,
};

const App = () => {
  //Creating inital state and dispatch to pass down to all components
  const [state, dispatch] = useReducer(reducer, initialState);

  //destructuring necessary values from the central state
  const { isUpdated } = state;

  //Preloading data function which sets all the fetched data into the central state
  const getallbudgets = async () => {
    //getAllBudgets is a helper function which talks with the backend and gets us all the budget data
    const result = await getAllBudgets();

    //after receving data - setting the fetched values to the central state for other components to use
    dispatch({
      type: ADD_BUDGET,
      payload: result.budgets,
    });
  };

  // preload use effect. This effect will also be affcted whenever a new budget is updated to the DB.
  // Inorder to set this into motion, we always have to flip the switch of isUpdated from the central State.
  useEffect(() => {
    getallbudgets();
  }, [isUpdated]);


  //Core return statement where all the components goes in
  return (

    // sending in the dispatch as well the central state
    <BudgetContext.Provider value={{ state, dispatch }}>
      <div>
        <ToastContainer />
        <Home />
        {/* <Dashboard /> */}
        {/* <h1>Specialized dashboard</h1> */}
      </div>
    </BudgetContext.Provider>
  );
};

export default App;
