import React, {useState} from 'react';
import './Register.css';
import axios from '../axios';
import { useStateValue } from './StateProvider';
import { actionTypes } from './Reducer';
import { validate } from './Validate'

const Register = ({register}) => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [{user}, dispatch] = useStateValue()

    const registerClosed = () => {
        register()
    }

    const registerUser = (e) => {
        const validateEmail = (email) => {
            const validate = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return validate.test(String(email).toLowerCase());
        }
        e.preventDefault()
        if (username.length + 1 > 6) {
            if (validateEmail(email)) {
                if (password.length + 1 > 8) {
                    if (confirmPassword === password) {
                        axios.get('/users/find', {params: {
                            username: validate(username)
                        }}).then(response => {
                            if (response.data.username !== validate(username)) {
                                axios.post('/users/new', {
                                    username: validate(username),
                                    email: email,
                                    password: password
                                })

                                setUsername('')
                                setEmail('')
                                setPassword('')
                                setConfirmPassword('')
                                
                                dispatch({
                                    type: actionTypes.SET_USER,
                                    user: {
                                        username: validate(username),
                                        email: email,
                                        password: password
                                    }
                                })
                            } else {
                                return alert("Username taken...")
                            }});
                        } else {
                            return alert("Password's do not match!")
                        };
                    } else {
                        return alert("Password must be at least 8 characters!")
                    };
                } else {
                    return alert("Not a valid email address!")
                };
            } else {
                return alert("Username must be at least 6 characters!")
            };
    };

    return (
        <div className="register">
            <button onClick={registerClosed}>Back</button>
            <div className="register__container">
                <div className="register__title">Create an Account!</div>
                <form>
                    <div className="register__entry">
                        <div>Username:</div>
                        <input value={username} onChange={e => setUsername(e.currentTarget.value)} placeholder="Username..." required/>
                    </div>
                    <div className="register__entry">
                        <div>E-mail Address:</div>
                        <input value={email} onChange={e => setEmail(e.currentTarget.value)} placeholder="Email..." required/>
                    </div>
                    <div className="register__entry">
                        <div>Password</div>
                        <input value={password} onChange={e => setPassword(e.currentTarget.value)} type="password" placeholder="password" required/>
                    </div>
                    <div className="register__entry">
                        <div>Confirm Password</div>
                        <input value={confirmPassword} onChange={e => setConfirmPassword(e.currentTarget.value)} type="password" placeholder="password" required/>
                    </div>
                    <button type="submit" onClick={registerUser}>Sign Up!</button>
                </form>
            </div>
        </div>
    )
}

export default Register
