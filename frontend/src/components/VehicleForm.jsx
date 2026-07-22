import React, { useState, useEffect } from 'react';

const VehicleForm = ({ isOpen, onClose, onSubmit, initialData = null, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    category: 'Sedan',
    price: '',
    quantity: 1,
    image: '',
    description: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        make: initialData.make || '',
        model: initialData.model || '',
        year: initialData.year || new Date().getFullYear(),
        category: initialData.category || 'Sedan',
        price: initialData.price || '',
        quantity: initialData.quantity !== undefined ? initialData.quantity : 1,
        image: initialData.image || '',
        description: initialData.description || ''
      });
    } else {
      setFormData({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        category: 'Sedan',
        price: '',
        quantity: 1,
        image: '',
        description: ''
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.make.trim() || !formData.model.trim()) {
      setError('Make and Model are required.');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setError('Price must be greater than 0.');
      return;
    }
    if (formData.quantity === '' || Number(formData.quantity) < 0) {
      setError('Quantity cannot be negative.');
      return;
    }

    onSubmit({
      ...formData,
      year: Number(formData.year),
      price: Number(formData.price),
      quantity: Number(formData.quantity)
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3 className="modal-title">{initialData ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="form-make">Make *</label>
              <input
                id="form-make"
                name="make"
                type="text"
                className="form-control"
                required
                value={formData.make}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="form-model">Model *</label>
              <input
                id="form-model"
                name="model"
                type="text"
                className="form-control"
                required
                value={formData.model}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="form-year">Year</label>
              <input
                id="form-year"
                name="year"
                type="number"
                className="form-control"
                value={formData.year}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="form-category">Category *</label>
              <select
                id="form-category"
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Truck">Truck</option>
                <option value="Electric">Electric</option>
                <option value="Coupe">Coupe</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="form-price">Price ($) *</label>
              <input
                id="form-price"
                name="price"
                type="number"
                className="form-control"
                required
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="form-quantity">Initial Stock Quantity *</label>
              <input
                id="form-quantity"
                name="quantity"
                type="number"
                className="form-control"
                required
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="form-image">Image URL</label>
            <input
              id="form-image"
              name="image"
              type="url"
              className="form-control"
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="form-description">Description</label>
            <textarea
              id="form-description"
              name="description"
              className="form-control"
              rows="3"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? 'Saving...' : initialData ? 'Update Vehicle' : 'Create Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleForm;
