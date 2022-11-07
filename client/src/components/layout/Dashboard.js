import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { deleteAccount, getCurrentProfile } from '../../actions/profileAction'
import DashoboardEdit from './DashoboardEdit'

const Dashboard = ({getCurrentProfile, auth:{user}, profile:{profile, loading}, deleteAccount}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  return <Fragment>
    <h1 className='large text-primary'>Dashboard</h1>
    <p className='lead'><i className="fas fa-user">Welcom {user && user.name}</i></p>
    {profile !== null ? (
      <Fragment>
        <DashoboardEdit/>
        <div className="my-2">
          <button className="btn btn-danger" onClick={() => deleteAccount()}>
            <i className="fas fa-user-minus"></i>
            Delete My Account
          </button>
        </div>
      </Fragment> 
    ):( 
      <Fragment>
        <p>You have not yet setup a profile</p>
        <Link to='/createprofile' className="btn btn-primary my-1">
          Create Profile
        </Link>
      </Fragment>
    )}
  </Fragment>
  
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({   
  auth: state.authReducer,
  profile: state.profileReducer
});

export default connect(mapStateToProps, {getCurrentProfile, deleteAccount})(Dashboard) 