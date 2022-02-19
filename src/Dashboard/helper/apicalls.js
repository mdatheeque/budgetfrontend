import { API } from "../../backend";

export const getAllBudgets = () => {
  console.log(API);
  return fetch(`${API}getallbudgets`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};