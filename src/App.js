import "./App.css";
import Dashboard from "./Dashboard/Dashboard";
import Home from "./Home/Home";
import {ToastContainer} from 'react-toastify'


const App = () => (
  <div>
    <ToastContainer />
    <Home />
    <Dashboard />
    <h1>Specialized dashboard</h1>
  </div>
);

export default App;
