import mongoose, { Schema, Document } from "mongoose";

export interface EligibleFacility {
  facilityType: 'sponsorship' | 'medical_aid' | 'education_aid' | 'ration' | 'pension' | 'emergency_relief';
  description: string;
  isActive: boolean;
  eligibilityNotes?: string;
}

export interface IBeneficiaryCard extends Document {
  beneficiaryId: string;
  cardNumber: string;
  surveyResponseId: mongoose.Types.ObjectId;
  requestId: mongoose.Types.ObjectId;
  
  // Basic Information
  fullName: string;
  fatherName: string;
  aadhaar?: string; // Optional Aadhaar number
  contactNumber: string;
  address: string;
  district: string;
  
  // Assessment Results
  category: string;
  categoryColor: string;
  categoryDescription: string;
  
  // Scores from assessment
  assessmentScores: {
    financialScore: number;
    dependentsScore: number;
    socialStatusScore: number;
    officerScore: number;
    totalScore: number;
    perCapitaIncome: number;
  };
  
  // Family Information
  familySize: number;
  dependentsCount: number;
  hasDisabledMembers: boolean;
  hasElderlyDependents: boolean;
  isWidowHeaded: boolean;
  
  // Eligibility and Facilities
  eligibleFacilities: EligibleFacility[];
  monthlyEligibleAmount?: number;
  
  // Status and Tracking
  isActive: boolean;
  sponsorshipStatus: 'available' | 'sponsored' | 'waitlisted' | 'suspended';
  currentSponsorId?: mongoose.Types.ObjectId;
  sponsorshipStartDate?: Date;
  
  // Review and Verification
  approvedBy: mongoose.Types.ObjectId;
  approvedAt: Date;
  lastReviewDate: Date;
  nextReviewDate: Date;
  reviewNotes?: string;
  
