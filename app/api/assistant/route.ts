import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    const lowerMessage = message.toLowerCase();

    // 1. Emergency Detection (Highest Priority)
    const emergencyKeywords = [
      "chest pain", "difficulty breathing", "stroke", "heavy bleeding",
      "loss of consciousness", "severe accident", "heart attack", "can't breathe"
    ];
    
    if (emergencyKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return NextResponse.json({
        response: "🚨 **EMERGENCY ALERT** 🚨\n\nYour symptoms may indicate a medical emergency. Please contact emergency services (108/911) immediately or visit the nearest Emergency Department. Do not wait.",
        isEmergency: true
      });
    }

    // 2. Department Routing & Guidance
    if (lowerMessage.includes("skin") || lowerMessage.includes("allergy") || lowerMessage.includes("rash")) {
      return NextResponse.json({
        response: "Based on your symptoms, you should consult the **Dermatology** department. Our dermatologists specialize in treating skin allergies, rashes, and other skin conditions."
      });
    }

    if (lowerMessage.includes("bone") || lowerMessage.includes("joint") || lowerMessage.includes("fracture") || lowerMessage.includes("pain in leg") || lowerMessage.includes("knee")) {
      return NextResponse.json({
        response: "For bone, joint, or muscle issues, you should consult the **Orthopaedics** department."
      });
    }

    if (lowerMessage.includes("headache") || lowerMessage.includes("brain") || lowerMessage.includes("nerve")) {
      return NextResponse.json({
        response: "For chronic headaches or neurological issues, please consult our **Neurology** department."
      });
    }

    if (lowerMessage.includes("heart") || lowerMessage.includes("blood pressure problem")) {
      return NextResponse.json({
        response: "You should consult the **Cardiology** department. If you ever experience severe or sudden chest pain, please visit the Emergency Department immediately."
      });
    }

    // 3. Doctor Information
    if (lowerMessage.includes("doctor treats") || lowerMessage.includes("which doctor") || lowerMessage.includes("available doctor")) {
      return NextResponse.json({
        response: "We have several top specialists available:\n\n• **Dr. Smith** (Cardiology)\n• **Dr. Jones** (Neurology)\n• **Dr. Patel** (Orthopaedics)\n• **Dr. Kumar** (General Medicine)\n\nYou can book an appointment with them through our portal."
      });
    }

    // 4. Appointment Assistance
    if (lowerMessage.includes("book") || lowerMessage.includes("appointment") || lowerMessage.includes("schedule")) {
      return NextResponse.json({
        response: "To book an appointment, please follow these steps:\n1. Click on the 'Book Appointment' button on the homepage.\n2. Select whether you want an Online Consultation or a Walk-In Visit.\n3. Fill in your details and select your preferred doctor.\n4. You will receive a Token Number upon confirmation."
      });
    }

    if (lowerMessage.includes("token")) {
      return NextResponse.json({
        response: "Your **Token Number** is a unique ID generated when you book an appointment. It helps our reception and pharmacy easily track your queue status, consultation, and prescriptions."
      });
    }

    // 5. General Hospital Questions
    if (lowerMessage.includes("time") || lowerMessage.includes("timings") || lowerMessage.includes("open")) {
      return NextResponse.json({
        response: "HORIZON Super Speciality Hospital operates 24/7. Our Outpatient Departments (OPD) are open from 8:00 AM to 8:00 PM, while our Emergency, Laboratory, and Pharmacy services are available 24 hours a day."
      });
    }
    
    if (lowerMessage.includes("pharmacy") || lowerMessage.includes("laboratory") || lowerMessage.includes("billing")) {
      return NextResponse.json({
        response: "Our **Pharmacy and Laboratory** are located on the Ground Floor, near the main reception. The **Billing Department** is located right next to the main entrance for your convenience."
      });
    }

    if (lowerMessage.includes("contact") || lowerMessage.includes("address") || lowerMessage.includes("phone") || lowerMessage.includes("where is")) {
      return NextResponse.json({
        response: "**Contact Information:**\n📍 123, HealthCare Road, Banjara Hills, Hyderabad\n📞 Phone: +91 40 1234 5678\n📧 Email: info@hopehospital.com\n🚨 Emergency: +91 40 1234 9999"
      });
    }

    // 6. Medicine Questions (Strict Rules)
    if (lowerMessage.includes("medicine") || lowerMessage.includes("tablet") || lowerMessage.includes("syrup") || lowerMessage.includes("pill") || lowerMessage.includes("dose")) {
      return NextResponse.json({
        response: "I can provide general information, but I am not authorized to prescribe medicines or change prescriptions.\n\n*Disclaimer: This information is for educational purposes only. Please follow your doctor's prescription strictly.*"
      });
    }

    // 7. General Medical Education (Strict Rules)
    if (lowerMessage.includes("what is") || lowerMessage.includes("causes") || lowerMessage.includes("symptoms of")) {
      return NextResponse.json({
        response: "I can offer general health education on that topic. However, I cannot diagnose your specific condition.\n\n*Disclaimer: This is not a medical diagnosis. Please consult a qualified doctor.*"
      });
    }

    // Default Fallback
    return NextResponse.json({
      response: "Hello! I am your AI Hospital Assistant. How can I help you today? I can assist you with hospital timings, finding the right department, doctor availability, and booking appointments."
    });

  } catch (error) {
    console.error("AI Assistant API Error:", error);
    return NextResponse.json(
      { response: "I apologize, but I am experiencing technical difficulties right now. Please call the reception at +91 40 1234 5678 for immediate assistance." },
      { status: 500 }
    );
  }
}
