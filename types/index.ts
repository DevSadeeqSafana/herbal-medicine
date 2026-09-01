export interface Programme {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  imageUrl: string | null;
  curriculum: string;
  startDate: Date | null;
  endDate: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Registration {
  id: string;
  programmeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date | null;
  address: string;
  city: string;
  state: string;
  country: string;
  qualification: string;
  institution: string | null;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  registrationId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  transactionRef: string;
  credoRef: string | null;
  paymentMethod: string | null;
  metadata: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export interface RegistrationFormData {
  programmeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  country: string;
  qualification: string;
  institution: string;
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string | null;
  imageUrl: string | null;
  email: string | null;
  phone: string | null;
  department: string | null;
  linkedin: string | null;
  twitter: string | null;
  facebook: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'superadmin';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  notes: string | null;
  repliedAt: Date | null;
  repliedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}