  // Card Generation
  cardGeneratedAt: Date;
  cardPrintedAt?: Date;
  qrCode?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const beneficiaryCardSchema = new Schema<IBeneficiaryCard>({
  beneficiaryId: { 
    type: String, 
    required: true, 
    unique: true,
    default: () => `BEN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
  },
  cardNumber: { 
    type: String, 
    required: true, 
    unique: true,
    default: () => `KMWF-${Date.now().toString().slice(-8)}`
  },
  surveyResponseId: { type: Schema.Types.ObjectId, ref: 'SurveyResponse', required: true },
  requestId: { type: Schema.Types.ObjectId, ref: 'SponsorshipRequest', required: true },
  
  // Basic Information
  fullName: { type: String, required: true },
  fatherName: { type: String, required: true },
  aadhaar: { type: String, required: false }, // Optional Aadhaar number
  contactNumber: { type: String, required: true },
  address: { type: String, required: true },
  district: { type: String, required: true },
  
  // Assessment Results
  category: { 
    type: String, 
    required: true,
    trim: true
  },
  categoryColor: { 
    type: String, 
    default: 'gray'
  },
  categoryDescription: { type: String, required: true },
  
  // Scores from assessment
  assessmentScores: {
    financialScore: { type: Number, required: true, min: 0, max: 5 },
    dependentsScore: { type: Number, required: true, min: 0, max: 5 },
    socialStatusScore: { type: Number, required: true, min: 0, max: 5 },
    officerScore: { type: Number, required: true, min: 0, max: 5 },
    totalScore: { type: Number, required: true, min: 0, max: 20 },
    perCapitaIncome: { type: Number, required: true }
  },
  
  // Family Information
  familySize: { type: Number, required: true, min: 1 },
  dependentsCount: { type: Number, required: true, min: 0 },
  hasDisabledMembers: { type: Boolean, default: false },
  hasElderlyDependents: { type: Boolean, default: false },
  isWidowHeaded: { type: Boolean, default: false },
  
  // Eligibility and Facilities
  eligibleFacilities: [{
    facilityType: { 
      type: String, 
      enum: ['sponsorship', 'medical_aid', 'education_aid', 'ration', 'pension', 'emergency_relief'],
      required: true 
    },
    description: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    eligibilityNotes: { type: String }
  }],
  monthlyEligibleAmount: { type: Number, min: 0 },
  
  // Status and Tracking
  isActive: { type: Boolean, default: true },
  sponsorshipStatus: { 
    type: String, 
    enum: ['available', 'sponsored', 'waitlisted', 'suspended'],
    default: 'available'
  },
  currentSponsorId: { type: Schema.Types.ObjectId, ref: 'User' },
  sponsorshipStartDate: { type: Date },
  
  // Review and Verification
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  approvedAt: { type: Date, required: true, default: Date.now },
  lastReviewDate: { type: Date, required: true, default: Date.now },
  nextReviewDate: { 
    type: Date, 
    required: true,
    default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
  },
  reviewNotes: { type: String },
  
  // Card Generation
  cardGeneratedAt: { type: Date, required: true, default: Date.now },
  cardPrintedAt: { type: Date },
  qrCode: { type: String }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance (beneficiaryId and cardNumber already indexed via unique: true)
beneficiaryCardSchema.index({ aadhaar: 1 });
beneficiaryCardSchema.index({ category: 1 });
beneficiaryCardSchema.index({ sponsorshipStatus: 1 });
beneficiaryCardSchema.index({ isActive: 1 });
beneficiaryCardSchema.index({ district: 1 });
beneficiaryCardSchema.index({ nextReviewDate: 1 });
beneficiaryCardSchema.index({ currentSponsorId: 1 });

// Virtual for category display name
beneficiaryCardSchema.virtual('categoryDisplayName').get(function() {
  const categoryNames: Record<string, string> = {
    'category_1': 'Category 1 — Below Poverty (White)',
    'category_2': 'Category 2 — Medium Poverty (Yellow)',
    'category_3': 'Category 3 — Near-Stable (Green)'
  };
  const key = this.category?.startsWith('category_1') ? 'category_1'
    : this.category?.startsWith('category_2') ? 'category_2'
    : this.category?.startsWith('category_3') ? 'category_3'
    : this.category;
  return categoryNames[key] || this.category;
});

// Virtual for eligibility summary
beneficiaryCardSchema.virtual('eligibilitySummary').get(function() {
  return this.eligibleFacilities
    .filter(f => f.isActive)
    .map(f => f.facilityType)
    .join(', ');
});

// Pre-save middleware to set category description and eligible facilities
beneficiaryCardSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('category')) {
    const key = this.category?.startsWith('category_1') ? 'category_1'
      : this.category?.startsWith('category_2') ? 'category_2'
      : this.category?.startsWith('category_3') ? 'category_3'
      : this.category;

    // Set category description
    const descriptions: Record<string, string> = {
      'category_1': 'Below Poverty - Eligible for full sponsorship and monthly stipends',
      'category_2': 'Medium Poverty - Eligible for targeted support and partial stipends',
      'category_3': 'Near-Stable - Eligible for skill development and emergency aid'
    };
    this.categoryDescription = descriptions[key] || 'Beneficiary Category';

    // Set eligible facilities based on category
    const facilityMappings: Record<string, EligibleFacility[]> = {
      'category_1': [
        { facilityType: 'sponsorship', description: 'Full sponsorship and monthly stipends', isActive: true },
        { facilityType: 'medical_aid', description: 'Priority medical aid and free medicines', isActive: true },
        { facilityType: 'education_aid', description: 'Education support and school fees', isActive: true },
        { facilityType: 'ration', description: 'Monthly ration support', isActive: true },
        { facilityType: 'pension', description: 'Widow/disability pension assistance', isActive: true },
        { facilityType: 'emergency_relief', description: 'Emergency financial assistance', isActive: true }
      ],
      'category_2': [
        { facilityType: 'sponsorship', description: 'Partial sponsorship and targeted support', isActive: true },
        { facilityType: 'medical_aid', description: 'Subsidized medical treatment', isActive: true },
        { facilityType: 'education_aid', description: 'Partial education support', isActive: true },
        { facilityType: 'emergency_relief', description: 'Crisis-based emergency aid', isActive: true }
      ],
      'category_3': [
        { facilityType: 'emergency_relief', description: 'Emergency aid in verified crises', isActive: true }
      ]
    };
    
    this.eligibleFacilities = facilityMappings[key] || [];

    // Set monthly eligible amount based on category
    const monthlyAmounts: Record<string, number> = {
      'category_1': 3000,
      'category_2': 1500,
      'category_3': 0
    };
    this.monthlyEligibleAmount = monthlyAmounts[key] ?? 0;
  }

  // Generate QR code data if not exists
  if (this.isNew && !this.qrCode) {
    this.qrCode = JSON.stringify({
      beneficiaryId: this.beneficiaryId,
      cardNumber: this.cardNumber,
      name: this.fullName,
      category: this.category,
      issuedAt: this.cardGeneratedAt
    });
  }

  next();
});

export default mongoose.models.BeneficiaryCard || mongoose.model<IBeneficiaryCard>("BeneficiaryCard", beneficiaryCardSchema);