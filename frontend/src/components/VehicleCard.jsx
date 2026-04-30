import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag } from 'lucide-react';

const VehicleCard = ({ vehicle }) => {
    return (
        <div className="vehicle-card" data-aos="fade-up">
            <img src={vehicle.image} alt={vehicle.name} className="vehicle-image" />
            <div className="vehicle-info">
                <span className={`badge badge-${vehicle.type.toLowerCase()}`}>{vehicle.type}</span>
                <h3>{vehicle.name}</h3>
                <p className="vehicle-price">${vehicle.price.toLocaleString()}</p>
                <p style={{ color: 'var(--secondary)', fontSize: '0.9rem', marginBottom: '1.2rem' }}>
                    {vehicle.description.substring(0, 80)}...
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: vehicle.stock > 0 ? 'var(--success)' : 'var(--danger)' }}>
                        {vehicle.stock > 0 ? `${vehicle.stock} in stock` : 'Out of Stock'}
                    </span>
                    <Link to={`/vehicles/${vehicle._id}`} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Details <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default VehicleCard;
