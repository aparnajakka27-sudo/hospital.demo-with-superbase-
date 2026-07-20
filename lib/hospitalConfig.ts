import { type LucideIcon } from 'lucide-react';

export type Speciality = {
  name: string;
  icon: string;
  description: string;
};

export type Stat = {
  label: string;
  value: string;
};

export type SocialLinks = {
  facebook: string;
  instagram: string;
  linkedin: string;
};

export type Doctor = {
  name: string;
  specialization: string;
  experience: string;
  department: string;
  image: string;
  qualification: string;
};

export type Service = {
  name: string;
  icon: string;
  description: string;
};

export type GalleryImage = {
  image: string;
  caption: string;
};

export type HospitalConfig = {
  name: string;
  shortName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
  googleMapsEmbedUrl: string;
  specialities: Speciality[];
  stats: Stat[];
  whyChooseUs: string[];
  socialLinks: SocialLinks;
  doctors: Doctor[];
  services: Service[];
  gallery: GalleryImage[];
};

export const hospitalConfig: HospitalConfig = {
  name: "HORIZON Super Speciality Hospital",
  shortName: "HORIZON",
  tagline: "Advanced Healthcare. Compassionate Care. Your Health, Our Commitment.",
  phone: "+91 90000 00000",
  whatsapp: "https://wa.me/919000000000",
  email: "info@horizonhospital.com",
  address: "Plaza Road, Near City Circle, Hitech Nagar, Hyderabad, Telangana 500081",
  hours: "Open 24 hours",
  googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15224.99849557342!2d78.3688195!3d17.4475456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93dc8c5d69df%3A0x19688beb557fa0ee!2sHITEC%20City%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin", // Placeholder embed
  specialities: [
    {
      name: "Cardiology",
      icon: "HeartPulse",
      description: "Comprehensive cardiac care including diagnostics, surgery, and rehabilitation.",
    },
    {
      name: "Neurology",
      icon: "Brain",
      description: "Advanced treatment for neurological disorders, brain, and spinal conditions.",
    },
    {
      name: "Orthopaedics",
      icon: "Bone",
      description: "Specialized care for bones, joints, and muscular conditions.",
    },
    {
      name: "Gastroenterology",
      icon: "Stethoscope",
      description: "Expert diagnosis and treatment of digestive system disorders.",
    },
    {
      name: "Nephrology",
      icon: "Activity",
      description: "State-of-the-art care for kidney-related diseases and dialysis services.",
    },
    {
      name: "General Medicine",
      icon: "Cross",
      description: "Primary care, preventive medicine, and management of chronic conditions.",
    },
    {
      name: "Pediatrics",
      icon: "Cross",
      description: "Comprehensive care for infants, children, and adolescents.",
    },
    {
      name: "Oncology",
      icon: "Activity",
      description: "Advanced cancer diagnosis, treatment, and ongoing care.",
    },
    {
      name: "Dermatology",
      icon: "Stethoscope",
      description: "Expert care for skin, hair, and nail conditions.",
    },
    {
      name: "Urology",
      icon: "Activity",
      description: "Diagnosis and treatment of urinary tract and male reproductive system issues.",
    },
    {
      name: "Psychiatry",
      icon: "Brain",
      description: "Mental health services including therapy and medication management.",
    },
    {
      name: "Pulmonology",
      icon: "Stethoscope",
      description: "Specialized care for respiratory and lung diseases.",
    },
  ],
  stats: [
    { label: "Years Experience", value: "15+" },
    { label: "Expert Doctors", value: "50+" },
    { label: "Emergency Care", value: "24/7" },
    { label: "Happy Patients", value: "100K+" },
  ],
  whyChooseUs: [
    "Highly experienced doctors",
    "Advanced tech",
    "24/7 emergency",
    "Patient-centered approach",
    "Affordable treatment"
  ],
  socialLinks: {
    facebook: "#",
    instagram: "#",
    linkedin: "#",
  },
  doctors: [
    {
      name: "Dr. Arjun Mehta",
      specialization: "Interventional Cardiologist",
      experience: "15+ years",
      department: "Cardiology",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop",
      qualification: "MBBS, MD, DM (Cardiology)",
    },
    {
      name: "Dr. Sneha Reddy",
      specialization: "Senior Neurologist",
      experience: "12+ years",
      department: "Neurology",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop",
      qualification: "MBBS, MD, DM (Neurology)",
    },
    {
      name: "Dr. Kavita Rao",
      specialization: "Joint Replacement Surgeon",
      experience: "18+ years",
      department: "Orthopaedics",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop",
      qualification: "MBBS, MS (Ortho)",
    },
    {
      name: "Dr. Vikram Iyer",
      specialization: "Gastroenterologist",
      experience: "10+ years",
      department: "Gastroenterology",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop",
      qualification: "MBBS, MD, DNB",
    },
    {
      name: "Dr. Priya Sharma",
      specialization: "Senior Pediatrician",
      experience: "14+ years",
      department: "Pediatrics",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop",
      qualification: "MBBS, MD (Pediatrics)",
    },
    {
      name: "Dr. Rahul Verma",
      specialization: "Medical Oncologist",
      experience: "16+ years",
      department: "Oncology",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop",
      qualification: "MBBS, MD, DM (Oncology)",
    },
    {
      name: "Dr. Anjali Desai",
      specialization: "Consultant Dermatologist",
      experience: "9+ years",
      department: "Dermatology",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop",
      qualification: "MBBS, MD (Dermatology)",
    },
    {
      name: "Dr. Suresh Kumar",
      specialization: "Urologist & Transplant Surgeon",
      experience: "20+ years",
      department: "Urology",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop",
      qualification: "MBBS, MS, MCh (Urology)",
    },
    {
      name: "Dr. Neha Gupta",
      specialization: "Obstetrician & Gynecologist",
      experience: "11+ years",
      department: "Gynecology",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop",
      qualification: "MBBS, MD (O&G)",
    },
    {
      name: "Dr. Manish Patel",
      specialization: "Senior Psychiatrist",
      experience: "13+ years",
      department: "Psychiatry",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop",
      qualification: "MBBS, MD (Psychiatry)",
    },
    {
      name: "Dr. Kiran Joshi",
      specialization: "Endocrinologist",
      experience: "8+ years",
      department: "Endocrinology",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop",
      qualification: "MBBS, MD, DM (Endo)",
    },
    {
      name: "Dr. Rakesh Singh",
      specialization: "Pulmonologist",
      experience: "17+ years",
      department: "Pulmonology",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop",
      qualification: "MBBS, MD (Pulmonary Medicine)",
    },
    {
      name: "Dr. Pooja Agarwal",
      specialization: "Ophthalmologist",
      experience: "12+ years",
      department: "Ophthalmology",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop",
      qualification: "MBBS, MS (Ophthalmology)",
    },
    {
      name: "Dr. Sameer Nair",
      specialization: "ENT Specialist",
      experience: "15+ years",
      department: "ENT",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop",
      qualification: "MBBS, MS (ENT)",
    },
    {
      name: "Dr. Deepika Menon",
      specialization: "Rheumatologist",
      experience: "10+ years",
      department: "Rheumatology",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop",
      qualification: "MBBS, MD, DM (Rheumatology)",
    },
  ],
  services: [
    {
      name: "Outpatient Care",
      icon: "Stethoscope",
      description: "Expert consultations across all major specialities.",
    },
    {
      name: "Inpatient Care",
      icon: "Bed",
      description: "State-of-the-art wards and private rooms for recovery.",
    },
    {
      name: "Emergency Services",
      icon: "Siren",
      description: "24/7 critical care and trauma response team.",
    },
    {
      name: "Diagnostic Services",
      icon: "Microscope",
      description: "Advanced imaging and fully equipped pathology labs.",
    },
    {
      name: "Pharmacy",
      icon: "Pill",
      description: "24/7 in-house pharmacy for all your medication needs.",
    },
    {
      name: "Ambulance Service",
      icon: "Ambulance",
      description: "Rapid response fleet equipped with life support.",
    },
  ],
  gallery: [
    {
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800",
      caption: "Reception Area"
    },
    {
      image: "https://images.unsplash.com/photo-1587351021355-a479a299d2f9?q=80&w=800",
      caption: "ICU Ward"
    },
    {
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800",
      caption: "Operation Theatre"
    },
    {
      image: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=800",
      caption: "Patient Room"
    },
    {
      image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=800",
      caption: "Diagnostic Lab"
    },
    {
      image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800",
      caption: "Emergency Wing"
    }
  ]
};
