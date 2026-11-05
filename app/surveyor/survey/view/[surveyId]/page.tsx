import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import connectDB from "@/lib/db";
import User from "@/models/User";
import SurveyResponse from "@/models/SurveyResponse";
import SponsorshipRequest from "@/models/SponsorshipRequest";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  User as UserIcon,
  Users,
  Home,
  DollarSign,
  Camera,
  FileText,
  Calendar,
  Phone,
  MapPin,
  CreditCard
} from "lucide-react";

interface SurveyViewPageProps {
  params: {
    surveyId: string;
  };
}

export default async function SurveyViewPage({ params }: SurveyViewPageProps) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  await connectDB();
  
  const user = await User.findOne({ clerkUserId: userId });
  
  if (!user || !['admin', 'moderator', 'surveyor'].includes(user.role)) {
    redirect("/unauthorized");
  }

  // Helper function to deeply serialize objects
  const deepSerialize = (obj: any): any => {
    return JSON.parse(JSON.stringify(obj, (key, value) => {
      // Convert ObjectIds to strings
      if (value && typeof value === 'object' && value.constructor && value.constructor.name === 'ObjectId') {
        return value.toString();
      }
      // Convert Dates to ISO strings
      if (value instanceof Date) {
        return value.toISOString();
      }
      // Convert Buffer objects to empty strings (remove buffer data)
      if (value && typeof value === 'object' && value.type === 'Buffer') {
        return '';
      }
      return value;
    }));
  };

  // Get survey response
  const surveyRaw = await SurveyResponse.findById((await params).surveyId)
    .populate('requestId')
    .populate('officerId', 'name email')
    .lean();

  if (!surveyRaw) {
    notFound();
  }

  // Serialize survey data
  const survey = deepSerialize(surveyRaw);



  // Check if user can view this survey (own survey or admin/moderator)
  if (survey.officerId._id.toString() !== user._id.toString() && 
      !['admin', 'moderator'].includes(user.role)) {
    redirect("/unauthorized");
  }

  const request = survey.requestId as any;
  const isAdminOrModerator = ['admin', 'moderator'].includes(user.role);
  const isOwnSurvey = survey.officerId?._id?.toString() === user._id?.toString();
  const canEdit = (['draft', 'submitted'].includes(survey.status) && (isOwnSurvey || isAdminOrModerator)) ||
                  (isAdminOrModerator && ['revision_required', 'verified'].includes(survey.status));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/surveyor/surveys">
              <ArrowLeft className="w-4 h-4 mr-2" />
              All Surveys
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Survey Details</h1>
            <p className="text-muted-foreground">
              Survey ID: {survey.surveyId}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={
            survey.status === 'verified' ? 'default' :
            survey.status === 'submitted' ? 'secondary' :
            survey.status === 'rejected' ? 'destructive' : 'outline'
          }>
            {survey.status}
          </Badge>
          
          {canEdit && request?._id && (
            <Button asChild>
              <Link href={`/surveyor/survey/${request._id}`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Survey
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="font-medium">{survey.personalDetails.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Father's Name</label>
                  <p className="font-medium">{survey.personalDetails.fatherName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Contact Number</label>
                  <p className="font-medium">{survey.personalDetails.contactNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Survey Date</label>
                  <p className="font-medium">
                    {new Date(survey.personalDetails.surveyDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Full Address</label>
                <p className="font-medium">{survey.personalDetails.fullAddress}</p>
              </div>
            </CardContent>
          </Card>

          {/* Family Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Family Members ({survey.familyMembers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {survey.familyMembers.map((member: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Name</label>
                        <p className="font-medium">{member.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Age</label>
                        <p className="font-medium">{member.age}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Relationship</label>
                        <p className="font-medium">{member.relationship}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Education</label>
                        <p className="font-medium">{member.educationLevel}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Occupation</label>
                        <p className="font-medium">{member.occupation || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Monthly Income</label>
                        <p className="font-medium">₹{member.monthlyIncome}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Housing Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Housing Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">House Type</label>
                  <p className="font-medium">{survey.housingDetails.houseType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Housing Condition</label>
                  <p className="font-medium">{survey.housingDetails.housingCondition}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Toilet Facility</label>
                  <p className="font-medium">{survey.housingDetails.toiletFacility}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Connections</label>
                  <div className="flex gap-2">
                    {survey.housingDetails.waterConnection && (
                      <Badge variant="secondary">Water</Badge>
                    )}
                    {survey.housingDetails.electricityConnection && (
                      <Badge variant="secondary">Electricity</Badge>
                    )}
                    {survey.housingDetails.gasConnection && (
                      <Badge variant="secondary">Gas</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Income & Expenses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Income & Expenses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Monthly Earnings</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Primary Income:</span>
                      <span>₹{survey.incomeExpenses.monthlyEarnings.primaryIncome}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Secondary Income:</span>
                      <span>₹{survey.incomeExpenses.monthlyEarnings.secondaryIncome}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Other Earnings:</span>
                      <span>₹{survey.incomeExpenses.monthlyEarnings.otherEarnings}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>Total Earnings:</span>
                      <span>₹{survey.incomeExpenses.monthlyEarnings.totalEarnings}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Monthly Expenses</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rent:</span>
                      <span>₹{survey.incomeExpenses.monthlyExpenses.rent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Electricity:</span>
                      <span>₹{survey.incomeExpenses.monthlyExpenses.electricityBill}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Education:</span>
                      <span>₹{survey.incomeExpenses.monthlyExpenses.educationExpenses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Medical:</span>
                      <span>₹{survey.incomeExpenses.monthlyExpenses.medicalExpenses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Food:</span>
                      <span>₹{survey.incomeExpenses.monthlyExpenses.foodExpenses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Other:</span>
                      <span>₹{survey.incomeExpenses.monthlyExpenses.otherExpenses}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>Total Expenses:</span>
                      <span>₹{survey.incomeExpenses.monthlyExpenses.totalExpenses}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-medium">
                  <span>Net Amount:</span>
                  <span className={survey.incomeExpenses.netAmount >= 0 ? 'text-green-600' : 'text-red-600'}>
                    ₹{survey.incomeExpenses.netAmount}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Officer Report */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Officer Report
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Housing Condition Notes</label>
                <p className="mt-1">{survey.officerReport.housingConditionNotes || 'No notes provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Employment Verification</label>
                <p className="mt-1">{survey.officerReport.employmentVerification || 'No verification notes'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Officer Recommendation</label>
                <p className="mt-1">{survey.officerReport.officerRecommendation || 'No recommendation provided'}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Officer Score</label>
                  <p className="font-medium">{survey.officerReport.officerScore}/5</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Verification Status</label>
                  <Badge variant={survey.officerReport.verificationStatus === 'verified' ? 'default' : 'secondary'}>
                    {survey.officerReport.verificationStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Survey Info */}
          <Card>
            <CardHeader>
              <CardTitle>Survey Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Survey Officer</label>
                <p className="font-medium">{(survey.officerId as any).name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created Date</label>
                <p className="font-medium">
                  {new Date(survey.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Submitted Date</label>
                <p className="font-medium">
                  {survey.submittedAt ? new Date(survey.submittedAt).toLocaleDateString() : 'Not submitted'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <Badge variant={
                  survey.status === 'verified' ? 'default' :
                  survey.status === 'submitted' ? 'secondary' :
                  survey.status === 'rejected' ? 'destructive' : 'outline'
                }>
                  {survey.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Assessment Scores */}
          {survey.calculatedScores && (
            <Card>
              <CardHeader>
                <CardTitle>Assessment Scores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Financial Score:</span>
                  <span className="font-medium">{survey.calculatedScores.financialScore}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Family Score:</span>
                  <span className="font-medium">{survey.calculatedScores.familyScore}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Housing Score:</span>
                  <span className="font-medium">{survey.calculatedScores.housingScore}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Officer Score:</span>
                  <span className="font-medium">{survey.calculatedScores.officerScore}/10</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-2">
                  <span>Total Score:</span>
                  <span>{survey.calculatedScores.totalScore}/40</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Recommendation:</span>
                  <Badge variant={
                    survey.calculatedScores.recommendation === 'highly_recommended' ? 'default' :
                    survey.calculatedScores.recommendation === 'recommended' ? 'secondary' :
                    survey.calculatedScores.recommendation === 'conditional' ? 'outline' : 'destructive'
                  }>
                    {survey.calculatedScores.recommendation?.replace('_', ' ')}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Photos */}
          {survey.photos && survey.photos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Photos ({survey.photos.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {survey.photos.slice(0, 4).map((photo: any, index: number) => (
                    <div key={index} className="relative">
                      <img
                        src={photo.url}
                        alt={photo.description}
                        className="w-full h-20 object-cover rounded border"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b">
                        {photo.category.replace('_', ' ')}
                      </div>
                    </div>
                  ))}
                </div>
                {survey.photos.length > 4 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    +{survey.photos.length - 4} more photos
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}