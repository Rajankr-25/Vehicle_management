import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Wrench, Clock, PackageCheck, Plus, X } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [repairs, setRepairs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRepairForm, setShowRepairForm] = useState(false);
    const [repairData, setRepairData] = useState({ vehicleName: '', description: '' });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [bRes, rRes] = await Promise.all([
                API.get('/bookings/mybookings'),
                API.get('/repairs/myrepairs')
            ]);
            setBookings(bRes.data);
            setRepairs(rRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRepairSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/repairs', repairData);
            setShowRepairForm(false);
            setRepairData({ vehicleName: '', description: '' });
            fetchData();
        } catch (err) {
            alert('Failed to submit repair request');
        }
    };

    if (loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>Loading dashboard...</div>;

    return (
        <div style={{ padding: '4rem 5%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome, {user?.name}</h1>
                    <p style={{ color: 'var(--secondary)' }}>Track your vehicle purchases and service history here.</p>
                </div>
                <button onClick={() => setShowRepairForm(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={20} /> Request Repair
                </button>
            </div>

            {showRepairForm && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem' }}>
                    <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', maxWidth: '500px', width: '100%', position: 'relative' }}>
                        <button onClick={() => setShowRepairForm(false)} style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', background: 'none', color: 'var(--secondary)' }}>
                            <X size={24} />
                        </button>
                        <h2 style={{ marginBottom: '1.5rem' }}>Request Repair</h2>
                        <form onSubmit={handleRepairSubmit}>
                            <div style={{ marginBottom: '1.2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Vehicle Name/Model</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. BMW X5" 
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                                    value={repairData.vehicleName}
                                    onChange={e => setRepairData({...repairData, vehicleName: e.target.value})}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Issue Description</label>
                                <textarea 
                                    placeholder="Describe the problem..." 
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #e2e8f0', minHeight: '120px' }}
                                    value={repairData.description}
                                    onChange={e => setRepairData({...repairData, description: e.target.value})}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem' }}>Submit Request</button>
                        </form>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
                {/* Bookings Section */}
                <div>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <ShoppingBag color="var(--primary)" /> Recent Bookings
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {bookings.length > 0 ? bookings.map(b => (
                            <div key={b._id} style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: 'var(--shadow)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ margin: 0 }}>{b.vehicle?.name}</h4>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>{new Date(b.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.2rem' }}>${b.vehicle?.price?.toLocaleString()}</div>
                                    <span style={{ 
                                        padding: '0.2rem 0.8rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700,
                                        background: b.status === 'Approved' ? '#dcfce7' : b.status === 'Pending' ? '#fef3c7' : '#e0f2fe',
                                        color: b.status === 'Approved' ? '#166534' : b.status === 'Pending' ? '#92400e' : '#0369a1'
                                    }}>{b.status}</span>
                                </div>
                            </div>
                        )) : (
                            <div style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', borderRadius: '16px', color: 'var(--secondary)' }}>No bookings yet.</div>
                        )}
                    </div>
                </div>

                {/* Repair Section */}
                <div>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <Wrench color="var(--primary)" /> Repair Tracking
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {repairs.length > 0 ? repairs.map(r => (
                            <div key={r._id} style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: 'var(--shadow)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <h4 style={{ margin: 0 }}>{r.vehicleName}</h4>
                                    <span style={{ 
                                        padding: '0.2rem 0.8rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700,
                                        background: r.status === 'Completed' ? '#dcfce7' : r.status === 'In Progress' ? '#fef3c7' : '#e0f2fe',
                                        color: r.status === 'Completed' ? '#166534' : r.status === 'In Progress' ? '#92400e' : '#0369a1'
                                    }}>{r.status}</span>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--secondary)', marginBottom: '0.8rem' }}>{r.description}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--secondary)' }}>
                                    <Clock size={14} /> Registered: {new Date(r.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        )) : (
                            <div style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', borderRadius: '16px', color: 'var(--secondary)' }}>No repair requests found.</div>
                        )}
                    </div>
                    {repairs.length === 0 && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', marginTop: '0.5rem', textAlign: 'center' }}>
                            Click "Request Repair" at the top to start.
                        </p>
                    )}
                </div>
            </div>

            {/* Delivery Tracking Simulation */}
            <div style={{ marginTop: '4rem', background: 'var(--dark)', color: 'white', padding: '3rem', borderRadius: '24px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <PackageCheck /> Delivery Status
                </h2>
                {bookings.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        {bookings.filter(b => b.status !== 'Delivered').map(b => (
                            <div key={b._id}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                                    <span style={{ fontWeight: 600 }}>{b.vehicle?.name}</span>
                                    <span style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>ETA: 3-5 Business Days</span>
                                </div>
                                <div style={{ height: '10px', background: '#334155', borderRadius: '5px', overflow: 'hidden' }}>
                                    <div style={{ width: b.status === 'Approved' ? '65%' : '25%', height: '100%', background: 'var(--primary)', transition: 'width 1.5s ease-out' }}></div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.7rem', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    <span style={{ color: 'white' }}>Pending</span>
                                    <span style={{ color: b.status === 'Approved' ? 'white' : 'inherit' }}>Approved</span>
                                    <span>Shipping</span>
                                    <span>Delivered</span>
                                </div>
                            </div>
                        ))}
                        {bookings.filter(b => b.status !== 'Delivered').length === 0 && (
                            <p style={{ color: '#94a3b8' }}>All current orders have been delivered.</p>
                        )}
                    </div>
                ) : (
                    <p style={{ color: '#94a3b8' }}>No active deliveries to track. Book a vehicle to see progress.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
