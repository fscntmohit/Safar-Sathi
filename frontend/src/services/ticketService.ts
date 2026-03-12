// Ticket generation and email service
export interface TicketData {
  bookingReference: string;
  destination: string;
  date: string;
  travelers: number;
  total: number;
  userEmail: string;
  userName: string;
  guide?: {
    name: string;
    phone: string;
    email: string;
  };
  accommodation?: {
    name: string;
    location: string;
    type: string;
  };
  event?: {
    name: string;
    date: string;
    time: string;
    location: string;
  };
  marketplace?: {
    name: string;
    location: string;
    specialties: string[];
  };
}

export const generateTicketHTML = (ticketData: TicketData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Jharkhand Tourism - Booking Confirmation</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .ticket { background: white; border-radius: 10px; padding: 30px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { text-align: center; border-bottom: 3px solid #2d5a3d; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #2d5a3d; margin-bottom: 10px; }
            .booking-ref { background: #2d5a3d; color: white; padding: 10px; border-radius: 5px; font-size: 18px; font-weight: bold; margin: 20px 0; }
            .section { margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 5px; }
            .section h3 { color: #2d5a3d; margin-top: 0; }
            .info-row { display: flex; justify-content: space-between; margin: 10px 0; }
            .info-label { font-weight: bold; color: #555; }
            .info-value { color: #333; }
            .qr-placeholder { text-align: center; padding: 20px; background: #e9e9e9; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
            .highlight { background: #fff3cd; padding: 10px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 15px 0; }
        </style>
    </head>
    <body>
        <div class="ticket">
            <div class="header">
                <div class="logo">🏔️ Incredible Jharkhand</div>
                <h1>Booking Confirmation</h1>
                <div class="booking-ref">Reference: ${ticketData.bookingReference}</div>
            </div>

            <div class="section">
                <h3>📍 Destination Details</h3>
                <div class="info-row">
                    <span class="info-label">Destination:</span>
                    <span class="info-value">${ticketData.destination}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Date:</span>
                    <span class="info-value">${new Date(ticketData.date).toLocaleDateString('en-IN')}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Travelers:</span>
                    <span class="info-value">${ticketData.travelers} ${ticketData.travelers === 1 ? 'Person' : 'People'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Total Amount:</span>
                    <span class="info-value">₹${ticketData.total.toLocaleString()}</span>
                </div>
            </div>

            ${ticketData.guide ? `
            <div class="section">
                <h3>👨‍🏫 Guide Information</h3>
                <div class="info-row">
                    <span class="info-label">Name:</span>
                    <span class="info-value">${ticketData.guide.name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Phone:</span>
                    <span class="info-value">${ticketData.guide.phone}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span class="info-value">${ticketData.guide.email}</span>
                </div>
            </div>
            ` : ''}

            ${ticketData.accommodation ? `
            <div class="section">
                <h3>🏨 Accommodation</h3>
                <div class="info-row">
                    <span class="info-label">Name:</span>
                    <span class="info-value">${ticketData.accommodation.name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Location:</span>
                    <span class="info-value">${ticketData.accommodation.location}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Type:</span>
                    <span class="info-value">${ticketData.accommodation.type}</span>
                </div>
            </div>
            ` : ''}

            ${ticketData.event ? `
            <div class="section">
                <h3>🎉 Event Details</h3>
                <div class="info-row">
                    <span class="info-label">Event:</span>
                    <span class="info-value">${ticketData.event.name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Date:</span>
                    <span class="info-value">${new Date(ticketData.event.date).toLocaleDateString('en-IN')}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Time:</span>
                    <span class="info-value">${ticketData.event.time}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Location:</span>
                    <span class="info-value">${ticketData.event.location}</span>
                </div>
            </div>
            ` : ''}

            ${ticketData.marketplace ? `
            <div class="section">
                <h3>🛍️ Marketplace Visit</h3>
                <div class="info-row">
                    <span class="info-label">Market:</span>
                    <span class="info-value">${ticketData.marketplace.name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Location:</span>
                    <span class="info-value">${ticketData.marketplace.location}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Specialties:</span>
                    <span class="info-value">${ticketData.marketplace.specialties.join(', ')}</span>
                </div>
            </div>
            ` : ''}

            <div class="qr-placeholder">
                <h3>📱 QR Code</h3>
                <p>Present this QR code at the destination for verification</p>
                <div style="background: #000; color: white; padding: 20px; border-radius: 5px; font-family: monospace; letter-spacing: 2px;">
                    ${ticketData.bookingReference}
                </div>
            </div>

            <div class="highlight">
                <strong>Important:</strong> Please arrive 15 minutes before your scheduled time. 
                Keep this confirmation email handy for verification.
            </div>

            <div class="footer">
                <p>Thank you for choosing Incredible Jharkhand!</p>
                <p>For any queries, contact us at: +91 98765 43210</p>
                <p>Email: support@jharkhandtourism.com</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

export const sendTicketEmail = async (ticketData: TicketData): Promise<boolean> => {
  try {
    // In a real application, you would integrate with an email service like SendGrid, AWS SES, etc.
    // For now, we'll simulate the email sending
    
    const emailContent = generateTicketHTML(ticketData);
    
    // Simulate email sending
    console.log('Sending ticket email to:', ticketData.userEmail);
    console.log('Email content length:', emailContent.length);
    
    // In production, you would:
    // 1. Use an email service API
    // 2. Send the HTML content as email body
    // 3. Attach QR code as image
    // 4. Handle email delivery status
    
    return true;
  } catch (error) {
    console.error('Failed to send ticket email:', error);
    return false;
  }
};


