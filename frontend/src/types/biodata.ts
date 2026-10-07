export interface EducationEntry {
  degree: string;
  college?: string;
  university?: string;
  year?: string;
  percentage?: string;
}

export interface SiblingEntry {
  name?: string;
  occupation?: string;
  maritalStatus?: string;
}

export interface PersonalInfo {
  fullName: string;
  nickName?: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  age?: number;
  height?: string;
  weight?: string;
  bloodGroup?: string;
  complexion?: string;
  religion?: string;
  caste?: string;
  subCaste?: string;
  gotra?: string;
  zodiacSign?: string;
  rashi?: string;
  nakshatra?: string;
  manglikStatus?: string;
  maritalStatus?: string;
  motherTongue?: string;
  nationality?: string;
}

export interface ContactInfo {
  mobileNumber: string;
  alternativeMobile?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pinCode?: string;
}

export interface Occupation {
  occupation?: string;
  companyName?: string;
  designation?: string;
  businessName?: string;
  annualIncome?: string;
  monthlyIncome?: string;
  workLocation?: string;
}

export interface Family {
  father?: { name?: string; occupation?: string };
  mother?: { name?: string; occupation?: string };
  brothers?: SiblingEntry[];
  sisters?: SiblingEntry[];
  familyType?: 'joint' | 'nuclear';
  familyStatus?: 'middle_class' | 'upper_middle_class' | 'rich';
}

export interface Lifestyle {
  diet?: string;
  smoking?: string;
  drinking?: string;
  hobbies?: string[];
  interests?: string[];
}

export interface PartnerPreferences {
  preferredAge?: string;
  preferredHeight?: string;
  preferredEducation?: string;
  preferredOccupation?: string;
  preferredLocation?: string;
  additionalExpectations?: string;
}

export interface Horoscope {
  birthTime?: string;
  birthPlace?: string;
  rashi?: string;
  nakshatra?: string;
  manglik?: string;
}

export interface BiodataData {
  personalInfo: PersonalInfo;
  contactInfo: ContactInfo;
  education: EducationEntry[];
  occupation?: Occupation;
  family?: Family;
  lifestyle?: Lifestyle;
  partnerPreferences?: PartnerPreferences;
  horoscope?: Horoscope;
}

export interface Biodata {
  id: number;
  userId: number;
  templateId: number | null;
  languageId: number;
  title: string;
  publicSlug: string | null;
  isPublic: boolean;
  status: 'draft' | 'completed';
  data: BiodataData;
  aboutMeHtml: string | null;
  qrCodeUrl: string | null;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}
