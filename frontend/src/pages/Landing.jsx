import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import VehicleCard from '../components/VehicleCard';
import { ShieldCheck, Truck, Wrench, CalendarCheck } from 'lucide-react';

const Landing = () => {
    const [featured, setFeatured] = useState([]);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const { data } = await API.get('/vehicles');
                setFeatured(data.slice(0, 3));
            } catch (err) {
                console.error(err);
            }
        };
        fetchVehicles();
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Find Your Dream Vehicle</h1>
                    <p>Experience excellence with our curated collection of high-performance cars and bikes.</p>
                    <Link to="/vehicles" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.2rem' }}>
                        Explore Vehicles
                    </Link>
                </div>
            </section>

            {/* Featured Vehicles */}
            <section style={{ padding: '4rem 0' }}>
                <h2 className="section-title">Featured Vehicles</h2>
                <div className="grid">
                    {featured.length > 0 ? (
                        featured.map(v => <VehicleCard key={v._id} vehicle={v} />)
                    ) : (
                        <p style={{ textAlign: 'center', gridColumn: '1/-1' }}>No vehicles available right now.</p>
                    )}
                </div>
            </section>

            {/* Services Section */}
            <section style={{ background: '#f1f5f9', padding: '5rem 5%' }}>
                <h2 className="section-title" style={{ marginTop: 0 }}>Our Premium Services</h2>
                <div className="grid">
                    <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '16px', boxShadow: 'var(--shadow)' }}>
                        <CalendarCheck size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                        <h3>Instant Booking</h3>
                        <p style={{ color: 'var(--secondary)' }}>Book your favorite ride in just a few clicks with our seamless system.</p>
                    </div>
                    <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '16px', boxShadow: 'var(--shadow)' }}>
                        <Wrench size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                        <h3>Expert Repair</h3>
                        <p style={{ color: 'var(--secondary)' }}>Keep your machine in top shape with our certified maintenance experts.</p>
                    </div>
                    <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '16px', boxShadow: 'var(--shadow)' }}>
                        <Truck size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                        <h3>Home Delivery</h3>
                        <p style={{ color: 'var(--secondary)' }}>We bring your new vehicle right to your doorstep, safely and securely.</p>
                    </div>
                </div>
            </section>

            {/* About / Testimonials */}
            <section style={{ padding: '6rem 5%', display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ flex: '1 1 400px' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Why Choose Us?</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <ShieldCheck color="var(--success)" size={32} />
                            <div>
                                <h4>Trusted Quality</h4>
                                <p style={{ color: 'var(--secondary)' }}>Every vehicle undergoes a 150-point inspection before listing.</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <ShieldCheck color="var(--success)" size={32} />
                            <div>
                                <h4>Flexible Financing</h4>
                                <p style={{ color: 'var(--secondary)' }}>Low-interest rates and quick approval processes for everyone.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ flex: '1 1 400px', background: 'var(--primary)', color: 'white', padding: '3rem', borderRadius: '24px' }}>
                    <p style={{ fontSize: '1.5rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                        "The best vehicle buying experience I've ever had. Professional staff and beautiful showroom!"
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img src="https://i.pravatar.cc/150?u=1" alt="user" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                        <div>
                            <h5 style={{ margin: 0 }}>John Doe</h5>
                            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Luxury Car Owner</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
