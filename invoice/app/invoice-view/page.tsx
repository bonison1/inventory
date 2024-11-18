// pages/invoice-view/page.tsx

'use client'; // Add this directive at the top

import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import styles from '../../app/invoice-view/InvoiceViewPage.module.css'; // Import the CSS module

interface Invoice {
  id: number;
  client: string;
  amount: number;
  status: string;
  created_at: string;
}

const InvoiceViewPage = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('invoices') // Table name
          .select('*'); // Fetch all columns
        if (error) throw error;
        setInvoices(data as Invoice[]); // Explicitly cast data to Invoice[]
      } catch (err: any) {
        setError(err.message || 'Error fetching invoices');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Invoices</h1>
      {invoices.length === 0 ? (
        <p className={styles.noInvoices}>No invoices found.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.id}</td>
                <td>{invoice.client}</td>
                <td>{invoice.amount}</td>
                <td>{invoice.status}</td>
                <td>{new Date(invoice.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InvoiceViewPage;
