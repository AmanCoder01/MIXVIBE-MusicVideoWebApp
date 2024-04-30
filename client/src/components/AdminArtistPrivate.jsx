import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

const AdminArtistPrivate = ({ children }) => {

    const { user } = useSelector(state => state.auth);

    if (user?.role === "admin" || user?.role === "artist") {
        return children
    }
    else {
        return <Navigate to="/signin" />
    }
}

export default AdminArtistPrivate
