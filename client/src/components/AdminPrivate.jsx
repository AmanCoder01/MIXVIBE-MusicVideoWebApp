import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

const AdminPrivate = ({ children }) => {

    const { user } = useSelector(state => state.auth);

    if (user?.isAdmin) {
        return children
    }
    else {
        return <Navigate to="/signin" />
    }
}

export default AdminPrivate
