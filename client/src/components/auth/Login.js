import React, {Fragment, useState} from 'react'
import { connect } from 'react-redux';
import {Link, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { login } from '../../actions/authAction';

const Login = ({login, isAuthenticated}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const {email, password} = formData;
  const onchange = e => setFormData({...formData, [e.target.name]: e.target.value})
 
  const onsubmit = async e => {
    e.preventDefault();
    login(email, password)
    console.log('SUCCESS login')
    };

    //Redirect if logged in (authenticated)
    if(isAuthenticated){
      return <Navigate to="/dashboard" />
    }

  return <Fragment>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>
      <form className="form" onSubmit={e => onsubmit(e)}>
        <div className="form-group">
          <input
           type="email"
           placeholder="Email Address" 
           name="email" 
           value={email} 
           onChange={e => onchange(e)} 
           required 
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password} 
            onChange={e => onchange(e)} 
            required 
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Dont have an account? <Link to="/register">Sign Up</Link>
      </p>  
  </Fragment> 
}
Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.authReducer.isAuthenticated
})

export default connect(mapStateToProps,{login})(Login)