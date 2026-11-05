"use server";

import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import { revalidatePath } from "next/cache";
import SponsorshipRequest from "@/models/SponsorshipRequest";
import SurveyResponse from "@/models/SurveyResponse";
import BeneficiaryCard from "@/models/BeneficiaryCard";
import User from "@/models/User";
import { assessmentEngine } from "@/lib/services/assessment-engine";
import { checkUserPermissions } from "@/lib/auth-utils";

export async function submitSponsorshipRequest(formData: any) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("Authentication required");
    }

    await connectDB();

    const user = await User.findOne({ clerkUserId: userId });
    if (!user) {
      throw new Error("User not found");
    }

    // Create sponsorship request
    const sponsorshipRequest = new SponsorshipRequest({
      applicantName: formData.applicantName,
      fatherName: formData.fatherName,
      aadhaar: undefined, // Optional Aadhaar, will be collected during survey if available
      contactInfo: {
        phone: formData.phone,
        alternatePhone: formData.alternatePhone || undefined
      },
      fullAddress: formData.fullAddress,
      basicRequest: {
        reasonForRequest: formData.reasonForRequest
      },
      submittedBy: user._id,
      status: 'pending'
    });

    await sponsorshipRequest.save();

    revalidatePath('/admin/sponsorship');
    
    return {
      success: true,
      data: {
        requestId: sponsorshipRequest.requestId,
        status: sponsorshipRequest.status,
        priority: sponsorshipRequest.priority
      }
    };

  } catch (error) {
    console.error("Error submitting sponsorship request:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit request"
    };
  }
}


