import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../actions/authAction';
import PropTypes from 'prop-types';
import store from '../../store';
import Spinner from '../spinner/Spinner';


const Navbar = ({auth:{isAuthenticated, loading}, logout}) => {
  
  const authLinks = (
    <ul>
    <li><Link to="/profiles"> Developers </Link> </li>
    <li><Link to="/posts"> Posts </Link> </li>
     <li>
      <Link to="/dashboard">
        <i className="fas fa-user"></i>{' '} 
        <span className="hide-sm">Dashboard</span> 
      </Link> 
     </li>
     <li>
        <Link onClick={logout} to="/"> 
          <i className="fas fa-sign-out-alt"></i>{' '} 
          <span className="hide-sm">Logout</span> 
        </Link> 
     </li>
  </ul>
  )

  const guestLinks = (
    <ul>
      <li><Link to="/profiles"> Developers </Link> </li>
      <li><Link to="/register"> Register </Link> </li>
      <li><Link to="/login"> Login </Link> </li>
      
    </ul>
  )

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/"><i className="fas fa-code"/> DevConnector </Link>
      </h1>
      { loading ? <Spinner/> : (<Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>)}
    </nav>
  )
}

console.log(store.getState())   //THE MOST IMPORTANT THING TO UNDERSTAND REDUX AND STORE AND STATE

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({   
    auth: state.authReducer    
});

export default connect(mapStateToProps, {logout})(Navbar)