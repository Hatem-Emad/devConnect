import React, {Fragment, useEffect} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layout/Alert';
import './App.css';

//Redux
import { Provider } from 'react-redux';
import store from './store'
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/authAction';

//Dashboard
import Dashboard from './components/layout/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import CreateProfile from './components/profiles/CreateProfile';
import EditProfile from './components/profiles/EditProfile';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profiles/Profile';
import Posts from './components/posts/Posts';



if(localStorage.token){
  setAuthToken(localStorage.token)
}

const App = () =>{
  useEffect(() => {
    store.dispatch(loadUser(), []);  
  });
     //we added [] to make useEffect runs once, without them it would run in cycle forever,
     // and we can add props inside it to update whenever these props update
  

  return (
  <Provider store={store}>
    <BrowserRouter>
      <Fragment>
        <Navbar />
        <Routes>
          <Route exact path='/' element={<Landing/>} />
        </Routes>
        <section className='container'>
          <Alert/>
          <Routes>
            <Route exact path='/register' element={<Register/>}/>
            <Route exact path='/login' element={<Login/>}/>
            <Route exact path='/dashboard' element={ <Dashboard/> }/>
            <Route exact path='/createprofile' element={ <CreateProfile/> }/>
            <Route exact path='/editprofile' element={ <EditProfile/> }/>
            <Route exact path='/profiles' element={ <Profiles/> }/>
            <Route exact path='/profile/:id' element={ <Profile/> }/>
            <Route exact path='/posts' element={ <Posts/> }/>
          </Routes>
        </section>
      </Fragment>
    </BrowserRouter>
  </Provider>
  );
}

export default App;