export async function submitSurveyResponse(requestId: string, surveyData: any) {
  try {
    // Check permissions and get user
    const { user } = await checkUserPermissions(['admin', 'moderator', 'surveyor', 'surveyor']);

    const request = await SponsorshipRequest.findById(requestId);
    if (!request) {
      throw new Error("Sponsorship request not found");
    }

    // Calculate total income and expenses properly
    const familyIncome = (surveyData.familyMembers || []).reduce((total: number, member: any) => {
      return total + (member.monthlyIncome || 0) + (member.incomeFromOtherSources || 0);
    }, 0);
    
    const totalEarnings = (surveyData.incomeExpenses?.monthlyEarnings?.primaryIncome || 0) +
                         (surveyData.incomeExpenses?.monthlyEarnings?.secondaryIncome || 0) +
                         (surveyData.incomeExpenses?.monthlyEarnings?.otherEarnings || 0) +
                         familyIncome;
    
    const housingExpenses = (surveyData.housingDetails?.rentAmount || 0) +
                           (surveyData.housingDetails?.utilityBills?.electricityBillAmount || 0) +
                           (surveyData.housingDetails?.utilityBills?.gasBillAmount || 0) +
                           (surveyData.housingDetails?.utilityBills?.waterBillAmount || 0);
    
    const totalExpenses = (surveyData.incomeExpenses?.monthlyExpenses?.rent || 0) +
                         (surveyData.incomeExpenses?.monthlyExpenses?.electricityBill || 0) +
                         (surveyData.incomeExpenses?.monthlyExpenses?.educationExpenses || 0) +
                         (surveyData.incomeExpenses?.monthlyExpenses?.medicalExpenses || 0) +
                         (surveyData.incomeExpenses?.monthlyExpenses?.foodExpenses || 0) +
                         (surveyData.incomeExpenses?.monthlyExpenses?.otherExpenses || 0) +
                         housingExpenses;

    // Calculate assessment scores
    const assessment = assessmentEngine.calculateAssessment(
      totalEarnings || 0,
      totalExpenses || 0,
      (surveyData.familyMembers || []).length || 1,
      surveyData.familyMembers || [],
      surveyData.housingDetails?.housingCondition || 'fair',
      surveyData.officerReport,
      (surveyData.familyMembers || []).some((m: any) => 
        m.relationship?.toLowerCase().includes('wife') && 
        !(surveyData.familyMembers || []).some((p: any) => 
          p.relationship?.toLowerCase().includes('husband')
        )
      )
    );

    const isAdminOrModerator = ['admin', 'moderator'].includes(user.role);

    // Check if survey already exists
    // For admins/moderators, find by requestId regardless of officerId
    let existingSurvey = await SurveyResponse.findOne(
      isAdminOrModerator
        ? { requestId: request._id }
        : { 
            requestId: request._id,
            $or: [
              { officerId: user._id },
              { officerId: user._id.toString() }
            ]
          }
    );

    // Allow editing if survey is submitted but not yet verified (unless admin/moderator)
    if (existingSurvey && existingSurvey.status === 'verified' && !isAdminOrModerator) {
      throw new Error("Cannot edit verified survey");
    }

    // Process photos to ensure they're properly uploaded
    const processedPhotos = (surveyData.photos || []).map((photo: any) => ({
      category: photo.category,
      url: photo.url,
      publicId: photo.publicId || `temp-${Date.now()}-${Math.random().toString(36).substring(2)}`,
      memberIndex: photo.memberIndex,
      documentType: photo.documentType,
      description: photo.description || `${photo.category} photo`,
      uploadedAt: new Date()
    }));

    const surveyData_processed = {
      requestId: request._id,
      officerId: existingSurvey?.officerId || user._id,
      lastModifiedBy: user._id,
      lastModifiedAt: new Date(),
      personalDetails: {
        ...surveyData.personalDetails,
        surveyDate: surveyData.personalDetails?.surveyDate || new Date()
      },
      familyMembers: surveyData.familyMembers || [],
      bankDetails: surveyData.bankDetails || [],
      housingDetails: surveyData.housingDetails,
      incomeExpenses: {
        ...surveyData.incomeExpenses,
        monthlyEarnings: {
          ...surveyData.incomeExpenses?.monthlyEarnings,
          totalEarnings: totalEarnings
        },
        monthlyExpenses: {
          ...surveyData.incomeExpenses?.monthlyExpenses,
          totalExpenses: totalExpenses
        },
        netAmount: totalEarnings - totalExpenses
      },
      photos: processedPhotos,
      documentation: surveyData.documentation || [],
      officerReport: surveyData.officerReport,
      calculatedScores: assessment,
      status: existingSurvey?.status === 'verified' ? 'verified' : 'submitted',
      submittedAt: existingSurvey?.submittedAt || new Date()
    };

    if (existingSurvey) {
      // Update existing survey to updated status
      Object.assign(existingSurvey, surveyData_processed);
      await existingSurvey.save();
      
      // Clean up any duplicate drafts for this request
      await SurveyResponse.deleteMany({
        requestId: request._id,
        _id: { $ne: existingSurvey._id }, // Don't delete the one we just updated
        status: 'draft' // Only delete drafts, not other submitted surveys
      });
    } else {
      // Create new survey
      const surveyResponse = new SurveyResponse(surveyData_processed);
      await surveyResponse.save();
      existingSurvey = surveyResponse;
      
      // Clean up any orphaned drafts for this request
      await SurveyResponse.deleteMany({
        requestId: request._id,
        _id: { $ne: existingSurvey._id },
        status: 'draft'
      });
    }

    // Sync family members to separate collection
    try {
      const { syncFamilyMembers } = await import('./family-member-actions');
      await syncFamilyMembers(
        existingSurvey._id.toString(), 
        surveyData.familyMembers || [], 
        (user as any).clerkUserId
      );
    } catch (syncError) {
      console.error('Error syncing family members:', syncError);
      // Don't fail the submission if sync fails
    }

    // Update request status
    request.status = 'surveyed';
    
    // Populate the request with submittedBy for notifications
    await request.populate('submittedBy', 'name email');
    await request.save();

    // Send notifications
    try {
      const { NotificationService } = await import('@/lib/services/notification.service');
      
      // Notify admins and moderators about completed survey
      await NotificationService.notifyByRole(['admin', 'moderator'], {
        title: 'Survey Completed',
        body: `Survey completed for ${request.applicantName}'s sponsorship request`,
        url: `/admin/sponsorship/requests/${request._id}`,
        type: 'survey_completed'
      });

      // Notify the applicant if they have a user account
      if (request.submittedBy) {
        await NotificationService.notifyUsers([(request.submittedBy as any)._id.toString()], {
          title: 'Survey Completed',
          body: `Your sponsorship request survey has been completed and is under review`,
          url: `/sponsorship/status`,
          type: 'request_update'
        });
      }
    } catch (notificationError) {
      console.error('Failed to send survey completion notifications:', notificationError);
      // Don't fail the submission if notifications fail
    }

    revalidatePath('/admin/sponsorship');
    
    return {
      success: true,
      data: {
        surveyId: existingSurvey.surveyId,
        assessment
      }
    };

  } catch (error) {
    console.error("Error submitting survey response:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit survey"
    };
  }
}

