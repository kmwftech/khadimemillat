import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import User from "@/models/User";
import SponsorshipRequest from "@/models/SponsorshipRequest";
import SurveyResponse from "@/models/SurveyResponse";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  Phone
} from "lucide-react";

export default async function SurveyorDashboard() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  await connectDB();
  
  let user = await User.findOne({ clerkUserId: userId });

  // If user doesn't exist in MongoDB, create them
  if (!user) {
    const { clerkClient } = await import('@clerk/nextjs/server');
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);

    user = await User.create({
      clerkUserId: userId,
      name: clerkUser.firstName && clerkUser.lastName 
        ? `${clerkUser.firstName} ${clerkUser.lastName}` 
        : (clerkUser.username || 'Surveyor'),
      email: clerkUser.emailAddresses?.[0]?.emailAddress,
      role: 'surveyor'
    });
  }

  // Get assigned requests (handle both Clerk userId string and Mongo ObjectId)
  const assignedRequests = await SponsorshipRequest.find({
    $or: [
      { assignedOfficer: user._id.toString() },
      { assignedOfficer: user._id },
      { assignedOfficer: userId }
    ],
    status: 'assigned'
  }).sort({ priority: -1, createdAt: -1 });

  // Get completed surveys
  const completedSurveys = await SurveyResponse.find({
    officerId: user._id
  }).populate('requestId').sort({ createdAt: -1 }).limit(10);

  // Get statistics
  const stats = {
    pending: assignedRequests.length,
    completed: await SurveyResponse.countDocuments({ 
      officerId: user._id, 
      status: { $in: ['submitted', 'verified', 'approved'] } 
    }),
    inProgress: await SurveyResponse.countDocuments({ officerId: user._id, status: 'draft' }),
    thisMonth: await SurveyResponse.countDocuments({
      officerId: user._id,
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    })
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Surveyor Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.name}. Manage your assigned surveys and field visits.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Surveys</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <ClipboardList className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">{stats.thisMonth}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assigned Requests */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Assigned Requests ({assignedRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {assignedRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No pending surveys assigned</p>
              </div>
            ) : (
              <div className="space-y-4">
                {assignedRequests.map((request) => (
                  <div key={(request._id as any).toString()} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{request.applicantName}</h4>
                        <p className="text-sm text-muted-foreground">
                          Father: {request.fatherName}
                        </p>
                      </div>
                      <Badge variant={
                        request.priority === 'urgent' ? 'destructive' :
                        request.priority === 'high' ? 'default' :
                        request.priority === 'medium' ? 'secondary' : 'outline'
                      }>
                        {request.priority}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Phone className="w-4 h-4" />
                      <span>{request.contactInfo.phone}</span>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-3">
                      <p className="truncate">Reason: {request.basicRequest?.reasonForRequest}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" asChild>
                        <Link href={`/surveyor/survey/${request._id}`}>
                          Start Survey
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/surveyor/request/${request._id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Surveys */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Recent Surveys
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/surveyor/surveys">
                View All Surveys
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {completedSurveys.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No surveys completed yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedSurveys.map((survey) => {
                  const requestIdStr = survey.requestId?._id 
                    ? survey.requestId._id.toString() 
                    : survey.requestId?.toString();

                  return (
                    <div key={survey._id.toString()} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{survey.personalDetails?.fullName || 'N/A'}</h4>
                          <p className="text-sm text-muted-foreground">
                            Survey ID: {survey.surveyId}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {(survey.status === 'draft' || survey.status === 'submitted') && (
                            <Badge variant="outline" className="text-blue-600 border-blue-600">
                              Editable
                            </Badge>
                          )}
                          <Badge variant={
                            survey.status === 'verified' ? 'default' :
                            survey.status === 'submitted' ? 'secondary' :
                            survey.status === 'rejected' ? 'destructive' : 'outline'
                          }>
                            {survey.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(survey.createdAt).toLocaleDateString()}</span>
                      </div>

                      <div className="flex gap-2">
                        {(survey.status === 'draft' || survey.status === 'submitted') && requestIdStr && (
                          <Button size="sm" asChild>
                            <Link href={`/surveyor/survey/${requestIdStr}`}>
                              Edit Survey
                            </Link>
                          </Button>
                        )}
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/surveyor/survey/view/${survey._id.toString()}`}>
                            View Survey
                          </Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}