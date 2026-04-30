import React, { useState, useEffect } from 'react';
import API from '../services/api';
import VehicleCard from '../components/VehicleCard';
import { Search, Filter } from 'lucide-react';

const Vehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [search, setSearch] = useState('');
    const [type, setType] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const { data } = await API.get('/vehicles');
                setVehicles(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchVehicles();
    }, []);

    const filteredVehicles = vehicles.filter(v => 
        v.name.toLowerCase().includes(search.toLowerCase()) && 
        (type === 'All' || v.type === type)
    );

    return (
        <div style={{ padding: '2rem 5%' }}>
            <h1 className="section-title">Explore Our Fleet</h1>
            
            {/* Filters */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3rem', background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: 'var(--shadow)' }}>
                <div style={{ flex: '1 1 300px', position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }} size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by vehicle name..." 
                        style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 3rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Filter size={20} color="var(--primary)" />
                    <select 
                        style={{ padding: '0.8rem', borderRadius: '12px', border: '1px solid #e2e8f0', minWidth: '150px' }}
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="All">All Types</option>
                        <option value="Car">Cars</option>
                        <option value="Bike">Bikes</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>Loading vehicles...</div>
            ) : (
                <div className="grid">
                    {filteredVehicles.length > 0 ? (
                        filteredVehicles.map(v => <VehicleCard key={v._id} vehicle={v} />)
                    ) : (
                        <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '4rem' }}>
                            <h3>No vehicles match your search.</h3>
                            <button onClick={() => {setSearch(''); setType('All');}} className="btn-outline" style={{ marginTop: '1rem' }}>Clear Filters</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Vehicles;