export async function approveBeneficiary(surveyResponseId: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("Authentication required");
    }

    await connectDB();

    const user = await User.findOne({ clerkUserId: userId });
    if (!user || !['admin', 'moderator'].includes(user.role)) {
      throw new Error("Insufficient permissions");
    }

    const surveyResponse = await SurveyResponse.findById(surveyResponseId)
      .populate('requestId');
    
    if (!surveyResponse) {
      throw new Error("Survey response not found");
    }

    if (surveyResponse.status !== 'submitted') {
      throw new Error("Survey response is not ready for approval");
    }

    // Create beneficiary card
    const beneficiaryCard = new BeneficiaryCard({
      surveyResponseId: surveyResponse._id,
      requestId: surveyResponse.requestId._id,
      fullName: surveyResponse.personalDetails.fullName,
      fatherName: surveyResponse.personalDetails.fatherName,
      aadhaar: surveyResponse.personalDetails.aadhaar,
      contactNumber: surveyResponse.personalDetails.contactNumber,
      address: surveyResponse.personalDetails.fullAddress,
      district: surveyResponse.personalDetails.district,
      category: surveyResponse.calculatedScores!.category,
      categoryColor: surveyResponse.calculatedScores!.categoryColor,
      assessmentScores: {
        financialScore: surveyResponse.calculatedScores!.financialScore,
        dependentsScore: surveyResponse.calculatedScores!.dependentsScore,
        socialStatusScore: surveyResponse.calculatedScores!.socialStatusScore,
        officerScore: surveyResponse.calculatedScores!.officerScore,
        totalScore: surveyResponse.calculatedScores!.totalScore,
        perCapitaIncome: surveyResponse.calculatedScores!.perCapitaIncome
      },
      familySize: surveyResponse.familyMembers.length,
      dependentsCount: surveyResponse.familyMembers.filter((m: any) => m.isDependent).length,
      hasDisabledMembers: surveyResponse.familyMembers.some((m: any) => m.hasDisability),
      hasElderlyDependents: surveyResponse.familyMembers.some((m: any) => 
        m.age >= 60 && m.isDependent
      ),
      isWidowHeaded: surveyResponse.familyMembers.some((m: any) => 
        m.relationship.toLowerCase().includes('wife') && 
        !surveyResponse.familyMembers.some((p: any) => 
          p.relationship.toLowerCase().includes('husband')
        )
      ),
      approvedBy: user._id
    });

    await beneficiaryCard.save();

    // Update survey response status
    surveyResponse.status = 'approved';
    surveyResponse.reviewedBy = user._id;
    surveyResponse.reviewedAt = new Date();
    await surveyResponse.save();

    // Update request status
    const request = await SponsorshipRequest.findById(surveyResponse.requestId);
    if (request) {
      request.status = 'approved';
      
      // Populate the request with submittedBy for notifications
      await request.populate('submittedBy', 'name email');
      await request.save();

      // Send notifications
      try {
        const { NotificationService } = await import('@/lib/services/notification.service');
        
        // Notify the applicant about approval
        if (request.submittedBy) {
          await NotificationService.notifyUsers([(request.submittedBy as any)._id.toString()], {
            title: 'Request Approved! 🎉',
            body: `Congratulations! Your sponsorship request has been approved. Your beneficiary card ID is: ${beneficiaryCard.beneficiaryId}`,
            url: `/sponsorship/status`,
            type: 'request_approved'
          });
        }

        // Notify admins about new approved beneficiary
        await NotificationService.notifyByRole(['admin', 'moderator'], {
          title: 'New Beneficiary Approved',
          body: `${request.applicantName} has been approved as a beneficiary (Card: ${beneficiaryCard.beneficiaryId})`,
          url: `/admin/sponsorship/requests/${request._id}`,
          type: 'beneficiary_approved'
        });
      } catch (notificationError) {
        console.error('Failed to send approval notifications:', notificationError);
        // Don't fail the approval if notifications fail
      }
    }

    revalidatePath('/admin/sponsorship');
    
    return {
      success: true,
      data: {
        beneficiaryId: beneficiaryCard.beneficiaryId,
        category: beneficiaryCard.category
      }
    };

  } catch (error) {
    console.error("Error approving beneficiary:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to approve beneficiary"
    };
  }
}

