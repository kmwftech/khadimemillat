import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import User from "@/models/User";
import SponsorshipRequest from "@/models/SponsorshipRequest";
import SurveyResponse from "@/models/SurveyResponse";
import { SurveyForm } from "@/components/sponsorship/SurveyForm";

interface PageProps {
  params: Promise<{
    requestId: string;
  }>;
}

export default async function SurveyPage({ params }: PageProps) {
  const { requestId } = await params;
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  await connectDB();
  
  // Get user from MongoDB (create if doesn't exist for Clerk-only users)
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
        : (clerkUser.username || 'User'),
      email: clerkUser.emailAddresses?.[0]?.emailAddress,
      role: 'surveyor' // Default role for surveyors
    });
  }

  // Get the sponsorship request
  const request = await SponsorshipRequest.findById(requestId);
  
  if (!request) {
    redirect("/surveyor");
  }

  // Get user role from Clerk (primary source of truth)
  const { sessionClaims } = await auth();
  const userRole = (sessionClaims?.metadata as { role?: string } | undefined)?.role;

  // Check if user is assigned to this request or has admin/moderator role
  // The assignedOfficer could be either a MongoDB ObjectId or a Clerk user ID
  const isAssignedOfficer = 
    request.assignedOfficer?.toString() === user._id?.toString() || // MongoDB ObjectId comparison
    request.assignedOfficer?.toString() === userId; // Clerk user ID comparison
  const isAdminOrModerator = ['admin', 'moderator'].includes(userRole || '') || ['admin', 'moderator'].includes(user.role);
  const hasAdminAccess = ['admin', 'moderator', 'surveyor'].includes(userRole || '') || ['admin', 'moderator', 'surveyor'].includes(user.role);
  
  if (!isAssignedOfficer && !hasAdminAccess) {
    redirect("/unauthorized");
  }

  // Check if survey already exists
  // For admins/moderators, find the survey associated with this request regardless of officerId
  const existingSurvey = await SurveyResponse.findOne(
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

  const officerIdToUse = existingSurvey?.officerId 
    ? existingSurvey.officerId.toString() 
    : user._id.toString();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {existingSurvey ? "Update Survey" : "Field Survey"}
        </h1>
        <p className="text-muted-foreground">
          {existingSurvey 
            ? `Update survey details for ${request.applicantName}` 
            : `Complete the detailed survey for ${request.applicantName}`}
        </p>
      </div>

      <SurveyForm 
        request={JSON.parse(JSON.stringify(request))}
        existingSurvey={existingSurvey ? JSON.parse(JSON.stringify(existingSurvey)) : null}
        officerId={officerIdToUse}
      />
    </div>
  );
}