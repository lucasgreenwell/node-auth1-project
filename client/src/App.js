import React from 'react';
import axios from 'axios';
import {BrowserRouter, Route} from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';
import Users from './components/Users';



function App() {


  return (
    <BrowserRouter>
      <Route path='/login' component={Login}/>
      <Route path='/register' component={Register}/>
      <Route path='/users' component={Users}/>
    </BrowserRouter>
  );
}

export default App;
