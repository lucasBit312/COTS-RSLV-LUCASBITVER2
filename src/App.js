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
        <PrivateRoute path="/foodReceived" component={FoodReceived} />
        <PrivateRoute path="/donate-foods" component={DonateFood} />
        <PrivateRoute path="/manager-food-donated/edit/:id" component={EditFood} />
        <PrivateRoute path="/manager-food-donated" component={ManageFoodDonated} />
      </Switch>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
