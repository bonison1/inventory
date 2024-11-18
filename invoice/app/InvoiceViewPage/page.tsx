'use client';

import { useRouter, useSearchParams } from 'next/navigation'; // To read query params

const InvoiceViewPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invoiceData = searchParams.get('data');

  if (!invoiceData) {
    return <div>No invoice data found!</div>;
  }

  const { company, customer, items, footer } = JSON.parse(invoiceData);

  return (
    <div>
      <h1>Invoice View</h1>

      <h2>Company</h2>
      <p>{company.name}</p>
      <p>{company.address}</p>
      <p>{company.contact}</p>

      <h2>Customer</h2>
      <p>{customer.name}</p>
      <p>{customer.address}</p>
      <p>{customer.contact}</p>
      <p>{customer.panGst}</p>

      <h2>Items</h2>
      <ul>
        {items.map((item: any, index: number) => (
          <li key={index}>
            {item.description} - {item.mrp} - {item.qty} - {item.finalRate}
          </li>
        ))}
      </ul>

      <h2>Footer</h2>
      <p>Total Before Tax: {footer.totalBeforeTax}</p>
      <p>CGST: {footer.cgst}</p>
      <p>IGST: {footer.igst}</p>
      <p>Total After Tax: {footer.totalAfterTax}</p>
    </div>
  );
};

export default InvoiceViewPage;
