import jsPDF from "jspdf";
import "jspdf-autotable";
import { getSampleOrderShippingAddress } from "@/lib/address-helper";

export const generateOrderInvoice = (order: any) => {
  const doc = new jsPDF() as any;

  // Header
  doc.setFontSize(22);
  doc.setTextColor(78, 61, 51); // Brand Dark Brown
  doc.text("HAMADA", 14, 22);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Premium Japanese Matcha & Green Tea", 14, 28);
  doc.text("Support: support@kaori.com | +91 98765 43210", 14, 33);

  // Invoice Title
  doc.setFontSize(20);
  doc.setTextColor(208, 70, 54); // Brand Red
  doc.text("INVOICE", 140, 22);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Invoice #: ${order.order_number}`, 140, 28);
  doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 140, 33);

  // Billing Info
  doc.setFontSize(12);
  doc.setTextColor(78, 61, 51);
  doc.text("Bill To:", 14, 50);

  doc.setFontSize(10);
  doc.setTextColor(0);
  const customer = order.customer_name || order.user?.full_name;
  doc.text(customer, 14, 56);
  if (order.user?.company_name) doc.text(order.user.company_name, 14, 61);
  if (order.user?.gstin) doc.text(`GSTIN: ${order.user.gstin}`, 14, 66);

  // Shipping Address (for bulk)
  if (order.type === "bulk" && order.address) {
    doc.setFontSize(12);
    doc.setTextColor(78, 61, 51);
    doc.text("Ship To:", 100, 50);

    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(order.address.full_name, 100, 56);
    doc.text(order.address.address_line1, 100, 61);
    if (order.address.address_line2) doc.text(order.address.address_line2, 100, 66);
    doc.text(`${order.address.city}, ${order.address.state} - ${order.address.pincode}`, 100, 71);
  } else if (order.type === "sample") {
    doc.setFontSize(12);
    doc.setTextColor(78, 61, 51);
    doc.text("Ship To:", 100, 50);
    doc.setFontSize(10);
    doc.setTextColor(0);
    
    const addr = getSampleOrderShippingAddress(order);
    let y = 56;
    doc.text(order.customer_name || "N/A", 100, y);
    y += 5;
    if (addr.address_line1) {
      doc.text(addr.address_line1, 100, y);
      y += 5;
    }
    if (addr.address_line2) {
      doc.text(addr.address_line2, 100, y);
      y += 5;
    }
    if (addr.landmark) {
      doc.text(`Landmark: ${addr.landmark}`, 100, y);
      y += 5;
    }
    doc.text(`${addr.delivery_city}, ${addr.delivery_state || "N/A"} - ${addr.pincode}`, 100, y);
    y += 5;
    doc.text(addr.country || "India", 100, y);
  }

  // Items Table
  const tableColumn = ["Item", "Size", "Qty", "Unit Price", "Total"];
  const tableRows: any[] = [];

  if (order.type === "sample") {
    tableRows.push([
      order.product?.name || "Matcha Sample",
      `${order.variant?.size} ${order.variant?.unit}`,
      "1",
      `Rs. ${order.amount}`,
      `Rs. ${order.amount}`
    ]);
  } else {
    order.items.forEach((item: any) => {
      tableRows.push([
        item.product_name,
        item.variant_size,
        item.quantity,
        `Rs. ${item.unit_price}`,
        `Rs. ${item.total_price}`
      ]);
    });
  }

  doc.autoTable({
    startY: 85,
    head: [tableColumn],
    body: tableRows,
    headStyles: { fillColor: [78, 61, 51] },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    margin: { left: 14, right: 14 }
  });

  // Summary
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(10);
  doc.setTextColor(100);

  if (order.type === "bulk") {
    doc.text("Subtotal:", 140, finalY);
    doc.text(`Rs. ${order.subtotal}`, 175, finalY, { align: "right" });

    doc.text("Tax (GST):", 140, finalY + 5);
    doc.text(`Rs. ${Number(order.cgst_amount || 0) + Number(order.sgst_amount || 0) + Number(order.igst_amount || 0)}`, 175, finalY + 5, { align: "right" });
  }

  doc.setFontSize(14);
  doc.setTextColor(208, 70, 54);
  doc.text("Total Amount:", 140, finalY + 15);
  doc.text(`Rs. ${order.total_amount || order.amount}`, 175, finalY + 15, { align: "right" });

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text("This is a computer generated invoice. No signature required.", 14, 280);
  doc.text("Thank you for choosing Kaori by Chiran!", 14, 285);

  // Save
  doc.save(`Invoice_${order.order_number}.pdf`);
};
