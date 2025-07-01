import React from 'react';

interface VendorProps {
  VendorItems: any[];
}

const Vendor: React.FC<VendorProps> = ({ VendorItems }) => {
  return (
    <div className="vendor-list">
      {VendorItems.map((vendor) => (
        <div key={vendor.id} className="vendor-item">
          <h3>{vendor.title || vendor.name || 'Vendor'}</h3>
          {/* Add more vendor details as needed */}
        </div>
      ))}
    </div>
  );
};

export default Vendor;