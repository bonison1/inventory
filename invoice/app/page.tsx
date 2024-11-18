import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InvoicePage from './invoice/page';
import InvoiceConfirmationPage from '../app/invoice-confirmation/page';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InvoicePage />} />
        <Route path="/invoice-confirmation" element={<InvoiceConfirmationPage />} />
      </Routes>
    </Router>
  );
};

export default App;
