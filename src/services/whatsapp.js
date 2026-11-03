// PRINTORA WhatsApp Notification Service
// Business Number: +91 8106992102
// Support for Method 1: Click-to-chat formatted message
// Support for Method 2: Official Meta WhatsApp Business Cloud API notification

export const BUSINESS_WHATSAPP_NUMBER = "918106992102"; // formatted with country code without + for wa.me

/**
 * Format a luxury, highly structured WhatsApp order message
 */
export function formatWhatsAppOrderMessage(order) {
  const line = "──────────────────────────";
  const itemsText = order.items.map((item, idx) => {
    let details = `▪ *${item.name}* (x${item.quantity}) — ₹${item.price * item.quantity}`;
    const specs = [];
    if (item.selectedSize) specs.push(`Size: ${item.selectedSize}`);
    if (item.selectedColor) specs.push(`Color: ${item.selectedColor}`);
    if (specs.length > 0) details += `\n   ${specs.join(' | ')}`;
    
    // Customization info
    if (item.customName) details += `\n   Custom Name: *${item.customName}*`;
    if (item.customNumber) details += `\n   Jersey Number: *#${item.customNumber}*`;
    if (item.customNotes) details += `\n   Notes: ${item.customNotes}`;
    if (item.artworkFile) details += `\n   Logo Attached: Yes (See order record)`;
    return details;
  }).join("\n\n");

  const message = `✨ *NEW ORDER — PRINTORA* ✨
*Brand:* PRINTORA • MAKE IT YOURS.
*Order ID:* ${order.orderCode}
${line}

👤 *CUSTOMER DETAILS:*
• *Name:* ${order.customerName}
• *Phone:* ${order.customerPhone}
${order.customerEmail ? `• *Email:* ${order.customerEmail}\n` : ''}
📍 *DELIVERY ADDRESS:*
${order.shippingHouse}, ${order.shippingArea}
${order.shippingCity}, ${order.shippingState} - ${order.shippingPincode}
Country: India

📦 *ORDER ITEMS:*
${itemsText}

${line}
💰 *PAYMENT & BILLING SUMMARY:*
• Subtotal: ₹${order.subtotal}
${order.discount > 0 ? `• Discount: -₹${order.discount}\n` : ''}• Shipping Charge: ${order.shippingCharge === 0 ? 'FREE' : `₹${order.shippingCharge}`}
• *FINAL ORDER TOTAL: ₹${order.totalAmount}*
${line}
${order.specialInstructions ? `📝 *SPECIAL INSTRUCTIONS:*\n"${order.specialInstructions}"\n${line}\n` : ''}
💬 *Next Steps:*
Please reply with order confirmation and payment QR code/UPI link to initiate printing production. Thank you for choosing PRINTORA!`;

  return message;
}

/**
 * Generate click-to-chat URL for Method 1
 */
export function generateWhatsAppUrl(order) {
  const message = formatWhatsAppOrderMessage(order);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encoded}`;
}

/**
 * Generate WhatsApp message for Bulk Enquiries
 */
export function formatBulkEnquiryMessage(enquiry) {
  const line = "──────────────────────────";
  return `🏢 *NEW BULK / CORPORATE ENQUIRY — PRINTORA*
*Brand:* PRINTORA • MAKE IT YOURS.
${line}

👤 *CONTACT DETAILS:*
• *Name:* ${enquiry.fullName}
• *Organization / College:* ${enquiry.organization}
• *Phone:* ${enquiry.phone}
• *Email:* ${enquiry.email}

📋 *REQUIREMENTS:*
• *Category:* ${enquiry.category}
• *Estimated Quantity:* ${enquiry.quantity} Units
• *Required Delivery Date:* ${enquiry.targetDate || 'Flexible / Urgent'}
• *Customization Details:*
${enquiry.details}

${line}
Please review and reply with our bulk pricing quotation.`;
}

export function generateBulkWhatsAppUrl(enquiry) {
  const message = formatBulkEnquiryMessage(enquiry);
  return `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Method 2: WhatsApp Cloud API Integration
 * Sends a background business notification if token and phone ID are configured in Store Settings.
 * Note: Requires Meta Business verification and a pre-approved template in production.
 */
export async function sendWhatsAppCloudApiNotification(order, settings) {
  const token = settings?.whatsapp_cloud_api_token || import.meta.env.VITE_WHATSAPP_CLOUD_API_TOKEN;
  const phoneNumberId = settings?.whatsapp_phone_number_id || import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    return {
      success: false,
      method: "click-to-chat fallback",
      reason: "Meta Cloud API credentials not configured in Admin Settings. Using Method 1 (Direct WhatsApp Click-to-chat)."
    };
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: BUSINESS_WHATSAPP_NUMBER,
        type: "text",
        text: {
          preview_url: false,
          body: formatWhatsAppOrderMessage(order)
        }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error?.message || "WhatsApp Cloud API request failed");
    }

    return {
      success: true,
      data,
      method: "cloud-api"
    };
  } catch (err) {
    console.warn("WhatsApp Cloud API notification failed:", err.message);
    return {
      success: false,
      reason: err.message,
      method: "fallback"
    };
  }
}
