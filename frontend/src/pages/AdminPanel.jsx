import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Users, Car, Calendar, Wrench, MapPin, Plus, Trash2, CheckCircle, Clock, Truck, UserPlus } from 'lucide-react';

const AdminPanel = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('vehicles');
    const [data, setData] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (user?.role !== 'Admin') return;
        fetchData();
        fetchEmployees(); // Always fetch employees for potential assignment
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            let res;
            if (activeTab === 'vehicles') res = await API.get('/vehicles');
            if (activeTab === 'bookings') res = await API.get('/bookings');
            if (activeTab === 'repairs') res = await API.get('/repairs');
            if (activeTab === 'employees') res = await API.get('/admin/employees');
            if (activeTab === 'branches') res = await API.get('/admin/branches');
            setData(res?.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const res = await API.get('/admin/employees');
            setEmployees(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this?')) return;
        try {
            if (activeTab === 'vehicles') await API.delete(`/vehicles/${id}`);
            if (activeTab === 'employees') await API.delete(`/admin/employees/${id}`);
            if (activeTab === 'branches') await API.delete(`/admin/branches/${id}`);
            if (activeTab === 'bookings') await API.delete(`/bookings/${id}`);
            if (activeTab === 'repairs') await API.delete(`/repairs/${id}`);
            
            fetchData();
        } catch (err) {
            alert('Delete failed: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (activeTab === 'vehicles') await API.post('/vehicles', formData);
            if (activeTab === 'employees') await API.post('/admin/employees', formData);
            if (activeTab === 'branches') await API.post('/admin/branches', formData);
            
            setShowForm(false);
            setFormData({});
            fetchData();
        } catch (err) {
            alert('Operation failed');
        }
    };

    const updateStatus = async (id, status, type) => {
        try {
            if (type === 'booking') {
                await API.put(`/bookings/${id}/status`, { status });
            } else if (type === 'repair') {
                await API.put(`/repairs/${id}/status`, { status });
            }
            fetchData();
        } catch (err) {
            alert('Update failed');
        }
    };

    const assignEmployee = async (bookingId, employeeId) => {
        try {
            await API.put(`/bookings/${bookingId}/assign`, { employeeId });
            fetchData();
            alert('Employee assigned successfully!');
        } catch (err) {
            alert('Assignment failed');
        }
    };

    if (user?.role !== 'Admin') return <div style={{ padding: '5rem', textAlign: 'center' }}>Access Denied.</div>;

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <h2 style={{ marginBottom: '2.5rem', color: 'var(--primary)' }}>Admin Central</h2>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[
                        { id: 'vehicles', label: 'Vehicles', icon: Car },
                        { id: 'bookings', label: 'Bookings', icon: Calendar },
                        { id: 'repairs', label: 'Repairs', icon: Wrench },
                        { id: 'employees', label: 'Employees', icon: Users },
                        { id: 'branches', label: 'Branches', icon: MapPin },
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setShowForm(false); }}
                            style={{ 
                                display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '12px',
                                background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                                color: activeTab === tab.id ? 'white' : '#94a3b8',
                                textAlign: 'left', fontWeight: activeTab === tab.id ? 700 : 500
                            }}
                        >
                            <tab.icon size={20} /> {tab.label}
                        </button>
                    ))}
                </nav>
            </aside>

            <main className="main-content">
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <h1>Manage {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                    {(activeTab === 'vehicles' || activeTab === 'employees' || activeTab === 'branches') && (
                        <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Plus size={20} /> Add {activeTab.slice(0, -1)}
                        </button>
                    )}
                </header>

                {showForm && (
                    <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', marginBottom: '3rem', boxShadow: 'var(--shadow-lg)', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Add New {activeTab.slice(0, -1)}</h3>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            {activeTab === 'vehicles' && (
                                <>
                                    <input placeholder="Name" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} onChange={e => setFormData({...formData, name: e.target.value})} required />
                                    <select style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} onChange={e => setFormData({...formData, type: e.target.value})} required>
                                        <option value="">Select Type</option>
                                        <option value="Car">Car</option>
                                        <option value="Bike">Bike</option>
                                    </select>
                                    <input type="number" placeholder="Price" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} onChange={e => setFormData({...formData, price: e.target.value})} required />
                                    <input type="number" placeholder="Stock" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} onChange={e => setFormData({...formData, stock: e.target.value})} required />
                                    <textarea placeholder="Description" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', gridColumn: '1 / -1' }} onChange={e => setFormData({...formData, description: e.target.value})} required />
                                </>
                            )}
                            {activeTab === 'employees' && (
                                <>
                                    <input placeholder="Full Name" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} onChange={e => setFormData({...formData, name: e.target.value})} required />
                                    <input type="email" placeholder="Email" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} onChange={e => setFormData({...formData, email: e.target.value})} required />
                                    <input placeholder="Position" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} onChange={e => setFormData({...formData, position: e.target.value})} required />
                                    <input placeholder="Branch Name" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} onChange={e => setFormData({...formData, branch: e.target.value})} required />
                                    <input type="number" placeholder="Salary" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} onChange={e => setFormData({...formData, salary: e.target.value})} required />
                                </>
                            )}
                            {activeTab === 'branches' && (
                                <>
                                    <input placeholder="Branch Name" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} onChange={e => setFormData({...formData, name: e.target.value})} required />
                                    <input placeholder="Location" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} onChange={e => setFormData({...formData, location: e.target.value})} required />
                                    <input placeholder="Contact Number" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} onChange={e => setFormData({...formData, contact: e.target.value})} required />
                                </>
                            )}
                            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" className="btn-primary">Save Details</button>
                                <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow)', border: '1px solid #e2e8f0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <tr>
                                <th style={{ padding: '1.5rem' }}>Details</th>
                                <th style={{ padding: '1.5rem' }}>Info / Role</th>
                                <th style={{ padding: '1.5rem' }}>Status / Metric</th>
                                <th style={{ padding: '1.5rem' }}>Quick Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" style={{ padding: '4rem', textAlign: 'center' }}>
                                    <Clock className="animate-spin" style={{ margin: '0 auto' }} />
                                    <p style={{ marginTop: '1rem', color: 'var(--secondary)' }}>Loading data...</p>
                                </td></tr>
                            ) : data.length === 0 ? (
                                <tr><td colSpan="4" style={{ padding: '4rem', textAlign: 'center', color: 'var(--secondary)' }}>No records found in this section.</td></tr>
                            ) : data.map((item) => (
                                <tr key={item._id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                    <td style={{ padding: '1.2rem 1.5rem' }}>
                                        <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{item.name || item.vehicle?.name || item.vehicleName || item.user?.name || 'N/A'}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>ID: {item._id.substring(0, 10)}</div>
                                        {activeTab === 'bookings' && item.assignedEmployee && (
                                            <div style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.3rem' }}>
                                                <UserPlus size={14} /> Assigned to: {item.assignedEmployee.name}
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ padding: '1.2rem 1.5rem' }}>
                                        {activeTab === 'employees' ? (
                                            <div>
                                                <div>{item.position}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>{item.branch}</div>
                                            </div>
                                        ) : activeTab === 'bookings' ? (
                                            <div>
                                                <div>{item.user?.email}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>${item.vehicle?.price?.toLocaleString()}</div>
                                            </div>
                                        ) : item.type || item.location || 'N/A'}
                                    </td>
                                    <td style={{ padding: '1.2rem 1.5rem' }}>
                                        {(activeTab === 'bookings' || activeTab === 'repairs') ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                <span style={{ 
                                                    padding: '0.3rem 0.8rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 700, textAlign: 'center',
                                                    background: item.status === 'Approved' || item.status === 'Completed' ? '#dcfce7' : item.status === 'Pending' ? '#fef3c7' : '#e0f2fe',
                                                    color: item.status === 'Approved' || item.status === 'Completed' ? '#166534' : item.status === 'Pending' ? '#92400e' : '#0369a1'
                                                }}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        ) : activeTab === 'employees' ? `$${item.salary?.toLocaleString()}` : activeTab === 'vehicles' ? `${item.stock} in stock` : item.contact}
                                    </td>
                                    <td style={{ padding: '1.2rem 1.5rem' }}>
                                        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                                            {activeTab === 'bookings' && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        {item.status === 'Pending' && (
                                                            <button onClick={() => updateStatus(item._id, 'Approved', 'booking')} style={{ padding: '0.5rem', background: '#dcfce7', color: '#166534', borderRadius: '8px' }} title="Approve">
                                                                <CheckCircle size={18} />
                                                            </button>
                                                        )}
                                                        {item.status === 'Approved' && (
                                                            <button onClick={() => updateStatus(item._id, 'Delivered', 'booking')} style={{ padding: '0.5rem', background: '#e0f2fe', color: '#0369a1', borderRadius: '8px' }} title="Mark Delivered">
                                                                <Truck size={18} />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <select 
                                                        style={{ fontSize: '0.8rem', padding: '0.3rem', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                                                        value={item.assignedEmployee?._id || ''}
                                                        onChange={(e) => assignEmployee(item._id, e.target.value)}
                                                    >
                                                        <option value="">Assign Employee</option>
                                                        {employees.map(emp => (
                                                            <option key={emp._id} value={emp._id}>{emp.name} ({emp.position})</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                            {activeTab === 'repairs' && item.status === 'In Progress' && (
                                                <button onClick={() => updateStatus(item._id, 'Completed', 'repair')} style={{ padding: '0.5rem', background: '#dcfce7', color: '#166534', borderRadius: '8px' }} title="Mark Completed">
                                                    <CheckCircle size={18} />
                                                </button>
                                            )}
                                            <button onClick={() => handleDelete(item._id)} style={{ padding: '0.5rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', height: 'fit-content' }} title="Delete">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminPanel;
