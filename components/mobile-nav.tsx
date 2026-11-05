"use client"

import * as React from "react"
import {
    UserCircle,
    UserCog2 as UserCog2Icon,
    User as UserIcon,
    Bell as BellIcon,
    ClipboardCheck,
    Truck,
    FileCheck,
    List as ListIcon,
    Heart,
    LayoutDashboard,
    List,
    Plus,
    HandHeart,
    Store,
    Target,
    BellDot,
    MessageSquare,
    ScanLine as Scan,
    ShoppingBag,
    Info,
    Image as ImageIcon,
    Menu,
    HeartPlus,
    BookOpenCheck,
    ChartNoAxesGantt,
    HandCoins
} from 'lucide-react'

import Link from "next/link"
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { TeamSwitcher } from "./team-switcher"
import ProfilePopover from "./profile-dropdown"
import RoleGuard from "./role-guard"

export function MobileNav() {
    const [open, setOpen] = React.useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 md:h-6 md:w-6"
                    suppressHydrationWarning
                >
                    <Menu className="scale-180 h-10 w-10 md:h-5 md:w-5" />
                </Button>
                {/* <span className="sr-only">Toggle navigation menu</span> */}
                {/* <Button variant="ghost" className="text-lg">
                </Button> */}
            </SheetTrigger>
            <SheetContent side="left" className="w-70 p-0">
                <SheetHeader className="border-b p-4">
                    <SheetTitle />
                    <SheetDescription />
                    <TeamSwitcher />
                </SheetHeader>

                <div className="flex-1 overflow-auto p-4">
                    {/* Admin Section */}
                    <RoleGuard allowedRoles={["admin", "moderator"]}>
                        <div className="mb-6">
                            <h3 className="mb-2 px-2 text-sm font-semibold text-muted-foreground">Admin</h3>
                            <div className="space-y-1">
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <LayoutDashboard className="h-4 w-4" />
                                    Dashboard
                                </Link>
                                <Link
                                    href="/admin/navigation"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <ChartNoAxesGantt className="h-4 w-4" />
                                    All Admin Tools
                                </Link>

                                {/* Core Management */}
                                <div className="mt-3 mb-2">
                                    <p className="px-2 text-xs font-medium text-muted-foreground">CORE MANAGEMENT</p>
                                </div>
                                <Link
                                    href="/admin/manage-users"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <UserCog2Icon className="h-4 w-4" />
                                    Manage Users
                                </Link>
                                <Link
                                    href="/admin/categories"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <ChartNoAxesGantt className="h-4 w-4" />
                                    Categories
                                </Link>

                                {/* Request Management */}
                                <div className="mt-3 mb-2">
                                    <p className="px-2 text-xs font-medium text-muted-foreground">REQUESTS & SURVEYS</p>
                                </div>
                                <Link
                                    href="/admin/verify-requests"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <ClipboardCheck className="h-4 w-4" />
                                    Verify Requests
                                </Link>
                                <Link
                                    href="/admin/requests"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <FileCheck className="h-4 w-4" />
                                    All Requests
                                </Link>
                                <Link
                                    href="/admin/surveys"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <ClipboardCheck className="h-4 w-4" />
                                    Survey Management
                                </Link>
                                <Link
                                    href="/admin/sponsorship"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <UserIcon className="h-4 w-4" />
                                    Sponsorship
                                </Link>

                                {/* Collection Management */}
                                <div className="mt-3 mb-2">
                                    <p className="px-2 text-xs font-medium text-muted-foreground">COLLECTIONS</p>
                                </div>
                                <Link
                                    href="/admin/create-collection-request"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <Plus className="h-4 w-4" />
                                    Create Collection
                                </Link>
                                <Link
                                    href="/list-donation"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <ListIcon className="h-4 w-4" />
                                    List Donations
                                </Link>
                                <Link
                                    href="/admin/items"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <ShoppingBag className="h-4 w-4" />
                                    Items Management
                                </Link>

                                {/* Financial */}
                                <div className="mt-3 mb-2">
                                    <p className="px-2 text-xs font-medium text-muted-foreground">FINANCIAL</p>
                                </div>
                                <Link
                                    href="/admin/money-donations"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <Heart className="h-4 w-4" />
                                    Money Donations
                                </Link>
                                <Link
                                    href="/admin/sadqa-subscription"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <Heart className="h-4 w-4" />
                                    Recurring Donations
                                </Link>
                                <Link
                                    href="/admin/membership-requests"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <UserIcon className="h-4 w-4" />
                                    Membership Requests
                                </Link>
                                <Link
                                    href="/admin/financial-documents"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <FileCheck className="h-4 w-4" />
                                    Financial Documents
                                </Link>
                                <Link
                                    href="/cash-intake"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <HandCoins className="h-4 w-4" />
                                    Offline Donation
                                </Link>
                                <Link
                                    href="/cash-intake/list"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <List className="h-4 w-4" />
                                    List Offline Donation
                                </Link>
                                {/* Programs */}
                                <div className="mt-3 mb-2">
                                    <p className="px-2 text-xs font-medium text-muted-foreground">PROGRAMS</p>
                                </div>
                                <Link
                                    href="/admin/welfare-programs"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <HandHeart className="h-4 w-4" />
                                    Welfare Programs
                                </Link>
                                <Link
                                    href="/admin/campaigns"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <Target className="h-4 w-4" />
                                    Campaigns
                                </Link>
                                <Link
                                    href="/admin/gullak"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <Store className="h-4 w-4" />
                                    Neki Bank (Gullak)
                                </Link>
                                <Link
                                    href="/admin/activities"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <ImageIcon className="h-4 w-4" />
                                    Activities
                                </Link>

                                {/* Communication */}
                                <div className="mt-3 mb-2">
                                    <p className="px-2 text-xs font-medium text-muted-foreground">COMMUNICATION</p>
                                </div>
                                <Link
                                    href="/admin/notifications"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <BellDot className="h-4 w-4" />
                                    Notifications
                                </Link>
                            </div>
                        </div>
                    </RoleGuard>

                    {/* Gullak Caretaker Section */}
                    <RoleGuard allowedRoles={["gullak_caretaker", "admin"]}>
                        <div className="mb-6">
                            <h3 className="mb-2 px-2 text-sm font-semibold text-muted-foreground">Gullak Caretaker</h3>
                            <div className="space-y-1">
                                <Link
                                    href="/gullak-caretaker"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <Store className="h-4 w-4" />
                                    My Gullaks
                                </Link>
                                <Link
                                    href="/programs/golak-map"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <HandCoins className="h-4 w-4" />
                                    Gullak Map
                                </Link>
                            </div>
                        </div>
                    </RoleGuard>

                    {/* Neki Bank Manager Section */}
                    <RoleGuard allowedRoles={["neki_bank_manager", "admin"]}>
                        <div className="mb-6">
                            <h3 className="mb-2 px-2 text-sm font-semibold text-muted-foreground">Neki Bank Manager</h3>
                            <div className="space-y-1">
                                <Link
                                    href="/admin/gullak"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <Store className="h-4 w-4" />
                                    Manage Gullaks
                                </Link>
                                <Link
                                    href="/programs/golak-map"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <HandCoins className="h-4 w-4" />
                                    Gullak Map
                                </Link>
                            </div>
                        </div>
                    </RoleGuard>

                    {/* Field Executive Section */}
                    <RoleGuard allowedRoles={["field_executive", "admin"]}>
                        <div className="mb-6">
                            <h3 className="mb-2 px-2 text-sm font-semibold text-muted-foreground">Field Executive</h3>
                            <div className="space-y-1">
                                <Link
                                    href="/field-executive/assigned"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <Truck className="h-4 w-4" />
                                    Assigned
                                </Link>
                                <Link
                                    href="/list-donation"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <ListIcon className="h-4 w-4" />
                                    List Donation
                                </Link>
                            </div>
                        </div>
                    </RoleGuard>

                    {/* Surveyor Section */}
                    <RoleGuard allowedRoles={["surveyor", "admin"]}>
                        <div className="mb-6">
                            <h3 className="mb-2 px-2 text-sm font-semibold text-muted-foreground">Surveyor</h3>
                            <div className="space-y-1">
                                <Link
                                    href="/surveyor"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <ClipboardCheck className="h-4 w-4" />
                                    Dashboard
                                </Link>
                                <Link
                                    href="/surveyor/surveys"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <FileCheck className="h-4 w-4" />
                                    Past Surveys
                                </Link>
                            </div>
                        </div>
                    </RoleGuard>

                    {/* Moderator Section */}
                    <RoleGuard allowedRoles={["moderator", "admin"]}>
                        <div className="mb-6">
                            <h3 className="mb-2 px-2 text-sm font-semibold text-muted-foreground">Moderator</h3>
                            <div className="space-y-1">
                                <Link
                                    href="/moderator/review"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <FileCheck className="h-4 w-4" />
                                    Review Items
                                </Link>
                                <Link
                                    href="/admin/surveys"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <ClipboardCheck className="h-4 w-4" />
                                    Review Surveys
                                </Link>
                                <Link
                                    href="/admin/sponsorship"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <UserIcon className="h-4 w-4" />
                                    Manage Sponsorship
                                </Link>
                                <Link
                                    href="/admin/categories"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <ChartNoAxesGantt className="h-4 w-4" />
                                    Categories
                                </Link>
                            </div>
                        </div>
                    </RoleGuard>

                    {/* Member Section */}
                    <RoleGuard allowedRoles={["member"]}>
                        <div className="mb-6">
                            <h3 className="mb-2 px-2 text-sm font-semibold text-muted-foreground">Member</h3>
                            <div className="space-y-1">
                                <Link
                                    href="/member/dashboard"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <LayoutDashboard className="h-4 w-4" />
                                    Member Dashboard
                                </Link>
                            </div>
                        </div>
                    </RoleGuard>

                    {/* General Section */}
                    <div className="mb-6">
                        <h3 className="mb-2 px-2 text-sm font-semibold text-muted-foreground">General</h3>
                        <div className="space-y-1">
                            <Link
                                href="/about"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                onClick={() => setOpen(false)}
                            >
                                <Info className="h-4 w-4" />
                                About Us
                            </Link>
                            <Link
                                href="/transparency"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                onClick={() => setOpen(false)}
                            >
                                <BookOpenCheck className="h-4 w-4" />
                                Transparency
                            </Link>
                            <Link
                                href="/workflow"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                onClick={() => setOpen(false)}
                            >
                                <ChartNoAxesGantt className="h-4 w-4" />
                                Our Workflow
                            </Link>
                            <Link
                                href="/contribute"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                onClick={() => setOpen(false)}
                            >
                                <HeartPlus className="h-4 w-4" />
                                Ways To Contribute
                            </Link>
                            <Link
                                href="/welfare-programs"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                onClick={() => setOpen(false)}
                            >
                                <HandHeart className="h-4 w-4" />
                                Welfare Programs
                            </Link>
                            <Link
                                href="/activities"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                onClick={() => setOpen(false)}
                            >
                                <ImageIcon className="h-4 w-4" />
                                Activities
                            </Link>
                            <Link
                                href="/sponsorship/request"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                onClick={() => setOpen(false)}
                            >
                                <UserIcon className="h-4 w-4" />
                                <span>Apply for Sponsorship</span>
                            </Link>
                            <Link
                                href="/sponsorship/status"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                onClick={() => setOpen(false)}
                            >
                                <ClipboardCheck className="h-4 w-4" />
                                <span>Track My Request</span>
                            </Link>
                            <Link
                                href="/sponsor"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                onClick={() => setOpen(false)}
                            >
                                <Heart className="h-4 w-4 text-primary" />
                                Sponsor a Family
                            </Link>
                            <Link
                                href="/donate"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                onClick={() => setOpen(false)}
                            >
                                <Heart className="h-4 w-4" />
                                Donate
                            </Link>
                            <Link
                                href="/sadqa-subscription"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                onClick={() => setOpen(false)}
                            >
                                <Heart className="h-4 w-4" />
                                Sadqa Subscription
                            </Link>
                            <Link
                                href="/marketplace"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                onClick={() => setOpen(false)}
                            >
                                <Store className="h-4 w-4" />
                                Marketplace
                            </Link>
                            <Link
                                href="/programs/golak-map"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                onClick={() => setOpen(false)}
                            >
                                <HandCoins className="h-4 w-4" />
                                Find Gullak
                            </Link>
                            <Link
                                href="/my-donations"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                onClick={() => setOpen(false)}
                            >
                                <Heart className="h-4 w-4" />
                                My Donations
                            </Link>
                            <SignedIn>
                                <Link
                                    href="/sadqa-subscription/manage"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <Heart className="h-4 w-4" />
                                    Manage Subscriptions
                                </Link>
                            </SignedIn>
                            <Link
                                href="/my-sponsorships"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                onClick={() => setOpen(false)}
                            >
                                <Heart className="h-4 w-4 text-primary" />
                                My Sponsorships
                            </Link>
                            <SignedIn>
                                <Link
                                    href="/membership/request"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <UserIcon className="h-4 w-4" />
                                    Become a Member
                                </Link>
                            </SignedIn>
                            <Link
                                href="/account#purchases"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                onClick={() => setOpen(false)}
                            >
                                <ShoppingBag className="h-4 w-4" />
                                My Purchases
                            </Link>
                            <Link
                                href="/conversations"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                onClick={() => setOpen(false)}
                            >
                                <MessageSquare className="h-4 w-4" />
                                My Conversations
                            </Link>
                            <RoleGuard allowedRoles={["admin", "moderator", "field_executive"]}>
                                <Link
                                    href="/scanner"
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                    onClick={() => setOpen(false)}
                                >
                                    <Scan className="h-4 w-4" />
                                    Barcode Scanner
                                </Link>
                            </RoleGuard>
                            <Link
                                href="/account"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                onClick={() => setOpen(false)}
                            >
                                <UserIcon className="h-4 w-4" />
                                Account
                            </Link>
                            {/* <div className="z-[2200]">
                                <ThemeChanger />
                            </div> */}
                        </div>
                    </div>
                </div>

                <SheetFooter className="border-t p-4">
                    <SignedOut>
                        <SignInButton>
                            <Button variant="outline" className="w-full">
                                <UserCircle className="mr-2 h-4 w-4" />
                                Login / Signup
                            </Button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <ProfilePopover />
                    </SignedIn>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
