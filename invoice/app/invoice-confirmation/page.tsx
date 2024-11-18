'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import supabase from '../../lib/supabaseClient';
import styles from '../invoice-confirmation/InvoiceConfirmationPage.module.css';

interface Item {
  sl: string;
  description: string;
  mrp: number;
  discount: number;
  rateAfterDiscount: number;
  qty: number;
  finalRate: number;
}

interface Invoice {
  id: number;
  company: {
    name: string;
    address: string;
    contact: string;
  };
  customer: {
    name: string;
    address: string;
    contact: string;
    panGst: string;
  };
  items: Item[];
  footer: {
    totalBeforeTax: number;
    cgst: number;
    igst: number;
    totalAfterTax: number;
  };
}

const InvoiceConfirmationPage = () => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  useEffect(() => {
    if (!id) return;

    const fetchInvoice = async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching invoice:', error);
        alert('Failed to fetch invoice data.');
        return;
      }

      if (data) {
        setInvoice(data);
      }
    };

    fetchInvoice();
  }, [id]);

  if (!invoice) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <h1>Invoice Confirmation</h1>
      <h2>Invoice ID: {invoice.id}</h2>

      {/* Company Information */}
      <section>
        <h3>Company</h3>
        <p>Name: {invoice.company.name}</p>
        <p>Address: {invoice.company.address}</p>
        <p>Contact: {invoice.company.contact}</p>
      </section>

      {/* Customer Information */}
      <section>
        <h3>Customer</h3>
        <p>Name: {invoice.customer.name}</p>
        <p>Address: {invoice.customer.address}</p>
        <p>Contact: {invoice.customer.contact}</p>
        <p>PAN/GST: {invoice.customer.panGst}</p>
      </section>

      {/* Items Information */}
      <section>
        <h3>Items</h3>
        <table>
          <thead>
            <tr>
              <th>SL</th>
              <th>Description</th>
              <th>MRP</th>
              <th>Discount</th>
              <th>Rate After Discount</th>
              <th>Quantity</th>
              <th>Final Rate</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td>{item.sl}</td>
                <td>{item.description}</td>
                <td>{item.mrp}</td>
                <td>{item.discount}%</td>
                <td>{item.rateAfterDiscount}</td>
                <td>{item.qty}</td>
                <td>{item.finalRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Footer Information */}
      <section>
        <h3>Footer</h3>
        <p>Total Before Tax: {invoice.footer.totalBeforeTax}</p>
        <p>CGST (9%): {invoice.footer.cgst}</p>
        <p>IGST (9%): {invoice.footer.igst}</p>
        <p>Total After Tax: {invoice.footer.totalAfterTax}</p>
      </section>
    </div>
  );
};

export default InvoiceConfirmationPage;
