import { Resend } from "resend";
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";
import { getSampleOrderShippingAddress } from "@/lib/address-helper";

// Lazily initialize SMTP transporter
const getTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  });
};

// Lazily initialize Resend to avoid throwing errors during compilation/build when key is missing
const getResend = () => {
  return new Resend(process.env.RESEND_API_KEY || "re_mockkey_for_build");
};

/**
 * Sends a notification email to operations@chirantea.in whenever a sample or bulk order is successfully placed.
 * Prevents duplicate emails by checking the EmailLog database table first.
 */
export async function sendOrderNotificationEmail(orderId: string, type: "sample" | "bulk") {
  try {
    // 1. Fetch order details depending on type
    let order: any = null;
    let emailType: "sample_confirmation" | "bulk_confirmation";
    let orderNumber = "";

    if (type === "sample") {
      emailType = "sample_confirmation";
      order = await prisma.sampleOrder.findUnique({
        where: { id: orderId },
        include: {
          product: { select: { name: true } },
          variant: { select: { size: true, unit: true } },
        },
      });
      if (order) {
        orderNumber = order.order_number;
      }
    } else {
      emailType = "bulk_confirmation";
      order = await prisma.bulkOrder.findUnique({
        where: { id: orderId },
        include: {
          user: { select: { full_name: true, email: true, phone: true, company_name: true } },
          address: true,
          items: true,
        },
      });
      if (order) {
        orderNumber = order.order_number;
      }
    }

    if (!order) {
      console.error(`[EmailService] Order not found for ID: ${orderId} (type: ${type})`);
      return;
    }

    // 2. Check if email has already been sent to prevent duplicates
    const existingLog = await prisma.emailLog.findFirst({
      where: {
        order_id: orderNumber,
        email_type: emailType,
        status: "sent",
      },
    });

    if (existingLog) {
      console.log(`[EmailService] Notification already sent for order ${orderNumber}. Skipping.`);
      return;
    }

    // 3. Build HTML Email Content
    let htmlContent = "";
    const fromEmail = process.env.RESEND_FROM_EMAIL || "orders@chirantea.in";
    const toEmail = process.env.NOTIFICATION_EMAIL || "orders@chirantea.in";
    const amount = type === "sample" ? Number(order.amount) : Number(order.total_amount);

    if (type === "sample") {
      const addr = getSampleOrderShippingAddress(order);
      htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; rounded: 12px;">
          <h2 style="color: #D04636; margin-bottom: 5px;">New Sample Order Placed</h2>
          <p style="color: #71717a; font-size: 14px; margin-top: 0;">Order Number: <strong>${order.order_number}</strong></p>
          
          <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 20px 0;" />
          
          <h3 style="color: #4e3d33;">Customer Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 4px 0; color: #71717a; width: 120px;">Name:</td>
              <td style="padding: 4px 0; color: #18181b;"><strong>${order.customer_name}</strong></td>
            </tr>
            ${order.business_name ? `
            <tr>
              <td style="padding: 4px 0; color: #71717a;">Business Name:</td>
              <td style="padding: 4px 0; color: #18181b;">${order.business_name}</td>
            </tr>` : ""}
            <tr>
              <td style="padding: 4px 0; color: #71717a;">Email:</td>
              <td style="padding: 4px 0; color: #18181b;"><a href="mailto:${order.email}" style="color: #D04636;">${order.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #71717a;">Phone:</td>
              <td style="padding: 4px 0; color: #18181b;">${order.phone}</td>
            </tr>
          </table>

          <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 20px 0;" />

          <h3 style="color: #4e3d33;">Shipping Address</h3>
          <p style="font-size: 14px; color: #18181b; line-height: 1.5; margin: 0;">
            ${addr.address_line1}<br />
            ${addr.address_line2 ? `${addr.address_line2}<br />` : ""}
            ${addr.landmark ? `Landmark: ${addr.landmark}<br />` : ""}
            ${addr.delivery_city}, ${addr.delivery_state} - ${addr.pincode}<br />
            ${addr.country}
          </p>

          <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 20px 0;" />

          <h3 style="color: #4e3d33;">Order Item</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <thead style="background-color: #f4f4f5; text-align: left;">
              <tr>
                <th style="padding: 8px;">Product</th>
                <th style="padding: 8px;">Size</th>
                <th style="padding: 8px; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e4e4e7;">${order.product?.name || "Matcha Sample"}</td>
                <td style="padding: 8px; border-bottom: 1px solid #e4e4e7;">${order.variant?.size} ${order.variant?.unit}</td>
                <td style="padding: 8px; border-bottom: 1px solid #e4e4e7; text-align: right;">₹${amount}</td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 8px; text-align: right; font-weight: bold;">Total:</td>
                <td style="padding: 8px; text-align: right; font-weight: bold; color: #D04636;">₹${amount}</td>
              </tr>
            </tbody>
          </table>

          ${order.notes ? `
          <div style="background-color: #fef08a; padding: 12px; border-radius: 8px; margin-top: 20px; font-size: 14px;">
            <strong>Customer Note:</strong> ${order.notes}
          </div>` : ""}
        </div>
      `;
    } else {
      const addr = order.address;
      const itemsHtml = order.items.map((item: any) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e4e4e7;">${item.product_name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e4e4e7;">${item.variant_size}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e4e4e7; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e4e4e7; text-align: right;">₹${Number(item.unit_price)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e4e4e7; text-align: right;">₹${Number(item.total_price)}</td>
        </tr>
      `).join("");

      htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; rounded: 12px;">
          <h2 style="color: #D04636; margin-bottom: 5px;">New Bulk Order Placed</h2>
          <p style="color: #71717a; font-size: 14px; margin-top: 0;">Order Number: <strong>${order.order_number}</strong></p>
          
          <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 20px 0;" />
          
          <h3 style="color: #4e3d33;">Customer Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 4px 0; color: #71717a; width: 120px;">Name:</td>
              <td style="padding: 4px 0; color: #18181b;"><strong>${order.user?.full_name || "N/A"}</strong></td>
            </tr>
            ${order.user?.company_name ? `
            <tr>
              <td style="padding: 4px 0; color: #71717a;">Company:</td>
              <td style="padding: 4px 0; color: #18181b;">${order.user.company_name}</td>
            </tr>` : ""}
            <tr>
              <td style="padding: 4px 0; color: #71717a;">Email:</td>
              <td style="padding: 4px 0; color: #18181b;"><a href="mailto:${order.user?.email}" style="color: #D04636;">${order.user?.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #71717a;">Phone:</td>
              <td style="padding: 4px 0; color: #18181b;">${order.user?.phone || "N/A"}</td>
            </tr>
          </table>

          <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 20px 0;" />

          <h3 style="color: #4e3d33;">Shipping Address</h3>
          <p style="font-size: 14px; color: #18181b; line-height: 1.5; margin: 0;">
            <strong>${addr?.full_name}</strong><br />
            ${addr?.address_line1}<br />
            ${addr?.address_line2 ? `${addr.address_line2}<br />` : ""}
            ${addr?.city}, ${addr?.state} - ${addr?.pincode}<br />
            Phone: ${addr?.phone}
          </p>

          <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 20px 0;" />

          <h3 style="color: #4e3d33;">Order Items</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <thead style="background-color: #f4f4f5; text-align: left;">
              <tr>
                <th style="padding: 8px;">Product</th>
                <th style="padding: 8px;">Size</th>
                <th style="padding: 8px; text-align: center;">Qty</th>
                <th style="padding: 8px; text-align: right;">Unit Price</th>
                <th style="padding: 8px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              <tr>
                <td colspan="4" style="padding: 8px; text-align: right; font-weight: bold;">Subtotal:</td>
                <td style="padding: 8px; text-align: right; font-weight: bold;">₹${Number(order.subtotal)}</td>
              </tr>
              <tr>
                <td colspan="4" style="padding: 8px; text-align: right; font-weight: bold;">GST (CGST+SGST):</td>
                <td style="padding: 8px; text-align: right; font-weight: bold;">₹${Number(order.cgst_amount) + Number(order.sgst_amount)}</td>
              </tr>
              <tr>
                <td colspan="4" style="padding: 8px; text-align: right; font-weight: bold;">Total Amount:</td>
                <td style="padding: 8px; text-align: right; font-weight: bold; color: #D04636; font-size: 16px;">₹${amount}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }

    // 4. Send Email via SMTP if configured, otherwise fallback to Resend
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = getTransporter();
        await transporter.sendMail({
          from: `"Hamada Orders" <${process.env.SMTP_USER}>`,
          to: toEmail,
          subject: `New ${type === "sample" ? "Sample" : "Bulk"} Order Placed - ${orderNumber}`,
          html: htmlContent,
        });

        console.log(`[EmailService] Email notification successfully sent via SMTP to ${toEmail} for order ${orderNumber}`);
        await prisma.emailLog.create({
          data: {
            recipient_email: toEmail,
            email_type: emailType,
            order_id: orderNumber,
            status: "sent",
          },
        });
        return;
      } catch (smtpError) {
        console.error(`[EmailService] Failed to send email via SMTP to ${toEmail}:`, smtpError);
        await prisma.emailLog.create({
          data: {
            recipient_email: toEmail,
            email_type: emailType,
            order_id: orderNumber,
            status: "failed",
          },
        });
        return;
      }
    }

    if (!process.env.RESEND_API_KEY) {
      console.warn("[EmailService] RESEND_API_KEY is not defined. Logging email body to console.");
      console.log(`To: ${toEmail}\nFrom: ${fromEmail}\nSubject: New Order - ${orderNumber}\nHTML: ${htmlContent}`);
      
      // Save EmailLog with "failed" status since we could not physically send it
      await prisma.emailLog.create({
        data: {
          recipient_email: toEmail,
          email_type: emailType,
          order_id: orderNumber,
          status: "failed",
        },
      });
      return;
    }

    const { data: resData, error } = await getResend().emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `New ${type === "sample" ? "Sample" : "Bulk"} Order Placed - ${orderNumber}`,
      html: htmlContent,
    });

    if (error) {
      console.error(`[EmailService] Failed to send email via Resend to ${toEmail}:`, error);
      await prisma.emailLog.create({
        data: {
          recipient_email: toEmail,
          email_type: emailType,
          order_id: orderNumber,
          status: "failed",
        },
      });
    } else {
      console.log(`[EmailService] Email notification successfully sent via Resend to ${toEmail} for order ${orderNumber}. Message ID: ${resData?.id}`);
      await prisma.emailLog.create({
        data: {
          recipient_email: toEmail,
          email_type: emailType,
          order_id: orderNumber,
          status: "sent",
        },
      });
    }
  } catch (err) {
    console.error("[EmailService] Exception while processing order notification email:", err);
  }
}
