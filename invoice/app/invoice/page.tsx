'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../lib/supabaseClient';  // Import Supabase client
import styles from '../styles/InvoicePage.module.css';

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

const InvoicePage = () => {
  const [company, setCompany] = useState({
    name: '',
    address: '',
    contact: '',
  });

  const [customer, setCustomer] = useState({
    name: '',
    address: '',
    contact: '',
    panGst: '',
  });

  const [items, setItems] = useState<Item[]>([]);
  const [footer, setFooter] = useState({
    totalBeforeTax: 0,
    cgst: 0,
    igst: 0,
    totalAfterTax: 0,
  });

  const router = useRouter();

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompany({ ...company, [name]: value });
  };

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  const handleItemChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: keyof Item
  ) => {
    const value = e.target.value;
    const updatedItems = [...items];

    if (field === 'mrp' || field === 'discount' || field === 'qty') {
      updatedItems[index][field] = parseFloat(value) || 0;
    } else if (field === 'sl' || field === 'description') {
      updatedItems[index][field] = value;
    }

    if (field === 'mrp' || field === 'discount' || field === 'qty') {
      const mrp = updatedItems[index].mrp;
      const discount = updatedItems[index].discount;
      const qty = updatedItems[index].qty;

      updatedItems[index].rateAfterDiscount = mrp - mrp * (discount / 100);
      updatedItems[index].finalRate = updatedItems[index].rateAfterDiscount * qty;
    }

    setItems(updatedItems);
    recalculateFooter(updatedItems);
  };

  const addItem = () => {
    const newItem: Item = {
      sl: (items.length + 1).toString(),
      description: '',
      mrp: 0,
      discount: 0,
      rateAfterDiscount: 0,
      qty: 0,
      finalRate: 0,
    };
    setItems([...items, newItem]);
  };

  const recalculateFooter = (updatedItems: Item[]) => {
    const totalBeforeTax = updatedItems.reduce(
      (acc, item) => acc + item.mrp * item.qty,
      0
    );
    const totalAfterTax = updatedItems.reduce(
      (acc, item) => acc + item.finalRate,
      0
    );

    const cgst = totalAfterTax * 0.09;  // 9% CGST
    const igst = totalAfterTax * 0.09;  // 9% IGST

    setFooter({
      totalBeforeTax,
      cgst,
      igst,
      totalAfterTax: totalAfterTax + cgst + igst,
    });
  };

  const handleSubmit = async () => {
    const { data, error } = await supabase
      .from('invoices')
      .insert([
        {
          company,
          customer,
          items,
          footer,
        },
      ])
      .select();

    if (error) {
      console.error('Error inserting data:', error);
      alert('Failed to submit invoice');
      return;
    }

    if (data && data.length > 0) {
      router.push(`/invoice-confirmation?id=${data[0].id}`);
    } else {
      alert('Failed to save the invoice. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Invoice Form</h1>

      <section>
        <h2>Company Information</h2>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={company.name}
          onChange={handleCompanyChange}
        />
        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={company.address}
          onChange={handleCompanyChange}
        />
        <label>Contact:</label>
        <input
          type="text"
          name="contact"
          value={company.contact}
          onChange={handleCompanyChange}
        />
      </section>

      <section>
        <h2>Customer Information</h2>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={customer.name}
          onChange={handleCustomerChange}
        />
        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={customer.address}
          onChange={handleCustomerChange}
        />
        <label>Contact:</label>
        <input
          type="text"
          name="contact"
          value={customer.contact}
          onChange={handleCustomerChange}
        />
        <label>PAN/GST:</label>
        <input
          type="text"
          name="panGst"
          value={customer.panGst}
          onChange={handleCustomerChange}
        />
      </section>

      <section>
        <h2>Items</h2>
        {items.map((item, index) => (
          <div key={index}>
            <label>SL:</label>
            <input type="text" value={item.sl} readOnly />
            <label>Description:</label>
            <input
              type="text"
              value={item.description}
              onChange={(e) => handleItemChange(e, index, 'description')}
            />
            <label>MRP:</label>
            <input
              type="number"
              value={item.mrp}
              onChange={(e) => handleItemChange(e, index, 'mrp')}
            />
            <label>Discount (%):</label>
            <input
              type="number"
              value={item.discount}
              onChange={(e) => handleItemChange(e, index, 'discount')}
            />
            <label>Rate After Discount:</label>
            <input type="number" value={item.rateAfterDiscount} readOnly />
            <label>Quantity:</label>
            <input
              type="number"
              value={item.qty}
              onChange={(e) => handleItemChange(e, index, 'qty')}
            />
            <label>Final Rate:</label>
            <input type="number" value={item.finalRate} readOnly />
          </div>
        ))}
        <button onClick={addItem}>Add Item</button>
      </section>

      <section>
        <h2>Footer Information</h2>
        <label>Total Before Tax:</label>
        <input type="number" value={footer.totalBeforeTax} readOnly />
        <label>CGST (9%):</label>
        <input type="number" value={footer.cgst} readOnly />
        <label>IGST (9%):</label>
        <input type="number" value={footer.igst} readOnly />
        <label>Total After Tax:</label>
        <input type="number" value={footer.totalAfterTax} readOnly />
      </section>

      <button onClick={handleSubmit}>Submit Invoice</button>
    </div>
  );
};

export default InvoicePage;
