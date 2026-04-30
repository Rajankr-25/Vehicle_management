import React from 'react';
import { Car, Mail, Phone, MessageSquare, Share2, Globe } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{ background: 'var(--dark)', color: 'white', padding: '4rem 5% 2rem', marginTop: '4rem' }}>
            <div className="grid" style={{ padding: 0, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <div>
                    <div className="nav-logo" style={{ color: 'white', marginBottom: '1.5rem' }}>
                        <Car size={32} />
                        <span>AutoVibe</span>
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                        Bringing you the finest selection of luxury and performance vehicles since 2010. Your dream ride starts here.
                    </p>
                </div>
                <div>
                    <h4 style={{ marginBottom: '1.5rem' }}>Quick Links</h4>
                    <ul style={{ listStyle: 'none', color: '#94a3b8', fontSize: '0.9rem' }}>
                        <li style={{ marginBottom: '0.5rem' }}>Home</li>
                        <li style={{ marginBottom: '0.5rem' }}>Vehicles</li>
                        <li style={{ marginBottom: '0.5rem' }}>About Us</li>
                        <li style={{ marginBottom: '0.5rem' }}>Contact</li>
                    </ul>
                </div>
                <div>
                    <h4 style={{ marginBottom: '1.5rem' }}>Contact Us</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                        <Mail size={18} /> info@autovibe.com
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}>
                        <Phone size={18} /> +1 234 567 890
                    </div>
                </div>
                <div>
                    <h4 style={{ marginBottom: '1.5rem' }}>Social Media</h4>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <MessageSquare size={24} style={{ cursor: 'pointer' }} />
                        <Share2 size={24} style={{ cursor: 'pointer' }} />
                        <Globe size={24} style={{ cursor: 'pointer' }} />
                    </div>
                </div>
            </div>
            <hr style={{ border: '0.5px solid #1e293b', margin: '2rem 0' }} />
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.8rem' }}>
                © 2026 AutoVibe Showroom Management. All rights reserved.
            </p>
        </footer>
    );
};

export default Footer;
