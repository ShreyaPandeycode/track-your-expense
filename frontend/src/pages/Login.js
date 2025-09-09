import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { APIUrl, handleError, handleSuccess } from '../utils';

function Login() {
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    })

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        const copyLoginInfo = { ...loginInfo };
        copyLoginInfo[name] = value;
        setLoginInfo(copyLoginInfo);
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) {
            return handleError('Email and password are required')
        }
        
        setLoading(true);
        try {
            const url = `${APIUrl}/auth/login`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            });
            const result = await response.json();
            const { success, message, jwtToken, name, error } = result;
            
            if (success) {
                handleSuccess(`Welcome back, ${name}! 🎉`);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                setTimeout(() => {
                    navigate('/home')
                }, 1000)
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
        } catch (err) {
            handleError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <div className='container'>
                <h1>Welcome Back</h1>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor='email'>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email..."
                            value={loginInfo.email}
                            onChange={handleChange}
                            autoComplete="off"
                            disabled={loading}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor='password'>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password..."
                            value={loginInfo.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            disabled={loading}
                        />
                    </div>
                    <button type='submit' className="btn-primary" disabled={loading}>
                        {loading ? '🔄 Signing In...' : 'Sign In'}
                    </button>
                </form>
                <div className="auth-link">
                    Don't have an account?
                    <Link to="/signup">Create Account</Link>
                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    )
}

export default Login