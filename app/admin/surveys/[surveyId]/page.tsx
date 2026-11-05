import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import connectDB from "@/lib/db";
import User from "@/models/User";
import SurveyResponse from "@/models/SurveyResponse";
import FamilyMember from "@/models/FamilyMember";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  ArrowLeft,
  User as UserIcon,
  Users,
  Home,
  DollarSign,
  FileText,
  Edit,
  Award
} from "lucide-react";
import { SurveyActionPanel } from "@/components/admin/SurveyActionPanel";
import { MemberSponsorshipPanel } from "@/components/admin/MemberSponsorshipPanel";
import { PhotoGallery } from "@/components/admin/PhotoGallery";

interface AdminSurveyPageProps {
  params: {
    surveyId: string;
  };
}

export default async function AdminSurveyPage({ params }: AdminSurveyPageProps) {
  const resolvedParams = params;
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  await connectDB();
  
  const user = await User.findOne({ clerkUserId: userId });
  
  if (!user || !['admin', 'moderator'].includes(user.role)) {
    redirect("/unauthorized");
  }

  // Get survey response with populated data
  const survey = await SurveyResponse.findById((await resolvedParams).surveyId)
    .populate('requestId', 'requestId applicantName')
    .populate('officerId', 'name email')
    .lean() as any;

  if (!survey) {
    notFound();
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

  // Get family members from separate collection
  const familyMembersRaw = await FamilyMember.find({ surveyId: survey._id })
    .sort({ memberIndex: 1 })
    .lean() as any[];

  // Serialize family members to plain objects
  const familyMembers = deepSerialize(familyMembersRaw.map((member: any) => ({
    ...member,
    _id: member._id.toString(),
    surveyId: member.surveyId.toString(),
    createdBy: member.createdBy?.toString(),
    lastModifiedBy: member.lastModifiedBy?.toString(),
    createdAt: member.createdAt?.toISOString(),
    updatedAt: member.updatedAt?.toISOString(),
    photos: member.photos?.map((photo: any) => ({
      url: String(photo.url || ''),
      category: String(photo.category || ''),
      description: String(photo.description || ''),
      documentType: String(photo.documentType || ''),
      publicId: String(photo.publicId || ''),
      _id: photo._id?.toString() || '',
      uploadedAt: photo.uploadedAt?.toISOString() || new Date().toISOString()
    })) || []
  })));

  // Serialize survey data completely
  const serializedSurvey = deepSerialize({
    ...survey,
    _id: survey._id.toString(),
    requestId: survey.requestId?._id ? {
      ...survey.requestId,
      _id: survey.requestId._id.toString()
    } : survey.requestId,
    officerId: survey.officerId?._id ? {
      ...survey.officerId,
      _id: survey.officerId._id.toString()
    } : survey.officerId,
    photos: survey.photos?.map((photo: any) => ({
      url: String(photo.url || ''),
      category: String(photo.category || ''),
      description: String(photo.description || ''),
      documentType: String(photo.documentType || ''),
      publicId: String(photo.publicId || ''),
      memberIndex: photo.memberIndex || 0,
      _id: photo._id?.toString() || '',
      uploadedAt: photo.uploadedAt?.toISOString() || new Date().toISOString()
    })) || [],
    familyMembers: survey.familyMembers?.map((member: any) => ({
      ...member,
      _id: member._id?.toString()
    })) || []
  });

  const request = serializedSurvey.requestId as any;
  const officer = serializedSurvey.officerId as any;

  // Calculate totals
  const totalEarnings = survey.incomeExpenses?.monthlyEarnings?.totalEarnings || 0;
  const totalExpenses = survey.incomeExpenses?.monthlyExpenses?.totalExpenses || 0;
  const netAmount = totalEarnings - totalExpenses;

  // Get assessment scores
  const scores = survey.calculatedScores;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/surveys">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Surveys
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Survey Review</h1>
            <p className="text-muted-foreground">
              Survey ID: {survey.surveyId} • Request ID: {request.requestId}
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
          
          {['draft', 'submitted', 'revision_required', 'verified'].includes(survey.status) && request?._id && (
            <Button asChild>
              <Link href={`/surveyor/survey/${request._id}`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Survey
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="members">Family Members</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="report">Officer Report</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
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
            </TabsContent>

            {/* Family Members Tab */}
            <TabsContent value="members" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Family Members ({familyMembers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {familyMembers.map((member: any) => (
                      <div key={member._id} className="border rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-semibold">{member.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {member.relationship} • {member.age} years old
                            </p>
                          </div>
                          <MemberSponsorshipPanel member={member} surveyId={serializedSurvey._id} />
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-4 mb-4">
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
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Health Status</label>
                            <p className="font-medium">{member.healthStatus}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Employment Status</label>
                            <p className="font-medium">{member.employmentStatus}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Marital Status</label>
                            <p className="font-medium">{member.maritalStatus}</p>
                          </div>
                        </div>

                        {/* Member Photos */}
                        {member.photos && member.photos.length > 0 && (
                          <div>
                            <h5 className="font-medium mb-2">Photos & Documents</h5>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {member.photos.map((photo: any, photoIndex: number) => (
                                <div key={photoIndex} className="relative group">
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
                          </div>
                        )}

                        {/* Sponsorship Status */}
                        {member.sponsorship && (
                          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Sponsorship Status</p>
                                <p className="text-sm text-muted-foreground">
                                  {member.sponsorship.availableForSponsorship ? 'Available for Sponsorship' : 'Not Available'}
                                </p>
                              </div>
                              {member.sponsorship.memberHumanId && (
                                <Badge variant="default">
                                  {member.sponsorship.memberHumanId}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Financial Tab */}
            <TabsContent value="financial" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Income & Expenses Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
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
                        <Separator />
                        <div className="flex justify-between font-medium">
                          <span>Total Earnings:</span>
                          <span>₹{totalEarnings}</span>
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
                        <Separator />
                        <div className="flex justify-between font-medium">
                          <span>Total Expenses:</span>
                          <span>₹{totalExpenses}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="text-center">
                    <div className="flex justify-center items-center gap-4">
                      <span className="text-lg font-medium">Net Amount:</span>
                      <span className={`text-2xl font-bold ${
                        netAmount >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ₹{netAmount}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {netAmount < 0 ? 'Family has a deficit' : 'Family has surplus'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Photos Tab */}
            <TabsContent value="photos">
              <PhotoGallery 
                familyPhotos={serializedSurvey.photos || []} 
                memberPhotos={familyMembers.reduce((acc: any[], member: any) => {
                  if (member.photos) {
                    acc.push(...member.photos.map((photo: any) => ({
                      ...photo,
                      memberName: member.name,
                      memberIndex: member.memberIndex
                    })));
                  }
                  return acc;
                }, [])}
              />
            </TabsContent>

            {/* Officer Report Tab */}
            <TabsContent value="report" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Officer Report & Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Housing Condition Notes</label>
                      <p className="mt-1 p-3 bg-muted/50 rounded">
                        {survey.officerReport.housingConditionNotes || 'No notes provided'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Employment Verification</label>
                      <p className="mt-1 p-3 bg-muted/50 rounded">
                        {survey.officerReport.employmentVerification || 'No verification notes'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Officer Recommendation</label>
                    <p className="mt-1 p-3 bg-muted/50 rounded">
                      {survey.officerReport.officerRecommendation || 'No recommendation provided'}
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Officer Score</label>
                      <p className="text-2xl font-bold">{survey.officerReport.officerScore}/5</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Verification Status</label>
                      <Badge variant={survey.officerReport.verificationStatus === 'verified' ? 'default' : 'secondary'}>
                        {survey.officerReport.verificationStatus}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Survey Officer</label>
                      <p className="font-medium">{officer.name}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Survey Actions */}
          <SurveyActionPanel survey={serializedSurvey} />

          {/* Assessment Scores */}
          {scores && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Assessment Scores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Financial Score:</span>
                  <span className="font-medium">{scores.financialScore}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Family Score:</span>
                  <span className="font-medium">{scores.familyScore}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Housing Score:</span>
                  <span className="font-medium">{scores.housingScore}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Officer Score:</span>
                  <span className="font-medium">{scores.officerScore}/10</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total Score:</span>
                  <span>{scores.totalScore}/40</span>
                </div>
                <div className="text-center">
                  <Badge variant={
                    scores.recommendation === 'highly_recommended' ? 'default' :
                    scores.recommendation === 'recommended' ? 'secondary' :
                    scores.recommendation === 'conditional' ? 'outline' : 'destructive'
                  }>
                    {scores.recommendation?.replace('_', ' ')}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Survey Info */}
          <Card>
            <CardHeader>
              <CardTitle>Survey Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Survey Officer</label>
                <p className="font-medium">{officer.name}</p>
                <p className="text-sm text-muted-foreground">{officer.email}</p>
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
                <label className="text-sm font-medium text-muted-foreground">Request Details</label>
                <p className="font-medium">{request.applicantName}</p>
                <p className="text-sm text-muted-foreground">{request.contactNumber}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}