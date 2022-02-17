import { API } from "../../backend";

export const getSumOfBudgetTypes = () => {
  console.log(API);
  return fetch(`${API}getsumofbudgettype`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const addABudget = (budget) => {
  return fetch(`${API}addabudget`,{
    method: 'POST',
    headers : {
      Accept : 'application/json',
      'Content-Type' : 'application/json'
    },
    body: JSON.stringify(budget)
  })
  .then((res) => {
    return res.json();
  })
  .catch((err) => console.log(err))
}