export async function assignOfficer(requestId: string, officerId: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("Authentication required");
    }

    await connectDB();

    const user = await User.findOne({ clerkUserId: userId });
    if (!user || !['admin', 'moderator'].includes(user.role)) {
      throw new Error("Insufficient permissions");
    }

    const request = await SponsorshipRequest.findById(requestId);
    if (!request) {
      throw new Error("Sponsorship request not found");
    }

    // Check if the officer exists in Clerk and has the right role
    const { clerkClient } = await import('@clerk/nextjs/server');
    const client = await clerkClient();
    
    let clerkUser;
    try {
      clerkUser = await client.users.getUser(officerId);
      const userRole = (clerkUser.publicMetadata as any)?.role;
      
      if (userRole !== 'surveyor') {
        throw new Error("Invalid inquiry officer");
      }
    } catch (clerkError) {
      throw new Error("Officer not found or invalid");
    }

    // Find or create the officer in MongoDB to get ObjectId
    let officer = await User.findOne({ clerkUserId: officerId });
    if (!officer) {
      officer = await User.create({
        clerkUserId: officerId,
        name: clerkUser.firstName && clerkUser.lastName 
          ? `${clerkUser.firstName} ${clerkUser.lastName}` 
          : (clerkUser.username || 'Officer'),
        email: clerkUser.emailAddresses?.[0]?.emailAddress,
        role: 'surveyor'
      });
    }

    request.assignedOfficer = officerId; // Store Clerk user ID instead of MongoDB ObjectId
    request.assignedDate = new Date();
    request.status = 'assigned';
    
    // Populate the request with submittedBy for notifications
    await request.populate('submittedBy', 'name email');
    await request.save();

    // Send notifications
    try {
      const { NotificationService } = await import('@/lib/services/notification.service');
      
      // Notify the assigned officer
      await NotificationService.notifyUsers([officerId], {
        title: 'New Survey Assignment',
        body: `You have been assigned to survey ${request.applicantName}'s sponsorship request`,
        url: `/surveyor/survey/${request._id}`,
        type: 'survey_assignment'
      });

      // Notify the applicant if they have a user account
      if (request.submittedBy) {
        await NotificationService.notifyUsers([(request.submittedBy as any)._id.toString()], {
          title: 'Request Update',
          body: `Your sponsorship request has been assigned to a surveyor for verification`,
          url: `/sponsorship/status`,
          type: 'request_update'
        });
      }
    } catch (notificationError) {
      console.error('Failed to send assignment notifications:', notificationError);
      // Don't fail the assignment if notifications fail
    }

    revalidatePath('/admin/sponsorship');
    
    return {
      success: true,
      data: {
        requestId: request.requestId,
        assignedOfficer: clerkUser.firstName && clerkUser.lastName 
          ? `${clerkUser.firstName} ${clerkUser.lastName}` 
          : (clerkUser.username || 'Officer')
      }
    };

  } catch (error) {
    console.error("Error assigning officer:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to assign officer"
    };
  }
}