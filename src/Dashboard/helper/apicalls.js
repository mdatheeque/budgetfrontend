import { API } from "../../backend";

export const getAllBudgets = () => {
  console.log(API, ' get All budgets');
  return fetch(`${API}getallbudgets`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};