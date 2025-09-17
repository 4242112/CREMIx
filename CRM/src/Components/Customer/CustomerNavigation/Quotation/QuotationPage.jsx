import React from 'react';
import CustomerQuotation from '../../../CustomerDashboard/CustomerQuotation';

const QuotationPage = ({ customer }) => {
  if (!customer) return null;

  return (
    <CustomerQuotation 
      customerId={customer.id} 
      customerEmail={customer.email} 
    />
  );
};

export default QuotationPage;