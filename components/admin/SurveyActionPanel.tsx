'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  CreditCard,
  Settings,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { useState as useReactState, useEffect } from 'react';

interface SurveyActionPanelProps {
  survey: any;
}

export function SurveyActionPanel({ survey }: SurveyActionPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState('');
  const [category, setCategory] = useState<string>('');
  const [surveyCategories, setSurveyCategories] = useReactState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useReactState(true);

  // Fetch survey categories
  useEffect(() => {
    const fetchSurveyCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await fetch('/api/admin/categories?type=survey');
        
        if (response.ok) {
          const data = await response.json();
          setSurveyCategories(data.categories || []);
        } else {
          console.error('Failed to fetch survey categories');
          setSurveyCategories([]);
        }
      } catch (error) {
        console.error('Error fetching survey categories:', error);
        setSurveyCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchSurveyCategories();
  }, []);

  const handleSurveyAction = async (action: 'approve' | 'reject' | 'request_revision') => {
    if (!comments.trim()) {
      toast.error('Please provide comments for this action');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/surveys/${survey._id}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          comments,
          category: action === 'approve' ? category : undefined
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update survey status');
      }

      const result = await response.json();
      toast.success(result.message);
      
      // Refresh the page to show updated status
      window.location.reload();
    } catch (error: any) {
      console.error('Error updating survey:', error);
      toast.error(error.message || 'Failed to update survey status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReliefCardAssignment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/surveys/${survey._id}/relief-card`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comments
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to assign relief card');
      }

      const result = await response.json();
      toast.success(result.message);
      
      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error('Error assigning relief card:', error);
      toast.error('Failed to assign relief card');
    } finally {
      setIsLoading(false);
    }
  };

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
      default:
        return 'outline';
    }
  };

  const canTakeAction = survey.status === 'submitted';
  const isApproved = survey.status === 'verified' || survey.status === 'approved';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Survey Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="text-center">
          <Badge variant={getStatusColor(survey.status)} className="mb-2">
            {survey.status.replace('_', ' ').toUpperCase()}
          </Badge>
          <p className="text-sm text-muted-foreground">
            Current survey status
          </p>
        </div>

        {/* Action Buttons */}
        {canTakeAction && (
          <div className="space-y-3">
            {/* Approve Survey */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full" variant="default">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Approve Survey
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Approve Survey</DialogTitle>
                  <DialogDescription>
                    Approve this survey and assign it to a category for further processing.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="category">Assign Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesLoading ? (
                          <SelectItem value="" disabled>Loading categories...</SelectItem>
                        ) : surveyCategories.length === 0 ? (
                          <SelectItem value="" disabled>No categories available</SelectItem>
                        ) : (
                          surveyCategories.map((cat) => (
                            <SelectItem key={cat.slug} value={cat.slug}>
                              {cat.label}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="comments">Approval Comments</Label>
                    <Textarea
                      id="comments"
                      placeholder="Add comments about the approval decision..."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => handleSurveyAction('approve')}
                    disabled={isLoading || !category || !comments.trim()}
                  >
                    {isLoading ? 'Processing...' : 'Approve Survey'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Request Revision */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full" variant="outline">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Request Revision
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Survey Revision</DialogTitle>
                  <DialogDescription>
                    Request changes or additional information for this survey.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="revision-comments">Revision Requirements</Label>
                    <Textarea
                      id="revision-comments"
                      placeholder="Specify what needs to be revised or added..."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => handleSurveyAction('request_revision')}
                    disabled={isLoading || !comments.trim()}
                    variant="outline"
                  >
                    {isLoading ? 'Processing...' : 'Request Revision'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Reject Survey */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full" variant="destructive">
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Survey
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reject Survey</DialogTitle>
                  <DialogDescription>
                    Reject this survey. This action will close the case permanently.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="rejection-comments">Rejection Reason</Label>
                    <Textarea
                      id="rejection-comments"
                      placeholder="Provide detailed reason for rejection..."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => handleSurveyAction('reject')}
                    disabled={isLoading || !comments.trim()}
                    variant="destructive"
                  >
                    {isLoading ? 'Processing...' : 'Reject Survey'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Post-Approval Actions */}
        {isApproved && (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-medium text-sm">Post-Approval Actions</h4>
            
            {/* Assign Relief Card */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full" variant="outline" size="sm">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Assign Relief Card
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign Relief Card</DialogTitle>
                  <DialogDescription>
                    Assign a relief card to this family for ongoing support.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="relief-comments">Assignment Notes</Label>
                    <Textarea
                      id="relief-comments"
                      placeholder="Add notes about relief card assignment..."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleReliefCardAssignment}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Assign Relief Card'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Generate Report */}
            <Button className="w-full" variant="outline" size="sm" asChild>
              <a href={`/api/admin/surveys/${survey._id}/report`} target="_blank">
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </a>
            </Button>
          </div>
        )}

        {/* Survey History */}
        <div className="pt-4 border-t">
          <h4 className="font-medium text-sm mb-2">Recent Actions</h4>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3" />
              <span>Survey submitted on {new Date(survey.submittedAt).toLocaleDateString()}</span>
            </div>
            {survey.lastModified && (
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                <span>Last modified on {new Date(survey.lastModified).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}