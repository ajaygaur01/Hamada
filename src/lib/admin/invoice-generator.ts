import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Helper to convert images to base64 synchronously or asynchronously for jsPDF
const loadImg = (url: string): Promise<string> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve("");
      return;
    }
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch {
        resolve("");
      }
    };
    img.onerror = () => {
      resolve("");
    };
    img.src = url;
  });
};

// Helper to convert numbers to Indian Rupee Words
function numberToWords(num: number): string {
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function numToWordsLessThanThousand(n: number): string {
    if (n === 0) return "";
    let str = "";
    if (n >= 100) {
      str += a[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 20) {
      str += b[Math.floor(n / 10)] + " ";
      n %= 10;
    }
    if (n > 0) {
      str += a[n] + " ";
    }
    return str.trim();
  }

  if (num === 0) return "Zero";

  const parts = num.toFixed(2).split(".");
  const integerPart = parseInt(parts[0], 10);
  const decimalPart = parseInt(parts[1], 10);

  let words = "";
  let n = integerPart;

  if (n >= 10000000) {
    words += numToWordsLessThanThousand(Math.floor(n / 10000000)) + " Crore ";
    n %= 10000000;
  }
  if (n >= 100000) {
    words += numToWordsLessThanThousand(Math.floor(n / 100000)) + " Lakh ";
    n %= 100000;
  }
  if (n >= 1000) {
    words += numToWordsLessThanThousand(Math.floor(n / 1000)) + " Thousand ";
    n %= 1000;
  }
  if (n > 0) {
    words += numToWordsLessThanThousand(n) + " ";
  }

  words = words.trim() + " Rupees";

  if (decimalPart > 0) {
    words += " and " + numToWordsLessThanThousand(decimalPart) + " Paise";
  }

  return words + " Only";
}

export const generateOrderInvoice = async (order: any) => {
  // 1. Create jsPDF document instance
  const doc = new jsPDF() as any;

  // 2. Draw Top Left Logo Container
  doc.setDrawColor(208, 70, 54); // Red
  doc.setLineWidth(0.6);
  doc.line(14, 15, 60, 15);
  doc.line(14, 32, 60, 32);

  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.setTextColor(24, 24, 27); // Zinc 900
  doc.text("H A M A D A", 16, 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(113, 113, 122); // Zinc 500
  doc.text("GLOBAL TRADING", 16, 27);

  // 3. Draw Top Right Seller Details (Haryana Address)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(39, 39, 42); // Zinc 800
  doc.text("B1, HOUSE NO 2 P", 196, 15, { align: "right" });
  doc.text("SECTOR 31", 196, 20, { align: "right" });
  doc.text("Gurugram 122001", 196, 25, { align: "right" });
  doc.text("Haryana HR", 196, 30, { align: "right" });
  doc.text("India", 196, 35, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.text("GSTIN: 06AAGCH4681R1ZV", 196, 41, { align: "right" });

  // 4. Draw Middle Left Customer Details
  const buyerName = order.user?.companyName || order.businessName || order.customerName || order.user?.fullName || "Walk-in Customer";
  const address1 = order.address?.addressLine1 || order.addressLine1 || "";
  const address2 = order.address?.addressLine2 || order.addressLine2 || "";
  const city = order.address?.city || order.deliveryCity || "";
  const state = order.address?.state || order.deliveryState || "";
  const pincode = order.address?.pincode || order.pincode || "";
  const country = order.address?.country || order.country || "India";
  const buyerGstin = order.user?.gstin || "";

  let buyerY = 52;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(24, 24, 27);
  doc.text(buyerName, 14, buyerY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(63, 63, 70); // Zinc 700
  buyerY += 5;

  if (address1) {
    doc.text(address1, 14, buyerY);
    buyerY += 4.5;
  }
  if (address2) {
    doc.text(address2, 14, buyerY);
    buyerY += 4.5;
  }
  doc.text(`${city} ${pincode}`, 14, buyerY);
  buyerY += 4.5;
  doc.text(`${state} ${country}`, 14, buyerY);
  buyerY += 4.5;

  if (buyerGstin) {
    doc.setFont("helvetica", "bold");
    doc.text(`GSTIN: ${buyerGstin}`, 14, buyerY);
    doc.setFont("helvetica", "normal");
    buyerY += 4.5;
  }
  doc.text(`Place of supply: ${state || "Haryana"}`, 14, buyerY);

  // 5. Draw Tax Invoice Title (Red)
  const isBulk = order.items && order.items.length > 0;
  const isLocal = (state || "").toLowerCase().includes("haryana");
  
  const rawOrderNumber = order.orderNumber || "00000";
  const cleanOrderNumber = rawOrderNumber.replace(/\D/g, "");
  const suffix = cleanOrderNumber.padStart(4, "0").slice(-4) || "0000";
  const invoiceNo = order.invoiceNumber || `INV/26-27/${suffix}`;
  
  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.setTextColor(208, 70, 54); // Red
  doc.text(`Tax Invoice ${invoiceNo}`, 14, 90);

  // 6. Draw Metadata Row
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(113, 113, 122);
  doc.text("Invoice Date", 14, 98);
  doc.text("Due Date", 55, 98);
  doc.text("Source", 95, 98);
  doc.text("Reference", 135, 98);

  const formattedDate = new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(24, 24, 27);
  doc.text(formattedDate, 14, 103);
  doc.text(formattedDate, 55, 103);
  doc.text(order.orderNumber, 95, 103);
  doc.text(order.orderNumber, 135, 103);

  // 7. Generate Items Table
  const tableColumn = ["Description", "HSN/SAC", "Quantity", "Unit Price", "Taxes", "Amount"];
  const tableRows: any[] = [];

  if (isBulk) {
    order.items.forEach((item: any) => {
      const qty = Number(item.quantity);
      const price = Number(item.unitPrice || item.unit_price || 0);
      const total = Number(item.totalPrice || item.total_price || (qty * price));
      const hsn = item.hsnCode || item.hsn_code || "09021020";
      const rate = Number(item.gstRate || item.gst_rate || 5);
      
      const taxString = isLocal
        ? `CGST ${(rate / 2).toFixed(1)}%, SGST ${(rate / 2).toFixed(1)}%`
        : `IGST ${rate.toFixed(1)}%`;
        
      tableRows.push([
        item.productName || item.product_name,
        hsn,
        `${qty.toFixed(2)} Units`,
        `Rs. ${price.toFixed(2)}`,
        taxString,
        `Rs. ${total.toFixed(2)}`
      ]);
    });
  } else {
    // Sample order
    const qty = 1;
    const price = Number(order.variantPrice || order.amount || 250);
    const total = price;
    const hsn = "09021020";
    const rate = 5;
    const taxString = isLocal
      ? "CGST 2.5%, SGST 2.5%"
      : "IGST 5.0%";

    tableRows.push([
      `[SAMPLE] ${order.productName || "Matcha Sample"} (${order.variantSize || "Sample Size"})`,
      hsn,
      "1.00 Units",
      `Rs. ${price.toFixed(2)}`,
      taxString,
      `Rs. ${total.toFixed(2)}`
    ]);
  }

  autoTable(doc, {
    startY: 110,
    head: [tableColumn],
    body: tableRows,
    theme: "plain",
    headStyles: {
      textColor: [208, 70, 54], // Red headers
      fontStyle: "bold",
      lineColor: [208, 70, 54],
      lineWidth: 0.2,
      cellPadding: 4,
    },
    bodyStyles: {
      textColor: [39, 39, 42],
      fontSize: 8.5,
      cellPadding: 4,
    },
    columnStyles: {
      0: { cellWidth: 70 }, // Description
      1: { cellWidth: 25 }, // HSN/SAC
      2: { cellWidth: 20, halign: "center" }, // Quantity
      3: { cellWidth: 25, halign: "right" }, // Unit Price
      4: { cellWidth: 25, halign: "center" }, // Taxes
      5: { cellWidth: 25, halign: "right" }, // Amount
    },
    margin: { left: 14, right: 14 }
  });

  // 8. Calculations for Totals Block
  const finalY = doc.lastAutoTable.finalY + 8;
  const totalAmount = Number(order.totalAmount || order.amount || 0);
  let untaxedAmount = Number(order.subtotal || 0);
  let cgst = Number(order.cgstAmount || 0);
  let sgst = Number(order.sgstAmount || 0);
  let igst = Number(order.igstAmount || 0);

  if (!untaxedAmount) {
    // If not supplied, back-calculate tax assuming standard 5% tax rate
    const rate = 5;
    untaxedAmount = totalAmount / (1 + rate / 100);
    const taxAmount = totalAmount - untaxedAmount;
    if (isLocal) {
      cgst = taxAmount / 2;
      sgst = taxAmount / 2;
      igst = 0;
    } else {
      cgst = 0;
      sgst = 0;
      igst = taxAmount;
    }
  }

  // 9. Render Totals Block on the Right Side
  let totalsY = finalY;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(113, 113, 122);
  doc.text("Untaxed Amount", 110, totalsY);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(24, 24, 27);
  doc.text(`Rs. ${untaxedAmount.toFixed(2)}`, 196, totalsY, { align: "right" });
  totalsY += 5.5;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(113, 113, 122);
  if (igst > 0) {
    doc.text("IGST", 110, totalsY);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(24, 24, 27);
    doc.text(`Rs. ${igst.toFixed(2)}`, 196, totalsY, { align: "right" });
    totalsY += 5.5;
  } else {
    doc.text("CGST", 110, totalsY);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(24, 24, 27);
    doc.text(`Rs. ${cgst.toFixed(2)}`, 196, totalsY, { align: "right" });
    totalsY += 5.5;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(113, 113, 122);
    doc.text("SGST", 110, totalsY);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(24, 24, 27);
    doc.text(`Rs. ${sgst.toFixed(2)}`, 196, totalsY, { align: "right" });
    totalsY += 5.5;
  }

  // Draw border line above the absolute total
  doc.setDrawColor(208, 70, 54);
  doc.setLineWidth(0.4);
  doc.line(110, totalsY - 2, 196, totalsY - 2);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(208, 70, 54);
  doc.text("Total", 110, totalsY);
  doc.text(`Rs. ${totalAmount.toFixed(2)}`, 196, totalsY, { align: "right" });
  totalsY += 9;

  // Render total in words (aligned right)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(113, 113, 122);
  doc.text("Total amount in words:", 196, totalsY, { align: "right" });
  totalsY += 4;
  doc.setFont("helvetica", "italic");
  doc.setTextColor(63, 63, 70);
  const words = numberToWords(totalAmount);
  const wrappedWords = doc.splitTextToSize(words, 85);
  doc.text(wrappedWords, 196, totalsY, { align: "right" });

  // 10. Render Payment Details & QRs on the Left Side
  let paymentY = finalY;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(113, 113, 122);
  doc.text("Payment Communication:", 14, paymentY);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(24, 24, 27);
  doc.text(invoiceNo, 52, paymentY);

  paymentY += 5;

  // Generate UPI pay link and call free QR Server APIs
  const upiUrl = `upi://pay?pa=chiran0822@okhdfcbank&pn=Hamada%20Global%20Trading&tr=${invoiceNo}&am=${totalAmount.toFixed(2)}&cu=INR`;
  const qr1Url = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiUrl)}`;
  const qr2Url = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent("https://www.hamadaglobaltrading.com/")}`;

  try {
    const [qr1Img, qr2Img] = await Promise.all([
      loadImg(qr1Url),
      loadImg(qr2Url)
    ]);

    if (qr1Img) {
      doc.addImage(qr1Img, "PNG", 14, paymentY, 20, 20);
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(24, 24, 27);
    doc.text("PAYMENT QR CODE", 38, paymentY + 4);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(113, 113, 122);
    doc.text("UPI ID: chiran0822@okhdfcbank", 38, paymentY + 8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(208, 70, 54);
    doc.text("PhonePe | GPay | Paytm | UPI", 38, paymentY + 13);

    paymentY += 23;

    if (qr2Img) {
      doc.addImage(qr2Img, "PNG", 14, paymentY, 20, 20);
    }
    doc.setFont("helvetica", "bold");
    doc.setTextColor(24, 24, 27);
    doc.text("PAY IN A FLASH!", 38, paymentY + 4);
    doc.setFont("helvetica", "normal");
    doc.text("Scan the QR code", 38, paymentY + 8);
    doc.text("or click to pay online", 38, paymentY + 12);

    paymentY += 23;
  } catch (err) {
    console.error("Failed to append QR codes to PDF", err);
    paymentY += 25;
  }

  // 11. Authorized Signatory (right-aligned line)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(113, 113, 122);
  doc.line(130, totalsY + 28, 196, totalsY + 28);
  doc.text("Authorized signatory", 196, totalsY + 32, { align: "right" });

  // 12. Terms & Conditions (bottom-left)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(113, 113, 122);
  doc.text("Terms & Conditions: ", 14, totalsY + 30);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(208, 70, 54);
  doc.text("https://hamada-global-trading.odoo.com/terms", 43, totalsY + 30);

  // 13. Page border line & footer contact details
  doc.setDrawColor(228, 228, 231);
  doc.setLineWidth(0.4);
  doc.line(14, 280, 196, 280);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(113, 113, 122);
  doc.text("+919354262542 | shuhei@chirantea.in | 06AAGCH4681R1ZV https://www.hamadaglobaltrading.com/      Page 1 / 1", 105, 285, { align: "center" });

  // 14. Save PDF in browser
  doc.save(`Invoice_${invoiceNo.replace(/\//g, "-")}.pdf`);
};
