import React from "react";
import "./Dashboard.css";

const Dashboard = () => {
  // Ui parts
  const monthToDate = () => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthsToDisplay = [];
    const date = new Date();
    const presentMonthNum = date.getMonth();

    for (let eachMonth = 0; eachMonth <= presentMonthNum; eachMonth++) {
      monthsToDisplay.push(monthNames[eachMonth]);
    }

    console.log(monthsToDisplay);

    console.log(presentMonthNum);
    return (
      <div>
        <div className="grid-container-dash">
          <div className="grid-item-dash-1">
              
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container-dash">
      <h2 className="Dash-heading">Dashboard</h2>
      {monthToDate()}
    </div>
  );
};

export default Dashboard;
