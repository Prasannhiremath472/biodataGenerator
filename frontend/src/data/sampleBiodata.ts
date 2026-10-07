import { BiodataData } from '@/types/biodata';

export const SAMPLE_BIODATA: BiodataData = {
  personalInfo: {
    fullName: 'Aarav Sharma',
    nickName: 'Rav',
    gender: 'male',
    dateOfBirth: '1996-04-12',
    age: 29,
    height: "5'9\"",
    weight: '70 kg',
    bloodGroup: 'B+',
    complexion: 'Fair',
    religion: 'Hindu',
    caste: 'Brahmin',
    subCaste: 'Deshastha',
    gotra: 'Kashyap',
    zodiacSign: 'Aries',
    rashi: 'Mesha',
    nakshatra: 'Ashwini',
    manglikStatus: 'No',
    maritalStatus: 'Never Married',
    motherTongue: 'Hindi',
    nationality: 'Indian',
  },
  contactInfo: {
    mobileNumber: '+91 98765 43210',
    email: 'aarav.sharma@example.com',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    pinCode: '411001',
  },
  education: [
    { degree: 'B.Tech Computer Science', college: 'COEP', university: 'Savitribai Phule Pune University', year: '2018', percentage: '78%' },
    { degree: 'MBA Finance', college: 'Symbiosis', university: 'Symbiosis International', year: '2020', percentage: '8.2 CGPA' },
  ],
  occupation: {
    occupation: 'Software Engineer',
    companyName: 'TechCorp Solutions',
    designation: 'Senior Software Engineer',
    annualIncome: '₹18,00,000',
    workLocation: 'Pune',
  },
  family: {
    father: { name: 'Ramesh Sharma', occupation: 'Retired Bank Manager' },
    mother: { name: 'Sunita Sharma', occupation: 'Homemaker' },
    brothers: [{ name: 'Vivaan Sharma', occupation: 'Doctor', maritalStatus: 'Married' }],
    sisters: [],
    familyType: 'nuclear',
    familyStatus: 'upper_middle_class',
  },
  lifestyle: {
    diet: 'Vegetarian',
    smoking: 'No',
    drinking: 'No',
    hobbies: ['Reading', 'Trekking', 'Photography'],
    interests: ['Travel', 'Classical Music'],
  },
  partnerPreferences: {
    preferredAge: '24-28',
    preferredHeight: "5'2\" - 5'7\"",
    preferredEducation: 'Graduate or above',
    preferredLocation: 'Pune / Mumbai',
    additionalExpectations: 'Looking for a caring and family-oriented partner.',
  },
  horoscope: {
    birthTime: '06:45 AM',
    birthPlace: 'Pune, Maharashtra',
    rashi: 'Mesha',
    nakshatra: 'Ashwini',
    manglik: 'No',
  },
};

export const SAMPLE_ABOUT_ME_HTML =
  '<p>I am a software engineer who values family, growth, and honesty. Looking forward to building a happy life together.</p>';
