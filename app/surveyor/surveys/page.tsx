import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import User from "@/models/User";
import SurveyResponse from "@/models/SurveyResponse";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import {
  Eye,
  Edit,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  ArrowLeft,
  TrendingUp,
  RotateCcw
} from "lucide-react";

interface SurveyorSurveysPageProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function SurveyorSurveysPage({ searchParams }: SurveyorSurveysPageProps) {
  const resolvedSearchParams = await searchParams;
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  await connectDB();

  let user = await User.findOne({ clerkUserId: userId });

  if (!user) {
    const { clerkClient } = await import("@clerk/nextjs/server");
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);

    user = await User.create({
      clerkUserId: userId,
      name: clerkUser.firstName && clerkUser.lastName
        ? `${clerkUser.firstName} ${clerkUser.lastName}`
        : (clerkUser.username || "Surveyor"),
      email: clerkUser.emailAddresses?.[0]?.emailAddress,
      role: "surveyor"
    });
  }

  const { sessionClaims } = await auth();
  const userRole = (sessionClaims?.metadata as { role?: string } | undefined)?.role || user.role;

  const isAdminOrModerator = ["admin", "moderator"].includes(userRole);

  // Build query
  const query: any = {};

  // If regular surveyor, only show their own surveys
  if (!isAdminOrModerator) {
    query.officerId = user._id;
  }

  if (resolvedSearchParams.status && resolvedSearchParams.status !== "all") {
    query.status = resolvedSearchParams.status;
  }

  if (resolvedSearchParams.search) {
    const searchRegex = { $regex: resolvedSearchParams.search, $options: "i" };
    query.$or = [
      { "personalDetails.fullName": searchRegex },
      { "personalDetails.contactNumber": searchRegex },
      { surveyId: searchRegex }
    ];
  }

  // Pagination
  const page = parseInt(resolvedSearchParams.page || "1", 10);
  const limit = 20;
  const skip = (page - 1) * limit;

  const [surveys, totalSurveys, stats] = await Promise.all([
    SurveyResponse.find(query)
      .populate("requestId", "requestId applicantName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean() as Promise<any[]>,
    SurveyResponse.countDocuments(query),
    SurveyResponse.aggregate([
      { $match: isAdminOrModerator ? {} : { officerId: user._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ])
  ]);

  const totalPages = Math.max(1, Math.ceil(totalSurveys / limit));

  const statusCounts = stats.reduce((acc: any, stat: any) => {
    acc[stat._id] = stat.count;
    return acc;
  }, {});

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
      case "approved":
        return "default";
      case "submitted":
        return "secondary";
      case "rejected":
        return "destructive";
      case "revision_required":
      case "draft":
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
      case "approved":
        return CheckCircle2;
      case "rejected":
        return XCircle;
      case "revision_required":
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "draft", label: "Draft" },
    { value: "submitted", label: "Submitted" },
    { value: "verified", label: "Approved / Verified" },
    { value: "revision_required", label: "Revision Required" },
    { value: "rejected", label: "Rejected" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/surveyor">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Past Surveys</h1>
            <p className="text-muted-foreground">
              {isAdminOrModerator
                ? "Browse, filter and review all field surveys"
                : "Browse and review all surveys submitted by you"}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Surveys</p>
              <p className="text-2xl font-bold">{totalSurveys}</p>
            </div>
            <FileText className="w-6 h-6 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">In Progress (Draft)</p>
              <p className="text-2xl font-bold">{statusCounts.draft || 0}</p>
            </div>
            <Clock className="w-6 h-6 text-blue-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Submitted</p>
              <p className="text-2xl font-bold">{statusCounts.submitted || 0}</p>
            </div>
            <Clock className="w-6 h-6 text-yellow-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Verified / Approved</p>
              <p className="text-2xl font-bold">{(statusCounts.verified || 0) + (statusCounts.approved || 0)}</p>
            </div>
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form method="GET" className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Input
                name="search"
                placeholder="Search by name, phone or survey ID..."
                defaultValue={resolvedSearchParams.search || ""}
              />
            </div>
            <div>
              <select
                name="status"
                defaultValue={resolvedSearchParams.status || "all"}
                className="w-full h-10 px-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                <Search className="w-4 h-4 mr-2" />
                Apply
              </Button>
              {(resolvedSearchParams.search || resolvedSearchParams.status) && (
                <Button variant="outline" asChild>
                  <Link href="/surveyor/surveys">
                    <RotateCcw className="w-4 h-4" />
                  </Link>
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Surveys Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Surveys ({totalSurveys})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {surveys.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No surveys found</p>
              <p className="text-sm">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Survey ID</TableHead>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {surveys.map((survey: any) => {
                    const StatusIcon = getStatusIcon(survey.status);
                    const isEditable = survey.status === "draft" || survey.status === "submitted";
                    const requestIdStr = survey.requestId?._id
                      ? survey.requestId._id.toString()
                      : survey.requestId?.toString();

                    return (
                      <TableRow key={survey._id.toString()}>
                        <TableCell className="font-medium">
                          {survey.surveyId}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{survey.personalDetails?.fullName || "N/A"}</p>
                            <p className="text-xs text-muted-foreground">
                              {survey.personalDetails?.contactNumber || ""}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(survey.status)} className="flex items-center gap-1 w-fit">
                            <StatusIcon className="w-3 h-3" />
                            {survey.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>
                              {new Date(survey.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {survey.calculatedScores?.totalScore !== undefined ? (
                            <div className="flex items-center gap-1 text-sm font-medium">
                              <TrendingUp className="w-3.5 h-3.5 text-primary" />
                              <span>{survey.calculatedScores.totalScore}/40</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {isEditable && requestIdStr && (
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/surveyor/survey/${requestIdStr}`}>
                                  <Edit className="w-3.5 h-3.5 mr-1" />
                                  Edit
                                </Link>
                              </Button>
                            )}
                            <Button size="sm" asChild>
                              <Link href={`/surveyor/survey/view/${survey._id.toString()}`}>
                                <Eye className="w-3.5 h-3.5 mr-1" />
                                View
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Showing {skip + 1} to {Math.min(skip + limit, totalSurveys)} of {totalSurveys}
              </p>
              <div className="flex gap-2">
                {page > 1 && (
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/surveyor/surveys?page=${page - 1}${
                        resolvedSearchParams.status ? `&status=${resolvedSearchParams.status}` : ""
                      }${resolvedSearchParams.search ? `&search=${encodeURIComponent(resolvedSearchParams.search)}` : ""}`}
                    >
                      Previous
                    </Link>
                  </Button>
                )}
                {page < totalPages && (
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/surveyor/surveys?page=${page + 1}${
                        resolvedSearchParams.status ? `&status=${resolvedSearchParams.status}` : ""
                      }${resolvedSearchParams.search ? `&search=${encodeURIComponent(resolvedSearchParams.search)}` : ""}`}
                    >
                      Next
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

