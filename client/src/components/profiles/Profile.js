import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getProfileById } from '../../actions/profileAction'
import { Link, useParams } from 'react-router-dom'
import Spinner from '../spinner/Spinner'
import ProfileTop from './ProfileTop'
import ProfileAbout from './ProfileAbout'


const Profile = ({
    getProfileById, 
    profile:{profile, loading}, 
    auth
}) => {
    const {id} = useParams();
  useEffect(() => {
    getProfileById(id)
  }, [getProfileById])

    return (
    <Fragment>
        {profile === null || loading ? (
            <Spinner />
        ) : (
            <Fragment>
                <div class="profile-grid my-1">
                    <ProfileTop profile={profile}></ProfileTop>
                    <ProfileAbout profile={profile}></ProfileAbout>
                </div>

                <Link to='/profiles' className='btn btn-light'>
                    Back to Profiles
                </Link> 
                {auth.isAuthenticated && 
                auth.loading === false && 
                auth.user._id === profile.user._id && 
                (<Link to='/editprofile' className='btn btn-dark'> Edit Profile</Link>)}

            </Fragment>
            )
        }
    </Fragment>
  )
}

Profile.propTypes = {
getProfileById: PropTypes.func.isRequired,
profile: PropTypes.object.isRequired,
auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profileReducer,
    auth: state.authReducer
})
export default connect(mapStateToProps, {getProfileById})(Profile)