import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import SurveyResponse from '@/models/SurveyResponse';
import FamilyMember from '@/models/FamilyMember';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ surveyId: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const user = await User.findOne({ clerkUserId: userId });
    
    if (!user || !['admin', 'moderator'].includes(user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { action, comments, category } = await request.json();

    if (!action || !comments) {
      return NextResponse.json({ error: 'Action and comments are required' }, { status: 400 });
    }

    const survey = await SurveyResponse.findById((await params).surveyId) as any;
    
    if (!survey) {
      return NextResponse.json({ error: 'Survey not found' }, { status: 404 });
    }

    // Update survey based on action
    let newStatus: string;
    let message: string;

    switch (action) {
      case 'approve':
        if (!category) {
          return NextResponse.json({ error: 'Category is required for approval' }, { status: 400 });
        }
        newStatus = 'verified';
        message = 'Survey approved successfully';
        
        // Update survey with approval details
        survey.status = newStatus;
        survey.approvedAt = new Date();
        survey.approvedBy = user._id;
        survey.category = category;
        survey.adminComments = comments;
        
        // Calculate and store assessment scores if not already done
        if (!survey.calculatedScores) {
          const scores = calculateAssessmentScores(survey);
          survey.calculatedScores = scores;
        }
        
        break;
        
      case 'reject':
        newStatus = 'rejected';
        message = 'Survey rejected';
        
        survey.status = newStatus;
        survey.rejectedAt = new Date();
        survey.rejectedBy = user._id;
        survey.adminComments = comments;
        break;
        
      case 'request_revision':
        newStatus = 'revision_required';
        message = 'Revision requested';
        
        survey.status = newStatus;
        survey.revisionRequestedAt = new Date();
        survey.revisionRequestedBy = user._id;
        survey.adminComments = comments;
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Add action to history
    if (!survey.actionHistory) {
      survey.actionHistory = [];
    }
    
    survey.actionHistory.push({
      action,
      performedBy: user._id,
      performedAt: new Date(),
      comments,
      category: category || undefined
    });

    await survey.save();

    return NextResponse.json({ 
      message,
      survey: {
        _id: survey._id,
        status: survey.status,
        category: survey.category
      }
    });

  } catch (error: any) {
    console.error('Error processing survey action:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to calculate assessment scores
function calculateAssessmentScores(survey: any) {
  let financialScore = 0;
  let familyScore = 0;
  let housingScore = 0;
  let officerScore = 0;

  // Financial Score (0-10)
  const totalEarnings = survey.incomeExpenses?.monthlyEarnings?.totalEarnings || 0;
  const totalExpenses = survey.incomeExpenses?.monthlyExpenses?.totalExpenses || 0;
  const netAmount = totalEarnings - totalExpenses;
  
  if (netAmount < -5000) financialScore = 10;
  else if (netAmount < -2000) financialScore = 8;
  else if (netAmount < 0) financialScore = 6;
  else if (netAmount < 2000) financialScore = 4;
  else if (netAmount < 5000) financialScore = 2;
  else financialScore = 0;

  // Family Score (0-10) - based on dependents and vulnerabilities
  const familyMembers = survey.familyMembers || [];
  const children = familyMembers.filter((m: any) => m.age < 18).length;
  const elderly = familyMembers.filter((m: any) => m.age > 60).length;
  const disabled = familyMembers.filter((m: any) => 
    m.healthStatus?.toLowerCase().includes('disabled') || 
    m.healthStatus?.toLowerCase().includes('chronic')
  ).length;
  
  familyScore = Math.min(10, (children * 2) + (elderly * 2) + (disabled * 3));

  // Housing Score (0-10)
  const housingCondition = survey.housingDetails?.housingCondition?.toLowerCase();
  if (housingCondition?.includes('poor') || housingCondition?.includes('dilapidated')) {
    housingScore = 8;
  } else if (housingCondition?.includes('average') || housingCondition?.includes('fair')) {
    housingScore = 5;
  } else {
    housingScore = 2;
  }
  
  // Add points for lack of basic facilities
  if (!survey.housingDetails?.waterConnection) housingScore += 1;
  if (!survey.housingDetails?.electricityConnection) housingScore += 1;
  if (survey.housingDetails?.toiletFacility === 'none') housingScore += 2;
  
  housingScore = Math.min(10, housingScore);

  // Officer Score (0-10) - convert from 5-point scale
  officerScore = (survey.officerReport?.officerScore || 0) * 2;

  const totalScore = financialScore + familyScore + housingScore + officerScore;
  
  let recommendation = 'not_recommended';
  if (totalScore >= 30) recommendation = 'highly_recommended';
  else if (totalScore >= 20) recommendation = 'recommended';
  else if (totalScore >= 15) recommendation = 'conditional';

  return {
    financialScore,
    familyScore,
    housingScore,
    officerScore,
    totalScore,
    recommendation
  };
}