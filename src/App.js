import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter,
  Switch,
  Route,
} from "react-router-dom";
import Header from './Components/Header/Header';
import Foods from './features/Foods/foods';
import Cart from './features/Cart/Cart';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path="/foods" component ={Foods} />
        <Route path="/cart" component ={Cart} />
      </Switch>
    </BrowserRouter>
  );
}
export default App;
