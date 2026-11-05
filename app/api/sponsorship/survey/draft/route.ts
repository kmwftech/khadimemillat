import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import SurveyResponse from "@/models/SurveyResponse";
import User from "@/models/User";
import { checkUserPermissionsAPI } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  try {
    // Check permissions and get user
    const permissionResult = await checkUserPermissionsAPI(['admin', 'moderator', 'surveyor', 'surveyor']);
    
    if ('error' in permissionResult) {
      return NextResponse.json(
        { error: permissionResult.error },
        { status: permissionResult.status }
      );
    }
    
    const { user } = permissionResult;

    const { requestId, draftData } = await request.json();

    if (!requestId || !draftData) {
      return NextResponse.json(
        { error: "Request ID and draft data are required" },
        { status: 400 }
      );
    }

    const isAdminOrModerator = ['admin', 'moderator'].includes(user.role);

    // Check if a draft already exists (including submitted surveys that can be edited)
    let existingDraft = await SurveyResponse.findOne(
      isAdminOrModerator
        ? {
            requestId,
            $or: [
              { status: 'draft' },
              { status: 'submitted' }
            ]
          }
        : {
            requestId,
            officerId: user._id,
            $or: [
              { status: 'draft' },
              { status: 'submitted' }
            ]
          }
    );

    if (existingDraft) {
      // Update existing draft
      existingDraft.personalDetails = draftData.formData.personalDetails || existingDraft.personalDetails;
      
      // Ensure surveyDate is set
      if (existingDraft.personalDetails && !existingDraft.personalDetails.surveyDate) {
        existingDraft.personalDetails.surveyDate = new Date();
      }
      
      existingDraft.familyMembers = draftData.formData.familyMembers || existingDraft.familyMembers;
      existingDraft.bankDetails = draftData.formData.bankDetails || existingDraft.bankDetails;
      existingDraft.housingDetails = draftData.formData.housingDetails || existingDraft.housingDetails;
      existingDraft.incomeExpenses = draftData.formData.incomeExpenses || existingDraft.incomeExpenses;
      existingDraft.officerReport = draftData.formData.officerReport || existingDraft.officerReport;
      existingDraft.lastSyncedAt = new Date();
      
      await existingDraft.save();
      
      // Clean up any duplicate drafts that might exist
      await SurveyResponse.deleteMany({
        requestId,
        officerId: user._id,
        _id: { $ne: existingDraft._id },
        status: 'draft'
      });
    } else {
      // Create new draft
      const newDraft = new SurveyResponse({
        requestId,
        officerId: user._id,
        personalDetails: draftData.formData.personalDetails || {
          fullName: '',
          fatherName: '',
          contactNumber: '',
          fullAddress: '',
          district: '',
          pinCode: '',
          surveyDate: new Date(),
          surveyNumber: `SUR-${Date.now()}`
        },
        familyMembers: draftData.formData.familyMembers || [],
        bankDetails: draftData.formData.bankDetails || [],
        housingDetails: draftData.formData.housingDetails || {
          houseType: 'owned',
          toiletFacility: 'private',
          housingCondition: 'fair',
          waterConnection: false,
          electricityConnection: false,
          gasConnection: false
        },
        incomeExpenses: draftData.formData.incomeExpenses || {
          monthlyEarnings: {
            primaryIncome: 0,
            secondaryIncome: 0,
            otherEarnings: 0,
            totalEarnings: 0
          },
          monthlyExpenses: {
            rent: 0,
            electricityBill: 0,
            educationExpenses: 0,
            medicalExpenses: 0,
            foodExpenses: 0,
            otherExpenses: 0,
            totalExpenses: 0
          },
          netAmount: 0
        },
        officerReport: draftData.formData.officerReport || {
          housingConditionNotes: '',
          employmentVerification: '',
          officerRecommendation: '',
          officerScore: 3,
          verificationStatus: 'unverified'
        },
        status: 'draft',
        lastSyncedAt: new Date()
      });

      await newDraft.save();
      existingDraft = newDraft;
      
      // Clean up any other drafts for this request and officer
      await SurveyResponse.deleteMany({
        requestId,
        officerId: user._id,
        _id: { $ne: newDraft._id },
        status: 'draft'
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Draft saved successfully',
      draftId: existingDraft._id
    });

  } catch (error) {
    console.error("Error saving survey draft:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check permissions and get user
    const permissionResult = await checkUserPermissionsAPI(['admin', 'moderator', 'surveyor', 'surveyor']);
    
    if ('error' in permissionResult) {
      return NextResponse.json(
        { error: permissionResult.error },
        { status: permissionResult.status }
      );
    }
    
    const { user } = permissionResult;

    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get('requestId');

    if (!requestId) {
      return NextResponse.json(
        { error: "Request ID is required" },
        { status: 400 }
      );
    }

    const isAdminOrModerator = ['admin', 'moderator'].includes(user.role);

    const draft = await SurveyResponse.findOne(
      isAdminOrModerator
        ? {
            requestId,
            $or: [
              { status: 'draft' },
              { status: 'submitted' }
            ]
          }
        : {
            requestId,
            officerId: user._id,
            $or: [
              { status: 'draft' },
              { status: 'submitted' }
            ]
          }
    );

    if (!draft) {
      return NextResponse.json(
        { error: "No draft found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      draft: draft.toObject()
    });

  } catch (error) {
    console.error("Error retrieving survey draft:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}