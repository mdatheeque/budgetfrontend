//importing all the action types
import {
  ADD_BUDGET,
  EDIT_BUDGET,
  DELETE_BUDGET,
  ADD_SUM_BUDGET,
  IS_UPDATED,
} from "./action.types";

//default export of the reducer
export default (state, action) => {
  switch (action.type) {
    //Loads the state and appends the newly added values back to the sum of budgets
    case ADD_SUM_BUDGET:
      return {
        ...state,
        sumOfBudgets: action.payload,
      };

    //Loads the central state and appends the newly added budgets
    case ADD_BUDGET:
      return {
        ...state,
        allBudgets: action.payload,
      };

    //Flip switch to execute the useEffect in the App.js
    case IS_UPDATED:
      return {
        ...state,
        isUpdated: action.payload,
      };
    case EDIT_BUDGET:
      //TODO:
      return state;
    case DELETE_BUDGET:
      //TODO:
      return state;
    default:
      break;
  }
};
