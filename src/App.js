import React from 'react';
import './App.css';
import './App.css';
import View from './View';
import Product from './Product';
import Material from './Material';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Button from '@mui/joy/Button';

function App() {

  return (
    <Router>
      <div className="App">
        <div className="header">
          <Link to="/view">
            <Button sx={{ fontFamily: 'Mediumpoppin' }} color="success" variant="solid">
              Home
            </Button>
          </Link>
          {/* <Link to="/prod">
            <Button sx={{ fontFamily: 'Mediumpoppin' }} color='#FFD700' variant="plain">
              Product
            </Button>
          </Link> */}
          <Link to="/material">
            <Button sx={{ fontFamily: 'Mediumpoppin', marginLeft: '20px' }} color='success' variant="solid">
              Products
            </Button>
          </Link>
        </div>
        <div>
          <Switch>
            <Route path='/prod'>
              <Product />
            </Route>
            <Route path='/material'>
              <Material />
            </Route>
            <Route path='/'>
              <View />
            </Route>
            <Route path='/view'>
              <View />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
