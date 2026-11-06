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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Search,
  Filter,
  Calendar,
  User as UserIcon,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  TrendingUp
} from "lucide-react";

interface AdminSurveysPageProps {
  searchParams: {
    status?: string;
    category?: string;
    search?: string;
    page?: string;
  };
}

export default async function AdminSurveysPage({ searchParams }: AdminSurveysPageProps) {
  const resolvedSearchParams = await searchParams;
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  await connectDB();
  
  const user = await User.findOne({ clerkUserId: userId });
  
  if (!user || !['admin', 'moderator'].includes(user.role)) {
    redirect("/unauthorized");
  }

  // Build query based on search parameters
  const query: any = {};
  
  if (resolvedSearchParams.status) {
    query.status = resolvedSearchParams.status;
  }
  
  if (resolvedSearchParams.category && resolvedSearchParams.category !== 'all') {
    query.category = { $regex: resolvedSearchParams.category, $options: 'i' };
  }
  
  if (resolvedSearchParams.search) {
    query.$or = [
      { 'personalDetails.fullName': { $regex: resolvedSearchParams.search, $options: 'i' } },
      { 'personalDetails.contactNumber': { $regex: resolvedSearchParams.search, $options: 'i' } },
      { surveyId: { $regex: resolvedSearchParams.search, $options: 'i' } }
    ];
  }

  // Pagination
  const page = parseInt(resolvedSearchParams.page || '1');
  const limit = 20;
  const skip = (page - 1) * limit;

  // Get surveys with pagination
  const surveys = await SurveyResponse.find(query)
    .populate('requestId', 'requestId applicantName')
    .populate('officerId', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean() as any[];

  const totalSurveys = await SurveyResponse.countDocuments(query);
  const totalPages = Math.ceil(totalSurveys / limit);

  // Get statistics
  const stats = await SurveyResponse.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const statusCounts = stats.reduce((acc: any, stat: any) => {
    acc[stat._id] = stat.count;
    return acc;
  }, {});

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
      case 'approved':
        return 'default';
      case 'submitted':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      case 'revision_required':
        return 'outline';
      case 'draft':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
      case 'approved':
        return CheckCircle2;
      case 'rejected':
        return XCircle;
      case 'revision_required':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Survey Management</h1>
          <p className="text-muted-foreground">
            Review and manage submitted surveys
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Surveys</p>
                <p className="text-2xl font-bold">{totalSurveys}</p>
              </div>
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{statusCounts.submitted || 0}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{statusCounts.verified || 0}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold">{statusCounts.rejected || 0}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search surveys..."
                defaultValue={resolvedSearchParams.search}
                name="search"
              />
            </div>
            <div>
              <Select defaultValue={resolvedSearchParams.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="verified">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="revision_required">Revision Required</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select defaultValue={resolvedSearchParams.category}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="category_1">Category 1</SelectItem>
                  <SelectItem value="category_2">Category 2</SelectItem>
                  <SelectItem value="category_3">Category 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button className="w-full">
                <Search className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Surveys Table */}
      <Card>
        <CardHeader>
          <CardTitle>Surveys ({totalSurveys})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Survey ID</TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Officer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {surveys.map((survey: any) => {
                  const StatusIcon = getStatusIcon(survey.status);
                  return (
                    <TableRow key={survey._id}>
                      <TableCell className="font-medium">
                        {survey.surveyId}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{survey.personalDetails.fullName}</p>
                          <p className="text-sm text-muted-foreground">
                            {survey.personalDetails.contactNumber}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserIcon className="w-4 h-4" />
                          <span className="text-sm">{survey.officerId?.name || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(survey.status)} className="flex items-center gap-1 w-fit">
                          <StatusIcon className="w-3 h-3" />
                          {survey.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {survey.category ? (
                          <Badge variant="outline">
                            {survey.category.replace(/_/g, ' ')}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            {survey.submittedAt 
                              ? new Date(survey.submittedAt).toLocaleDateString()
                              : new Date(survey.createdAt).toLocaleDateString()
                            }
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {survey.calculatedScores ? (
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            <span className="font-medium">
                              {survey.calculatedScores.totalScore}/40
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/surveys/${survey._id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            Review
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Showing {skip + 1} to {Math.min(skip + limit, totalSurveys)} of {totalSurveys} surveys
              </p>
              <div className="flex gap-2">
                {page > 1 && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`?page=${page - 1}`}>
                      Previous
                    </Link>
                  </Button>
                )}
                {page < totalPages && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`?page=${page + 1}`}>
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