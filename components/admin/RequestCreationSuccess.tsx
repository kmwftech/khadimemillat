"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, User, Clock, MapPin, Phone, FileText, Users, Plus, RotateCcw, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CreatedRequest {
  id: string;
  userId: string;
  userName: string;
  userAddress: string;
  userPhone: string;
  pickupTime: Date;
  status: 'verified';
  items?: string;
  notes?: string;
  scrapperNotificationsSent: number;
}

interface RequestCreationSuccessProps {
  request: CreatedRequest;
  onCreateAnother: () => void;
  onCreateForDifferentUser: () => void;
  onClose: () => void;
  className?: string;
}

export const RequestCreationSuccess: React.FC<RequestCreationSuccessProps> = ({
  request,
  onCreateAnother,
  onCreateForDifferentUser,
  onClose,
  className,
}) => {
  const formatPickupTime = (date: Date) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(new Date(date));
    } catch (error) {
      console.error('Error formatting pickup time:', error);
      return new Date(date).toLocaleString();
    }
  };

  // Validate request data to prevent display errors
  if (!request || !request.id) {
    return (
      <Card className={cn("w-full max-w-2xl mx-auto border-destructive/20 bg-destructive/5", className)}>
        <CardContent className="py-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <p className="text-destructive font-medium">Error displaying request details</p>
          <p className="text-sm text-muted-foreground mt-2">
            The request was created but there was an error displaying the details.
          </p>
          <Button
            variant="outline"
            onClick={onClose}
            className="mt-4"
          >
            Close
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full max-w-2xl mx-auto", className)}>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <CardTitle className="text-2xl text-green-700 dark:text-green-400">
          Collection Request Created Successfully!
        </CardTitle>
        <CardDescription>
          The collection request has been created and scrappers have been notified.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Request Information Display */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Request Details
          </h3>

          <div className="grid gap-4">
            {/* Request ID */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Request ID</span>
              </div>
              <code className="text-sm bg-background px-2 py-1 rounded border">
                {request.id}
              </code>
            </div>

            {/* User Name */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">User</span>
              </div>
              <span className="text-sm">{request.userName}</span>
            </div>

            {/* Pickup Time */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Pickup Time</span>
              </div>
              <span className="text-sm font-mono">
                {formatPickupTime(request.pickupTime)}
              </span>
            </div>

            {/* Address */}
            <div className="flex items-start justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="font-medium">Address</span>
              </div>
              <span className="text-sm text-right max-w-xs">{request.userAddress}</span>
            </div>

            {/* Phone */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Phone</span>
              </div>
              <span className="text-sm">{request.userPhone}</span>
            </div>

            {/* Items */}
            {request.items && (
              <div className="flex items-start justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="font-medium">Items</span>
                </div>
                <span className="text-sm text-right max-w-xs">{request.items}</span>
              </div>
            )}

            {/* Notes */}
            {request.notes && (
              <div className="flex items-start justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="font-medium">Notes</span>
                </div>
                <span className="text-sm text-right max-w-xs">{request.notes}</span>
              </div>
            )}

            {/* Status */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Status</span>
              </div>
              <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Verified
              </Badge>
            </div>

            {/* Scrappers Notified */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Scrappers Notified</span>
              </div>
              <Badge variant="secondary">
                {request.scrapperNotificationsSent} scrappers
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Next Steps */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Next Steps</h3>
          <p className="text-sm text-muted-foreground">
            The collection request has been successfully created and verified. 
            {request.scrapperNotificationsSent > 0 
              ? ` ${request.scrapperNotificationsSent} scrappers have been notified and can now view this request.`
              : " No scrappers were available to notify at this time."
            }
          </p>

          <div className="space-y-3">
            <div className="flex gap-3">
              <Button
                onClick={onCreateAnother}
                className="flex-1"
                size="lg"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Another Request
              </Button>
              <Button
                variant="outline"
                onClick={onCreateForDifferentUser}
                size="lg"
                className="flex-1"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Different User
              </Button>
            </div>

            <Button
              variant="ghost"
              onClick={onClose}
              size="sm"
              className="w-full"
            >
              <X className="mr-2 h-4 w-4" />
              Close
            </Button>
          </div>
        </div>

        {/* Status Information */}
        <div className="space-y-3">
          <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-green-100 dark:bg-green-900 p-1">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                  Request Verified & Active
                </p>
                <p className="text-xs text-green-700 dark:text-green-300">
                  This request has been automatically verified and is now visible to scrappers. 
                  They can assign themselves to collect the items at the scheduled time.
                </p>
              </div>
            </div>
          </div>

          {request.scrapperNotificationsSent > 0 ? (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-1">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Scrappers Notified
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    {request.scrapperNotificationsSent} scrappers have been notified about this new collection request 
                    and can now view it in their assigned requests dashboard.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-1">
                  <Users className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                    No Scrappers Available
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    No scrappers were available to notify at this time. The request is still active 
                    and scrappers will see it when they check their dashboard.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestCreationSuccess;