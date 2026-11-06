import mongoose, { Schema, Document } from "mongoose";

export interface PersonalDetails {
  fullName: string;
  fatherName: string;
  aadhaar?: string; // Optional Aadhaar number
  contactNumber: string;
  fullAddress: string;
  district: string;
  pinCode: string;
  surveyDate: Date;
  surveyNumber: string;
}

export interface SurveyFamilyMember {
  name: string;
  age: number;
  religion: string;
  relationship: string;
  educationLevel: string;
  occupation: string;
  monthlyIncome: number;
  maritalStatus: string;
  healthStatus: string;
  employmentStatus: string;
  isDependent: boolean;
  hasDisability: boolean;
  disabilityType?: string;
  
  // Extended fields for detailed survey
  socialStatus: string[]; // widow/divorced/orphan/disabled_head/disabled_head_child/normal_dependent/normal_dependent_child/disabled/old_generation/handicapped_individual
  disabilityDetails?: {
    type: string; // blind/deaf/dumb/limb_loss/polio/other
    specificDetails?: string; // one_leg/both_legs/one_hand/both_hands/etc
  };
  certificates: boolean;
  pensionDetails?: {
    hasPension: boolean;
    pensionType?: string;
    pensionSource?: string;
  };
  daughterStatus?: {
    isOver18: boolean;
    maritalStatus?: 'married' | 'unmarried';
  };
  educationDetails?: {
    attendingSchool: boolean;
    schoolType?: 'government_school' | 'government_college' | 'private_school' | 'private_college' | 'madrasa' | 'none';
    attendingMaktab: boolean;
  };
  skillsAndEmployment?: {
    technicalSkills?: string;
    otherSkills?: string;
    employmentDetails?: string;
    isUnemployed?: boolean;
  };
  incomeFromOtherSources?: number;
  identityDocuments?: {
    aadhaar?: {
      number?: string;
      needsCorrection: boolean;
      correctionType?: string;
      needsNew: boolean;
    };
    voterId?: {
      number?: string;
      needsCorrection: boolean;
      correctionType?: string;
      needsNew: boolean;
    };
  };
  bankDetails?: {
    bankName?: string;
    branchName?: string;
    accountNumber?: string;
    ifscCode?: string;
  };
  photo?: string; // URL to member's photo (optional)
  documents?: string[]; // URLs to uploaded documents (optional)
}

export interface BankDetails {
  bankName: string;
  branchName: string;
  accountNumber: string;
  ifscCode: string;
}

export interface HousingDetails {
  houseType: 'owned' | 'rented' | 'shared' | 'hut' | 'temporary';
  roofType: 'concrete' | 'asbestos' | 'tin' | 'thatch' | 'other';
  wallType: 'brick' | 'mud' | 'wood' | 'tin' | 'other';
  toiletFacility: 'private' | 'shared' | 'public' | 'none';
  waterConnection: boolean;
  electricityConnection: boolean;
  gasConnection: boolean;
  rentAmount?: number;
  housingCondition: 'good' | 'fair' | 'poor' | 'very_poor';
  
  // Extended housing details
  utilityBills?: {
    electricityBillAmount?: number;
    gasBillAmount?: number;
    waterBillAmount?: number;
  };
  gasConnectionDetails?: {
    hasGasConnection: boolean;
    gasCompany?: 'HP' | 'Indane' | 'Bharat_Gas' | 'Other';
    companyName?: string;
  };
  cookingMethod?: {
    primary: 'gas' | 'wood' | 'kerosene' | 'coal' | 'electric' | 'other';
    details?: string;
  };
  rationCard?: {
    hasRationCard: boolean;
    cardType?: 'white' | 'pink' | 'yellow' | 'other';
    needsCorrection: boolean;
    correctionType?: string;
  };
}

export interface IncomeExpenses {
  monthlyEarnings: {
    primaryIncome: number;
    secondaryIncome: number;
    otherEarnings: number;
    totalEarnings: number;
  };
  monthlyExpenses: {
    rent: number;
    electricityBill: number;
    educationExpenses: number;
    medicalExpenses: number;
    foodExpenses: number;
    otherExpenses: number;
    totalExpenses: number;
  };
  otherEarningsSource?: string;
  netAmount: number;
}

export interface SurveyPhoto {
  category: 'member_photo' | 'certificate' | 'identity' | 'other_document' | 'housing' | 'documentation' | 'family' | 'other';
  url: string;
  publicId?: string; // Optional for local files, required after upload to Cloudinary
  memberIndex?: number;
  documentType?: string;
  description?: string;
  uploadedAt: Date;
}

export interface Documentation {
  type: 'aadhaar' | 'income_certificate' | 'disability_certificate' | 'medical_report' | 'other';
  url: string;
  publicId: string;
  description?: string;
  uploadedAt: Date;
}

