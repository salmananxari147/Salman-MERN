import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    const { login, register, userInfo, isLoading, error, clearError } = useAuthStore();

    const redirectQuery = new URLSearchParams(location.search).get('redirect');
    const redirect = redirectQuery ? (redirectQuery.startsWith('/') ? redirectQuery : `/${redirectQuery}`) : '/';

    useEffect(() => {
        if (userInfo) {
            // If user is already logged in, redirect them
            navigate(redirect);
        }
    }, [navigate, userInfo, redirect]);

    useEffect(() => {
        // Clear errors when switching modes
        clearError();
    }, [isRegister, clearError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isRegister) {
                await register(name, email, password);
            } else {
                await login(email, password);
            }
        } catch (err) {
            // Error handled in store
        }
    };

    return (
        <div className="section auth-page">
            <div className="container auth-container">
                <div className="auth-card">
                    <h2 className="auth-title">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
                    <p className="auth-subtitle">
                        {isRegister
                            ? 'Join Elégance and discover premium collections'
                            : 'Sign in to access your account and orders'
                        }
                    </p>

                    {error && <div className="error-alert">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">

                        {isRegister && (
                            <div className="input-group">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="input-control"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        <div className="input-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                className="input-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="input-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
                            {isLoading ? 'Processing...' : isRegister ? 'Register' : 'Sign In'}
                        </button>
                    </form>

                    <div className="auth-toggle">
                        <p>
                            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
                            <button
                                type="button"
                                className="btn-toggle text-primary"
                                onClick={() => setIsRegister(!isRegister)}
                            >
                                {isRegister ? 'Log in here' : 'Register here'}
                            </button>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;
