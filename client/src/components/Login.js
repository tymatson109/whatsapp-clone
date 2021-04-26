import axios from '../axios';
import React, { useState } from 'react';
import './Login.css';
import { useStateValue } from './StateProvider';
import { actionTypes } from './Reducer';
import { validate } from './Validate';

const Login = ({register}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [{user}, dispatch] = useStateValue()

    const logIn = async (e) => {
        e.preventDefault()

        if (username.length + 1 > 6 && password.length + 1 > 8) {
            await axios.get(`/users/find`,  {params: {
                username: validate(username)
            }}).then(response => {
                console.log(response)
                if (response.data.username) {
                    if (password === response.data.password) {
                        dispatch({
                            type: actionTypes.SET_USER,
                            user: {
                                username: response.data.username,
                                email: response.data.email,
                                password: response.data.password,
                                image: response.data.image
                            }
                        })
                    } else {
                        return alert("Incorrect password")
                    }
                } else {
                    return alert("Cannot find user")
                }
            })
        } else {
            username.length + 1 < 6 && alert("Username too short!");
            password.length + 1 < 8 && alert("Password too short!");
        }
    }

    const registerClicked = () => {
        register()
    }

    return (
        <div className="login">
            <div className="login__title">
                <div>Login</div>
            </div>
            <div className="login__form">
                <form>
                    <div className="login__input">
                        <div className="login__formLabel">Username</div>
                        <input value={username} onChange={e => setUsername(e.currentTarget.value)} placeholder="Username..." />
                    </div>
                    <div className="login__input">
                        <div className="login__formLabel">Password</div>
                        <input type="password" value={password} onChange={e => setPassword(e.currentTarget.value)} placeholder="Password..." />
                    </div>
                    <button onClick={logIn}>Log In</button>
                </form>
                <div className="login__register">
                    <div>Don't have an account? Register!</div>
                    <button onClick={() => registerClicked()} >Register</button>
                </div>
            </div>
        </div>
    )
}

export default Login