export interface OfficerReport {
  housingConditionNotes: string;
  employmentVerification: string;
  neighborReferences: string;
  supportingEvidence: string;
  officerRecommendation: string;
  officerScore: number; // 0-5 scale
  verificationStatus: 'verified' | 'partially_verified' | 'unverified';
  additionalNotes?: string;
}

export interface AssessmentScores {
  financialScore: number; // 0-5 based on per-capita income
  dependentsScore: number; // 0-5 based on number and type of dependents
  socialStatusScore: number; // 0-5 based on widow/orphan/disabled status
  officerScore: number; // 0-5 from officer report
  totalScore: number; // Sum of all scores
  category?: string;
  categoryColor?: string;
  perCapitaIncome: number;
  calculatedAt: Date;
}

export interface ISurveyResponse extends Document {
  surveyId: string;
  requestId: mongoose.Types.ObjectId;
  officerId: mongoose.Types.ObjectId;
  personalDetails: PersonalDetails;
  familyMembers: SurveyFamilyMember[]; // Keep for backward compatibility
  familyMemberIds: mongoose.Types.ObjectId[]; // References to FamilyMember collection
  bankDetails: BankDetails[];
  housingDetails: HousingDetails;
  incomeExpenses: IncomeExpenses;
  photos: SurveyPhoto[]; // Family-level photos only
  documentation: Documentation[];
  officerReport: OfficerReport;
  calculatedScores?: AssessmentScores;
  status: 'draft' | 'submitted' | 'under_review' | 'verified' | 'approved' | 'rejected' | 'revision_required';
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  reviewComments?: string;
  submittedAt?: Date;
  
  // Admin review fields
  approvedAt?: Date;
  approvedBy?: mongoose.Types.ObjectId;
  rejectedAt?: Date;
  rejectedBy?: mongoose.Types.ObjectId;
  revisionRequestedAt?: Date;
  revisionRequestedBy?: mongoose.Types.ObjectId;
  adminComments?: string;
  category?: string; // category_1, category_2, category_3
  
  // Relief card information
  reliefCard?: {
    cardId: string;
    assignedAt: Date;
    assignedBy: mongoose.Types.ObjectId;
    status: 'active' | 'inactive' | 'suspended';
    comments?: string;
  };
  
  // Action history
  actionHistory?: Array<{
    action: string;
    performedBy: mongoose.Types.ObjectId;
    performedAt: Date;
    comments?: string;
    category?: string;
    details?: any;
  }>;
  
  lastSyncedAt?: Date; // For offline sync
  lastModifiedAt?: Date; // Updated by FamilyMember hooks
  lastModifiedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const surveyResponseSchema = new Schema<ISurveyResponse>({
  surveyId: { 
    type: String, 
    required: true, 
    unique: true,
    default: () => `SUR-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
  },
  requestId: { type: Schema.Types.ObjectId, ref: 'SponsorshipRequest', required: true },
  officerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  
  personalDetails: {
    fullName: { type: String, required: true },
    fatherName: { type: String, required: true },
    aadhaar: { type: String, required: false }, // Optional Aadhaar number
    contactNumber: { type: String, required: true },
    fullAddress: { type: String, required: true },
    district: { type: String, required: true },
    pinCode: { type: String, required: true },
    surveyDate: { type: Date, required: true, default: Date.now },
    surveyNumber: { type: String, required: true }
  },

  // Keep familyMembers for backward compatibility during migration
  familyMembers: [{
    name: { type: String, required: true },
    age: { type: Number, required: true, min: 0, max: 120 },
    religion: { type: String, required: true },
    relationship: { type: String, required: true },
    educationLevel: { 
      type: String, 
      enum: ['illiterate', 'primary', 'middle', 'matric', 'intermediate', 'graduate', 'postgraduate', 'other']
    },
    occupation: { type: String },
    monthlyIncome: { type: Number, default: 0, min: 0 },
    maritalStatus: { 
      type: String, 
      enum: ['single', 'married', 'divorced', 'widowed']
    },
    healthStatus: { 
      type: String, 
      enum: ['healthy', 'chronically_ill', 'disabled', 'elderly']
    },
    employmentStatus: { 
      type: String, 
      enum: ['employed', 'unemployed', 'student', 'retired', 'disabled', 'homemaker']
    },
    isDependent: { type: Boolean, default: false },
    hasDisability: { type: Boolean, default: false },
    disabilityType: { type: String },
    
    // Extended fields
    socialStatus: [{ 
      type: String, 
      enum: ['widow', 'divorced', 'orphan', 'disabled_head', 'disabled_head_child', 'normal_dependent', 'normal_dependent_child', 'disabled', 'old_generation', 'handicapped_individual']
    }],
    disabilityDetails: {
      type: { 
        type: String, 
        enum: ['blind', 'deaf', 'dumb', 'limb_loss', 'polio', 'other']
      },
      specificDetails: { type: String }
    },
    certificates: { type: Boolean, default: false },
    pensionDetails: {
      hasPension: { type: Boolean, default: false },
      pensionType: { type: String },
      pensionSource: { type: String }
    },
    daughterStatus: {
      isOver18: { type: Boolean },
      maritalStatus: { 
        type: String, 
        enum: ['married', 'unmarried']
      }
    },
    educationDetails: {
      attendingSchool: { type: Boolean, default: false },
      schoolType: { 
        type: String, 
        enum: ['government_school', 'government_college', 'private_school', 'private_college', 'madrasa', 'none']
      },
      attendingMaktab: { type: Boolean, default: false }
    },
    skillsAndEmployment: {
      technicalSkills: { type: String },
      otherSkills: { type: String },
      employmentDetails: { type: String },
      isUnemployed: { type: Boolean }
    },
    incomeFromOtherSources: { type: Number, default: 0, min: 0 },
    identityDocuments: {
      aadhaar: {
        number: { type: String },
        needsCorrection: { type: Boolean, default: false },
        correctionType: { type: String },
        needsNew: { type: Boolean, default: false }
      },
      voterId: {
        number: { type: String },
        needsCorrection: { type: Boolean, default: false },
        correctionType: { type: String },
        needsNew: { type: Boolean, default: false }
      }
    },
    bankDetails: {
      bankName: { type: String },
      branchName: { type: String },
      accountNumber: { type: String },
      ifscCode: { type: String }
    },
    photo: { type: String },
    documents: [{ type: String }]
  }],

  // New field for FamilyMember references
  familyMemberIds: [{ type: Schema.Types.ObjectId, ref: 'FamilyMember' }],

  bankDetails: [{
    bankName: { type: String, required: true },
    branchName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true }
  }],

  housingDetails: {
    houseType: { 
      type: String, 
      enum: ['owned', 'rented', 'shared', 'hut', 'temporary'],
      required: true 
    },
    roofType: { 
      type: String, 
      enum: ['concrete', 'asbestos', 'tin', 'thatch', 'other']
    },
    wallType: { 
      type: String, 
      enum: ['brick', 'mud', 'wood', 'tin', 'other']
    },
    toiletFacility: { 
      type: String, 
      enum: ['private', 'shared', 'public', 'none'],
      required: true 
    },
    waterConnection: { type: Boolean, default: false },
    electricityConnection: { type: Boolean, default: false },
    gasConnection: { type: Boolean, default: false },
    rentAmount: { type: Number, min: 0 },
    housingCondition: { 
      type: String, 
      enum: ['good', 'fair', 'poor', 'very_poor'],
      required: true 
    },
    
    // Extended housing details
    utilityBills: {
      electricityBillAmount: { type: Number, min: 0 },
      gasBillAmount: { type: Number, min: 0 },
      waterBillAmount: { type: Number, min: 0 }
    },
    gasConnectionDetails: {
      hasGasConnection: { type: Boolean, default: false },
      gasCompany: { 
        type: String, 
        enum: ['HP', 'Indane', 'Bharat_Gas', 'Other']
      },
      companyName: { type: String }
    },
    cookingMethod: {
      primary: { 
        type: String, 
        enum: ['gas', 'wood', 'kerosene', 'coal', 'electric', 'other'],
        default: 'wood'
      },
      details: { type: String }
    },
    rationCard: {
      hasRationCard: { type: Boolean, default: false },
      cardType: { 
        type: String, 
        enum: ['white', 'pink', 'yellow', 'other']
      },
      needsCorrection: { type: Boolean, default: false },
      correctionType: { type: String }
    }
  },

  incomeExpenses: {
    monthlyEarnings: {
      primaryIncome: { type: Number, default: 0, min: 0 },
      secondaryIncome: { type: Number, default: 0, min: 0 },
      otherEarnings: { type: Number, default: 0, min: 0 },
      totalEarnings: { type: Number, default: 0, min: 0 }
    },
    monthlyExpenses: {
      rent: { type: Number, default: 0, min: 0 },
      electricityBill: { type: Number, default: 0, min: 0 },
      educationExpenses: { type: Number, default: 0, min: 0 },
      medicalExpenses: { type: Number, default: 0, min: 0 },
      foodExpenses: { type: Number, default: 0, min: 0 },
      otherExpenses: { type: Number, default: 0, min: 0 },
      totalExpenses: { type: Number, default: 0, min: 0 }
    },
    otherEarningsSource: { type: String },
    netAmount: { type: Number, default: 0 }
  },

  photos: [{
    category: { 
      type: String, 
      enum: ['member_photo', 'certificate', 'identity', 'other_document', 'housing', 'documentation', 'family', 'other'],
      required: true 
    },
    url: { type: String, required: true },
    publicId: { type: String, required: false }, // Optional for local files
    memberIndex: { type: Number },
    documentType: { type: String },
    description: { type: String },
    uploadedAt: { type: Date, default: Date.now }
  }],

  documentation: [{
    type: { 
      type: String, 
      enum: ['aadhaar', 'income_certificate', 'disability_certificate', 'medical_report', 'other'],
      required: true 
    },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    description: { type: String },
    uploadedAt: { type: Date, default: Date.now }
  }],

  officerReport: {
    housingConditionNotes: { type: String, required: true },
    employmentVerification: { type: String, required: true },
    neighborReferences: { type: String },
    supportingEvidence: { type: String },
    officerRecommendation: { type: String, required: true },
    officerScore: { type: Number, min: 0, max: 5, required: true },
    verificationStatus: { 
      type: String, 
      enum: ['verified', 'partially_verified', 'unverified'],
      default: 'unverified'
    },
    additionalNotes: { type: String }
  },

  calculatedScores: {
    financialScore: { type: Number, min: 0, max: 5 },
    dependentsScore: { type: Number, min: 0, max: 5 },
    socialStatusScore: { type: Number, min: 0, max: 5 },
    officerScore: { type: Number, min: 0, max: 5 },
    totalScore: { type: Number, min: 0, max: 20 },
    category: { 
      type: String
    },
    categoryColor: { 
      type: String
    },
    perCapitaIncome: { type: Number },
    calculatedAt: { type: Date }
  },

  status: { 
    type: String, 
    enum: ['draft', 'submitted', 'under_review', 'verified', 'approved', 'rejected', 'revision_required'],
    default: 'draft'
  },
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date },
  reviewComments: { type: String },
  submittedAt: { type: Date },
  
  // Admin review fields
  approvedAt: { type: Date },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  rejectedAt: { type: Date },
  rejectedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  revisionRequestedAt: { type: Date },
  revisionRequestedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  adminComments: { type: String },
  category: { 
    type: String,
    trim: true
  },
  
  // Relief card information
  reliefCard: {
    cardId: { type: String },
    assignedAt: { type: Date },
    assignedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { 
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active'
    },
    comments: { type: String }
  },
  
  // Action history
  actionHistory: [{
    action: { type: String, required: true },
    performedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    performedAt: { type: Date, default: Date.now },
    comments: { type: String },
    category: { type: String },
    details: { type: Schema.Types.Mixed }
  }],
  
  lastSyncedAt: { type: Date },
  lastModifiedAt: { type: Date },
  lastModifiedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance (surveyId already indexed via unique: true)
surveyResponseSchema.index({ requestId: 1 });
surveyResponseSchema.index({ officerId: 1 });
surveyResponseSchema.index({ status: 1 });
surveyResponseSchema.index({ 'calculatedScores.category': 1 });
surveyResponseSchema.index({ createdAt: -1 });
surveyResponseSchema.index({ submittedAt: -1 });

// Pre-save middleware to calculate totals
surveyResponseSchema.pre('save', function(next) {
  // Calculate total earnings including family member incomes and other sources
  if (this.incomeExpenses?.monthlyEarnings) {
    const earnings = this.incomeExpenses.monthlyEarnings;
    
    // Add family member incomes
    let familyIncome = 0;
    let otherSourcesIncome = 0;
    
    if (this.familyMembers) {
      familyIncome = this.familyMembers.reduce((total, member) => {
        return total + (member.monthlyIncome || 0) + (member.incomeFromOtherSources || 0);
      }, 0);
    }
    
    earnings.totalEarnings = earnings.primaryIncome + earnings.secondaryIncome + earnings.otherEarnings + familyIncome;
  }

  // Calculate total expenses including utility bills
  if (this.incomeExpenses?.monthlyExpenses) {
    const expenses = this.incomeExpenses.monthlyExpenses;
    let utilityBills = 0;
    
    if (this.housingDetails?.utilityBills) {
      const bills = this.housingDetails.utilityBills;
      utilityBills = (bills.electricityBillAmount || 0) + (bills.gasBillAmount || 0) + (bills.waterBillAmount || 0);
    }
    
    expenses.totalExpenses = expenses.rent + expenses.electricityBill + expenses.educationExpenses + 
                            expenses.medicalExpenses + expenses.foodExpenses + expenses.otherExpenses + utilityBills;
  }

  // Calculate net amount
  if (this.incomeExpenses) {
    this.incomeExpenses.netAmount = this.incomeExpenses.monthlyEarnings.totalEarnings - 
                                   this.incomeExpenses.monthlyExpenses.totalExpenses;
  }

  next();
});

export default mongoose.models.SurveyResponse || mongoose.model<ISurveyResponse>("SurveyResponse", surveyResponseSchema);