import React, { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import { createProfile, getCurrentProfile } from '../../actions/profileAction';

const EditProfile = ({profile: { profile, loading }, createProfile, getCurrentProfile}) => {
    const [formData, setFormData] = useState({
        location: '',
        state: '', 
        skills: '',
        bio: '',
        githubusername: ''
    });
    
    useEffect(()=>{
        getCurrentProfile();
        setFormData({
            location: loading || !profile.location ? '' : profile.location,
            state: loading || !profile.state ? '' : profile.state,
            skills: loading || !profile.skills ? '' : profile.skills,
            bio: loading || !profile.bio ? '' : profile.bio,
            githubusername: loading || !profile.githubusername ? '' : profile.githubusername
        })
    }, [loading, getCurrentProfile])
    
    const {location, state, skills, bio, githubusername} = formData;
    const onchange = e => setFormData({...formData, [e.target.name]:e.target.value})
    const onsubmit = e => {
      e.preventDefault();
      createProfile(formData, true)
    }

    return (
    <Fragment>
    
    <h1 className="large text-primary">
        Edit Your Profile
      </h1>
      <p className="lead">
        <i className="fas fa-user"></i> 
        Let's get some information to make your profile stand out
      </p>
      <small>*required field</small>
      <form className="form" onSubmit={e => onsubmit(e)}>
        <div className="form-group">
          <select name="state" value={state} onChange={e => onchange(e)}>
            <option value="0">* Select Professional Status</option>
            <option value="Developer">Developer</option>
            <option value="Junior Developer">Junior Developer</option>
            <option value="Senior Developer">Senior Developer</option>
            <option value="Manager">Manager</option>
            <option value="Student or Learning">Student or Learning</option>
            <option value="Instructor">Instructor or Teacher</option>
            <option value="Intern">Intern</option>
            <option value="Other">Other</option>
          </select>
          <small className="form-text">Give us an idea of where you are at in your career</small>
        </div>

        <div className="form-group">
          <input type="text" placeholder="Location" name="location" value={location} onChange={e => onchange(e)} />
          <small className="form-text">City & state suggested (eg. Boston, MA)</small>
        </div>
        <div className="form-group">
          <input type="text" placeholder="* Skills" name="skills" value={skills} onChange={e => onchange(e)}/>
          <small className="form-text">Please use comma separated values (eg.
            HTML,CSS,JavaScript,PHP)</small>
        </div>
        <div className="form-group">
          <input type="text" placeholder="Github Username" name="githubusername" value={githubusername} onChange={e => onchange(e)}/>
          <small className="form-text">If you want your latest repos and a Github link, include your
            username</small>
        </div>
        <div className="form-group">
          <textarea placeholder="A short bio of yourself" name="bio" value={bio} onChange={e => onchange(e)}> </textarea>
          <small className="form-text">Tell us a little about yourself</small>
        </div>

        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">Go Back</Link>
      </form>
    </Fragment>
  )
}

EditProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired
}
const mapStateToProps = state => ({
    profile: state.profileReducer
})
export default connect(mapStateToProps,{createProfile, getCurrentProfile})(EditProfile)