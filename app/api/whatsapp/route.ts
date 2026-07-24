import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, date, time, doctor, tokenNumber, phone, receiptUrl } = await request.json();

    const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
    const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
      console.warn("WhatsApp API credentials missing. Skipping WhatsApp notification.");
      return NextResponse.json({ success: false, message: "WhatsApp API credentials not configured." });
    }

    if (!phone) {
      return NextResponse.json({ success: false, message: "No phone number provided." });
    }

    // WhatsApp Cloud API request payload using Template
    const payload = {
      messaging_product: "whatsapp",
      to: phone,
      type: "template",
      template: {
        name: "appointment_confirmation",
        language: {
          code: "en_US"
        },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: name || "Patient" },
              { type: "text", text: date || "Scheduled Date" },
              { type: "text", text: time || "Please check receipt" },
              { type: "text", text: doctor || "General Consultation" },
              { type: "text", text: tokenNumber ? tokenNumber.toString() : "N/A" },
              { type: "text", text: receiptUrl || "N/A" }
            ]
          }
        ]
      }
    };

    const response = await fetch(`https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("WhatsApp API Error:", data);
      return NextResponse.json(
        { success: false, message: "Failed to send WhatsApp message", error: data },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "WhatsApp message sent successfully!", data });
  } catch (error) {
    console.error("WhatsApp Route Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
