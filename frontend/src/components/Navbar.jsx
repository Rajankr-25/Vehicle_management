import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="nav-logo">
                <Car size={32} />
                <span>AutoVibe</span>
            </Link>

            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/vehicles">Vehicles</Link></li>
                {user && <li><Link to="/dashboard">My Bookings</Link></li>}
                {user?.role === 'Admin' && <li><Link to="/admin">Admin Panel</Link></li>}
            </ul>

            <div className="nav-auth">
                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontWeight: 600 }}>Hello, {user.name}</span>
                        {user.role === 'Admin' ? (
                            <Link to="/admin" className="btn-outline" style={{ padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <LayoutDashboard size={18} /> Panel
                            </Link>
                        ) : (
                            <Link to="/dashboard" className="btn-outline" style={{ padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <UserIcon size={18} /> Dash
                            </Link>
                        )}
                        <button onClick={handleLogout} className="btn-primary" style={{ padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--danger)' }}>
                            <LogOut size={18} />
                        </button>
                    </div>
                ) : (
                    <>
                        <Link to="/login" className="btn-outline">Login</Link>
                        <Link to="/register" className="btn-primary">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
