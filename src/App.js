import './App.css';
import {
  BrowserRouter,
  Switch,
  Route,
} from "react-router-dom";
import Header from './Components/Header/Header';
import Footer from './Components/Footer/footer';
import Foods from './features/Foods/foods';
import FoodReceived from './features/FoodReceived/FoodReceived';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path="/foods" component={Foods} />
        <Route path="/foodReceived" component={FoodReceived} />
      </Switch>
      <Footer />
    </BrowserRouter>
  );
}
export default App;
