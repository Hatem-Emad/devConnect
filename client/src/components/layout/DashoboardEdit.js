import React from 'react'
import { Link } from 'react-router-dom'

const DashoboardEdit = () => {
  return (
    <div className="dash-buttons">
        <Link to="/editprofile" className="btn btn-light">
        <i className="fas fa-user-circle text-primary"/>
            Edit Profile
        </Link>
    </div>
  )
}

export default DashoboardEdit