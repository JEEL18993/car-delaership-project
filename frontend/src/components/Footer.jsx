import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-container">
        <div>
          <div className="footer-brand">
            🚘 Auto<span>Drive</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6 }}>
            India’s trusted automotive marketplace. Discover quality verified vehicles, compare prices, and purchase your next dream car with confidence.
          </p>
        </div>

        <div>
          <h4 className="footer-title">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home Marketplace</Link></li>
            <li><Link to="/browse">Browse Cars</Link></li>
            <li><Link to="/login">Login Account</Link></li>
            <li><Link to="/register">Register Free</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-title">Popular Brands</h4>
          <ul className="footer-links">
            <li><Link to="/browse?make=Toyota">Toyota</Link></li>
            <li><Link to="/browse?make=Honda">Honda</Link></li>
            <li><Link to="/browse?make=Hyundai">Hyundai</Link></li>
            <li><Link to="/browse?make=BMW">BMW</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-title">Contact & Support</h4>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
            📍 100 AutoDrive Plaza, Motor City
          </p>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
            📞 +1 (800) 555-AUTO
          </p>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
            ✉️ support@autodrive.com
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} AutoDrive Dealership Inventory System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
