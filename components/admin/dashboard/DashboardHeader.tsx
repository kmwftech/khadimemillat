"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw, TrendingUp, ClipboardCheck, LayoutGrid } from 'lucide-react'
import Link from 'next/link'
import { DashboardStats } from '@/types/dashboard'
import DashboardStatsComponent from './DashboardStats'
import { RESPONSIVE_CLASSES, TOUCH_TARGETS } from '@/lib/utils/responsive'
import { generateAriaLabel } from '@/lib/utils/accessibility'

interface DashboardHeaderProps {
  stats: DashboardStats
  onRefresh: () => void
  loading: boolean
  refreshing: boolean
}

export default function DashboardHeader({ 
  stats, 
  onRefresh, 
  loading, 
  refreshing 
}: DashboardHeaderProps) {
  return (
    <header className="space-y-4 md:space-y-6 animate-fade-in-up" role="banner">
      {/* Header with title and refresh button - Responsive layout */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex-1 min-w-0 animate-slide-in-up">
          <div className="flex items-center space-x-2">
            <TrendingUp 
              className="h-6 w-6 text-blue-600 flex-shrink-0 animate-heartbeat" 
              aria-hidden="true"
            />
            <h1 
              className={`font-semibold text-gray-900 dark:text-gray-100 truncate ${RESPONSIVE_CLASSES.text.heading} transition-colors duration-200`}
              id="dashboard-title"
            >
              Admin Dashboard
            </h1>
          </div>
          <p 
            className={`text-gray-600 dark:text-gray-400 mt-1 ${RESPONSIVE_CLASSES.text.body} transition-colors duration-200`}
            id="dashboard-description"
            aria-describedby="dashboard-title"
          >
            Manage donations and marketplace items
          </p>
        </div>
        
        {/* Header actions with responsive sizing */}
        <div className="flex items-center gap-2 flex-wrap animate-slide-in-down" style={{ animationDelay: '100ms' }}>
          <Button
            variant="outline"
            size="sm"
            asChild
            className={`${TOUCH_TARGETS.comfortable} button-press hover-lift transition-all duration-200`}
          >
            <Link href="/admin/surveys" className="flex items-center gap-1.5">
              <ClipboardCheck className="h-4 w-4 text-primary" />
              <span>Surveys</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            asChild
            className={`${TOUCH_TARGETS.comfortable} button-press hover-lift transition-all duration-200`}
          >
            <Link href="/admin/navigation" className="flex items-center gap-1.5">
              <LayoutGrid className="h-4 w-4 text-muted-foreground" />
              <span className="hidden sm:inline">All Tools</span>
            </Link>
          </Button>

          <Button
            onClick={onRefresh}
            disabled={loading || refreshing}
            variant="outline"
            size="sm"
            className={`
              flex items-center gap-2 ${TOUCH_TARGETS.comfortable} 
              button-press hover-lift transition-all duration-200 
              ${refreshing ? 'animate-pulse' : ''}
              focus-ring
            `}
            aria-label={refreshing ? 'Refreshing dashboard data' : 'Refresh dashboard data'}
            aria-describedby="dashboard-description"
          >
            <RefreshCw 
              className={`h-4 w-4 transition-transform duration-300 ${refreshing ? 'animate-spin' : 'hoact:rotate-180'}`} 
              aria-hidden="true"
            />
            <span className="hidden sm:inline transition-opacity duration-200">
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </span>
            <span className="sr-only">
              {refreshing ? 'Refreshing dashboard data' : 'Refresh dashboard data'}
            </span>
          </Button>
        </div>
      </div>
      
      {/* Dashboard statistics with responsive layout */}
      <section 
        className="w-full animate-fade-in-up" 
        style={{ animationDelay: '200ms' }}
        aria-labelledby="dashboard-stats-heading"
      >
        <h2 id="dashboard-stats-heading" className="sr-only">
          Dashboard Statistics
        </h2>
        <DashboardStatsComponent stats={stats} loading={loading} />
      </section>
    </header>
  )
}