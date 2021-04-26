import React, { useState } from 'react'
import './LoginPage.css';
import Login from './Login';
import { actionTypes } from './Reducer';
import Register from './Register';
import { useStateValue } from './StateProvider';

const LoginPage = () => {

    const [register, setRegister] = useState(false)
    const [{user}, dispatch] = useStateValue()

    const registerOpen = () => {
        setRegister(!register)
    }

    const logOut = () => {
        dispatch({
            type: actionTypes.SET_USER,
            user: {
                username: null,
                email: null,
                password: null
            }
        })

        setRegister(false)
    }

    return (
        <div className="loginPage">
            <div className="loginPage__loginContainer">
                {!register
                ? <Login register={registerOpen}/>
                : <Register register={registerOpen}/>
                }
            </div>
        </div>
    )
}

export default LoginPage;