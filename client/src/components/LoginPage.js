import React, { useState } from 'react'
import './LoginPage.css';
import Login from './Login';
import Register from './Register';

const LoginPage = () => {

    const [register, setRegister] = useState(false)

    const registerOpen = () => {
        setRegister(!register)
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