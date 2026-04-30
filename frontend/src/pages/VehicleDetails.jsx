import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Calendar, Shield, Loader2 } from 'lucide-react';

const VehicleDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const { data } = await API.get(`/vehicles/${id}`);
                setVehicle(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchVehicle();
    }, [id]);

    const handleBooking = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setBookingLoading(true);
        try {
            await API.post('/bookings', {
                vehicleId: vehicle._id,
                paymentAmount: vehicle.price
            });
            setBookingSuccess(true);
        } catch (err) {
            alert(err.response?.data?.message || 'Booking failed');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>Loading details...</div>;
    if (!vehicle) return <div style={{ padding: '5rem', textAlign: 'center' }}>Vehicle not found.</div>;

    if (bookingSuccess) {
        return (
            <div style={{ padding: '5rem 5%', textAlign: 'center' }}>
                <div style={{ background: 'white', padding: '4rem', borderRadius: '24px', boxShadow: 'var(--shadow-lg)', maxWidth: '600px', margin: '0 auto' }}>
                    <div style={{ background: 'var(--success)', color: 'white', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                        <Shield size={40} />
                    </div>
                    <h2 style={{ marginBottom: '1rem' }}>Booking Confirmed!</h2>
                    <p style={{ color: 'var(--secondary)', marginBottom: '2rem' }}>
                        Congratulations! Your booking for <strong>{vehicle.name}</strong> has been successfully placed and payment was simulated.
                    </p>
                    <button onClick={() => navigate('/vehicles')} className="btn-primary">Browse More Vehicles</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '4rem 5%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem', alignItems: 'start' }}>
                <div>
                    <img src={vehicle.image} alt={vehicle.name} style={{ width: '100%', borderRadius: '24px', boxShadow: 'var(--shadow-lg)' }} />
                </div>
                <div>
                    <span className={`badge badge-${vehicle.type.toLowerCase()}`} style={{ fontSize: '1rem', padding: '0.5rem 1.2rem' }}>{vehicle.type}</span>
                    <h1 style={{ fontSize: '3rem', margin: '1rem 0' }}>{vehicle.name}</h1>
                    <p className="vehicle-price" style={{ fontSize: '2rem' }}>${vehicle.price.toLocaleString()}</p>
                    <p style={{ color: 'var(--secondary)', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '2.5rem' }}>
                        {vehicle.description}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Calendar color="var(--primary)" />
                            <div>
                                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--secondary)' }}>Timeline</span>
                                <strong>Instant</strong>
                            </div>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Shield color="var(--success)" />
                            <div>
                                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--secondary)' }}>Warranty</span>
                                <strong>2 Years</strong>
                            </div>
                        </div>
                    </div>

                    <div style={{ background: 'white', padding: '2rem', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <CreditCard /> Payment Summary
                        </h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span>Vehicle Price</span>
                            <strong>${vehicle.price.toLocaleString()}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <span>Processing Fee</span>
                            <strong>$0</strong>
                        </div>
                        <hr style={{ marginBottom: '1.5rem', border: '0.5px solid #e2e8f0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.25rem' }}>
                            <strong>Total Amount</strong>
                            <strong color="var(--primary)">${vehicle.price.toLocaleString()}</strong>
                        </div>

                        <button
                            onClick={handleBooking}
                            disabled={bookingLoading || vehicle.stock <= 0}
                            className="btn-primary"
                            style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', background: vehicle.stock <= 0 ? 'var(--secondary)' : 'var(--primary)' }}
                        >
                            {bookingLoading ? <Loader2 className="animate-spin" /> : (vehicle.stock > 0 ? 'Proceed to Book' : 'Sold Out')}
                        </button>
                        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--secondary)', marginTop: '1rem' }}>
                            * This is a simulated checkout process using Debit Card.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetails;
