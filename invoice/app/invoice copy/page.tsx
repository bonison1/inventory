'use client';

import { useState } from "react";

// Define the Item type
interface Item {
  sl: string;  // SL should be a string
  description: string;
  mrp: number;
  discount: number;
  rateAfterDiscount: number;
  qty: number;
  finalRate: number;
}

const InvoicePage = () => {
  // State for Company Information
  const [company, setCompany] = useState({
    name: "",
    address: "",
    contact: "",
  });

  // State for Customer Information
  const [customer, setCustomer] = useState({
    name: "",
    address: "",
    contact: "",
    panGst: "",
  });

  // Initialize items state with a correct type annotation
  const [items, setItems] = useState<Item[]>([]); // Explicitly declare items as Item[] (an array of Item objects)

  // State for Footer Totals
  const [footer, setFooter] = useState({
    totalBeforeTax: 0,
    cgst: 0,
    igst: 0,
    totalAfterTax: 0,
  });

  // Handle changes in Company Section
  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompany({ ...company, [name]: value });
  };

  // Handle changes in Customer Section
  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  // Handle changes in Item Section
  const handleItemChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: keyof Item
  ) => {
    const value = e.target.value;

    // Make a copy of the items array to modify
    const updatedItems = [...items];

    // Ensure correct typing for fields that are numbers (mrp, discount, qty)
    if (field === "mrp" || field === "discount" || field === "qty") {
      updatedItems[index][field] = parseFloat(value) || 0;  // Convert to number, default to 0 if invalid
    } else if (field === "sl" || field === "description") {
      updatedItems[index][field] = value;  // For string fields like 'description'
    }

    // Recalculate rate after discount and final rate
    if (field === "mrp" || field === "discount" || field === "qty") {
      const mrp = updatedItems[index].mrp;
      const discount = updatedItems[index].discount;
      const qty = updatedItems[index].qty;

      updatedItems[index].rateAfterDiscount = mrp - (mrp * (discount / 100));
      updatedItems[index].finalRate = updatedItems[index].rateAfterDiscount * qty;
    }

    setItems(updatedItems);
    recalculateFooter(updatedItems);
  };

  // Add a new item
  const addItem = () => {
    const newItem: Item = {
      sl: (items.length + 1).toString(),  // Automatically assign SL as a string
      description: "",
      mrp: 0,
      discount: 0,
      rateAfterDiscount: 0,
      qty: 0,
      finalRate: 0,
    };
    setItems([...items, newItem]);
  };

  // Remove an item
  const removeItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    recalculateFooter(updatedItems);
  };

  // Recalculate the footer values (total before tax, CGST, IGST, total after tax)
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

  return (
    <div style={{ padding: "20px" }}>
      <h1>Invoice Form</h1>

      {/* Company Section */}
      <section>
        <h2>Company</h2>
        <div>
          <label>Company Name:</label>
          <input
            type="text"
            name="name"
            value={company.name}
            onChange={handleCompanyChange}
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={company.address}
            onChange={handleCompanyChange}
          />
        </div>
        <div>
          <label>Contact:</label>
          <input
            type="text"
            name="contact"
            value={company.contact}
            onChange={handleCompanyChange}
          />
        </div>
      </section>

      {/* Customer Section */}
      <section>
        <h2>Customer</h2>
        <div>
          <label>Customer Name:</label>
          <input
            type="text"
            name="name"
            value={customer.name}
            onChange={handleCustomerChange}
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={customer.address}
            onChange={handleCustomerChange}
          />
        </div>
        <div>
          <label>Contact:</label>
          <input
            type="text"
            name="contact"
            value={customer.contact}
            onChange={handleCustomerChange}
          />
        </div>
        <div>
          <label>PAN/GST:</label>
          <input
            type="text"
            name="panGst"
            value={customer.panGst}
            onChange={handleCustomerChange}
          />
        </div>
      </section>

      {/* Item Section */}
      <section>
        <h2>Items</h2>
        {items.map((item, index) => (
          <div key={index} style={{ marginBottom: "15px" }}>
            <div>
              <label>SL:</label>
              <input
                type="text"
                value={item.sl}
                readOnly
              />
            </div>
            <div>
              <label>Description:</label>
              <input
                type="text"
                value={item.description}
                onChange={(e) => handleItemChange(e, index, "description")}
              />
            </div>
            <div>
              <label>MRP:</label>
              <input
                type="number"
                value={item.mrp}
                onChange={(e) => handleItemChange(e, index, "mrp")}
              />
            </div>
            <div>
              <label>Discount (%):</label>
              <input
                type="number"
                value={item.discount}
                onChange={(e) => handleItemChange(e, index, "discount")}
              />
            </div>
            <div>
              <label>Rate After Discount:</label>
              <input
                type="number"
                value={item.rateAfterDiscount}
                readOnly
              />
            </div>
            <div>
              <label>Quantity:</label>
              <input
                type="number"
                value={item.qty}
                onChange={(e) => handleItemChange(e, index, "qty")}
              />
            </div>
            <div>
              <label>Final Rate:</label>
              <input
                type="number"
                value={item.finalRate}
                readOnly
              />
            </div>
            <button onClick={() => removeItem(index)}>Remove Item</button>
          </div>
        ))}
        <button onClick={addItem}>Add Item</button>
      </section>

      {/* Footer Section */}
      <section>
        <h2>Footer</h2>
        <div>
          <label>Total Amount Before Tax:</label>
          <input type="number" value={footer.totalBeforeTax} readOnly />
        </div>
        <div>
          <label>CGST (9%):</label>
          <input type="number" value={footer.cgst} readOnly />
        </div>
        <div>
          <label>IGST (9%):</label>
          <input type="number" value={footer.igst} readOnly />
        </div>
        <div>
          <label>Total Amount After Tax:</label>
          <input type="number" value={footer.totalAfterTax} readOnly />
        </div>
      </section>
    </div>
  );
};

export default InvoicePage;
