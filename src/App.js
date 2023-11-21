
import './App.css';
import {
  BrowserRouter,
  Switch,
  Route,
} from "react-router-dom";
import Header from './Components/Header/Header';
import Foods from './features/Foods/foods';
import foodReceived from './features/FoodReceived/foodReceived';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path="/foods" component ={Foods} />
        <Route path="/foodReceived" component ={foodReceived} />
      </Switch>
    </BrowserRouter>
  );
}
export default App;
