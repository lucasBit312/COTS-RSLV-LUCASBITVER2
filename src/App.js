import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/footer';
import Foods from './features/Foods/foods';
import FoodReceived from './features/FoodReceived/FoodReceived';
import DonateFood from './features/DonateFood/DonateFood';
import ManageFoodDonated from './features/ManageFoodDonated/ManageFoodDonated';
import EditFood from './features/ManageFoodDonated/EditFood/EditFood';
import Profice from './features/Profice/Profice';
import DetailReceived from './features/FoodReceived/DetailReceived';
import ManageHistoryDonate from './features/ManageHistoryDonated/ManageHistoryDonate';
import Notice from './features/Notice/Notice';
import FoodLocations from './features/FoodLocations/FoodLocations';
import DetailFoodLocation from './features/FoodLocations/DetailFoodLocation';
const PrivateRoute = ({ component: Component, ...rest }) => {
  const currentUser = useSelector((state) => state.user.current);
  return (
    <Route
      {...rest}
      render={(props) =>
        currentUser && currentUser.id ? (
          <Component {...props} />
        ) : (
          <Redirect to="/foods" />
        )
      }
    />
  );
};

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path="/foods" component={Foods} />
        <Route path="/food-donation-locations/:locationId" component={DetailFoodLocation} />
        <Route path="/food-donation-locations" component={FoodLocations} />
        <PrivateRoute path={`/food-received/:foodId`} component={DetailReceived} />
        <PrivateRoute path="/food-received" component={FoodReceived} />
        <PrivateRoute path="/donate-foods" component={DonateFood} />
        <PrivateRoute path="/notification" component={Notice} />
        <PrivateRoute path="/manager-food-donated/edit/:id" component={EditFood} />
        <PrivateRoute path="/manager-history-food-donated" component={ManageHistoryDonate} />
        <PrivateRoute path="/manager-food-donated" component={ManageFoodDonated} />
        <PrivateRoute path="/profice/:tab" component={Profice} />
      </Switch>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
