import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not set");
}

if (!process.env.CONTACT_EMAIL) {
  throw new Error("CONTACT_EMAIL is not set");
}

const resend = new Resend(process.env.RESEND_API_KEY);
const contactEmail = process.env.CONTACT_EMAIL;
const siteName = process.env.SITE_NAME || "Ecommerce Store";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  subject?: string;
}

export interface OrderNotificationData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress: string;
  totalPrice: number;
  products: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  comment?: string;
}

/**
 * Send email notification for contact form submission
 */
export async function sendContactFormEmail(data: ContactFormData) {
  try {
    const { error } = await resend.emails.send({
      from: `Contact Form <noreply@${getDomainFromEmail(contactEmail)}>`,
      to: [contactEmail],
      replyTo: data.email,
      subject: data.subject || `New Contact Form Submission from ${data.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        ${data.subject ? `<p><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>
        <hr>
        <p><small>This email was sent from the contact form on ${siteName}</small></p>
      `,
      text: `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
${data.subject ? `Subject: ${data.subject}\n` : ""}
Message:
${data.message}

---
This email was sent from the contact form on ${siteName}
      `,
    });

    if (error) {
      console.error("Error sending contact form email:", error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to send contact form email:", error);
    throw error;
  }
}

/**
 * Send email notification when a new order is created
 */
export async function sendNewOrderNotification(data: OrderNotificationData) {
  try {
    const productsList = data.products
      .map(
        (product) =>
          `  • ${escapeHtml(product.name)} - ${product.quantity}x $${product.price.toFixed(2)} = $${(product.price * product.quantity).toFixed(2)}`
      )
      .join("\n");

    const productsListHtml = data.products
      .map(
        (product) =>
          `<li>${escapeHtml(product.name)} - ${product.quantity}x $${product.price.toFixed(2)} = $${(product.price * product.quantity).toFixed(2)}</li>`
      )
      .join("");

    const { error } = await resend.emails.send({
      from: `New Order <noreply@${getDomainFromEmail(contactEmail)}>`,
      to: [contactEmail],
      replyTo: data.customerEmail,
      subject: `New Order #${data.orderId.substring(0, 8)} - ${siteName}`,
      html: `
        <h2>New Order Received</h2>
        <p><strong>Order ID:</strong> ${escapeHtml(data.orderId)}</p>
        <p><strong>Total Price:</strong> $${data.totalPrice.toFixed(2)}</p>
        
        <h3>Customer Information</h3>
        <p><strong>Name:</strong> ${escapeHtml(data.customerName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.customerEmail)}</p>
        ${data.customerPhone ? `<p><strong>Phone:</strong> ${escapeHtml(data.customerPhone)}</p>` : ""}
        <p><strong>Address:</strong> ${escapeHtml(data.customerAddress).replace(/\n/g, "<br>")}</p>
        
        <h3>Order Items</h3>
        <ul>
          ${productsListHtml}
        </ul>
        
        ${data.comment ? `<h3>Customer Comment</h3><p>${escapeHtml(data.comment).replace(/\n/g, "<br>")}</p>` : ""}
        
        <hr>
        <p><small>This email was sent automatically when a new order was placed on ${siteName}</small></p>
        <p><small>View order: ${siteUrl}/admin/orders/${data.orderId}</small></p>
      `,
      text: `
New Order Received

Order ID: ${data.orderId}
Total Price: $${data.totalPrice.toFixed(2)}

Customer Information:
Name: ${data.customerName}
Email: ${data.customerEmail}
${data.customerPhone ? `Phone: ${data.customerPhone}\n` : ""}
Address: ${data.customerAddress}

Order Items:
${productsList}

${data.comment ? `Customer Comment:\n${data.comment}\n` : ""}

---
This email was sent automatically when a new order was placed on ${siteName}
View order: ${siteUrl}/admin/orders/${data.orderId}
      `,
    });

    if (error) {
      console.error("Error sending new order notification email:", error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to send new order notification email:", error);
    throw error;
  }
}

/**
 * Helper function to extract domain from email address
 */
function getDomainFromEmail(email: string): string {
  const domain = email.split("@")[1];
  if (!domain) {
    return "resend.dev"; // fallback domain
  }
  // For Resend, you need to use a verified domain or resend.dev
  // If you have a custom domain, use it here, otherwise use resend.dev
  return domain.includes(".") ? domain : "resend.dev";
}

/**
 * Helper function to escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
