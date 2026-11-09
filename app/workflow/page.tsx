import { AnimatedSection } from '@/components/animations';
import type { Metadata } from 'next';
import { Card, CardContent } from "@/components/ui/card";
import { Badge, Button } from "@/components/ui";
import Link from 'next/link';
import {
    Users,
    FileCheck,
    TrendingUp,
    CheckCircle2,
    ArrowRight,
    Phone,
    MapPin,
    Calendar,
    Clock,
    UserCheck,
    Package,
    Truck,
    Heart,
    HandHeart,
    Eye,
    Shield,
    Award,
    Quote,
    Sparkles,
    Target,
    ClipboardList,
    Search,
    Camera,
    FileText,
    DollarSign,
    BarChart3,
    Workflow,
    ArrowDown,
    CheckSquare,
    MessageSquare,
    CreditCard,
    Banknote,
    QrCode,
    BookOpen,
    Home,
    Building2,
    Recycle,
    Shirt,
    Star,
    Globe,
    Settings,
    Database,
    AlertCircle,
    Info,
    HelpCircle,
    Mail,
    UtensilsCrossed
} from "lucide-react";

export const metadata: Metadata = {
    title: 'Complete Workflow Documentation - Khadim-e-Millat Welfare Foundation',
    description: 'Comprehensive 40-page workflow documentation covering all aspects of KMWF operations - from beneficiary identification to impact tracking, organizational structure, and transparency measures.',
    keywords: 'KMWF workflow, complete documentation, welfare system, sponsorship program, scrap recycling, transparency, organizational structure, beneficiary verification',
    openGraph: {
        title: 'Complete Workflow Documentation - Khadim-e-Millat Welfare Foundation',
        description: 'Comprehensive workflow documentation covering all aspects of KMWF operations with complete transparency.',
        type: 'website',
    }
};

export default function WorkflowPage() {
    const tableOfContents = [
        { id: "introduction", title: "1. Introduction", sections: ["About KMWF", "Mission & Vision", "Core Principles", "What Makes Us Different"] },
        { id: "welfare-system", title: "2. How Our Welfare System Works", sections: ["Welfare Ecosystem", "Sustainability Model", "Community Participation"] },
        { id: "identifying-families", title: "3. Identifying Families & Individuals in Need", sections: ["Request Sources", "Survey Process", "Verification", "Category Assignment"] },
        { id: "sponsorship-program", title: "4. Sponsorship Program", sections: ["Support Categories", "Donor Selection", "Monthly Continuation", "Case Studies"] },
        { id: "scrap-to-welfare", title: "5. Scrap-to-Welfare Sustainability Model", sections: ["Collection Workflow", "Sorting & Processing", "Revenue Generation"] },
        { id: "clothing-redistribution", title: "6. Clothing Redistribution & Fabric Recycling", sections: ["Sorting Process", "Distribution", "Fabric to Cotton Conversion"] },
        { id: "sadqa-subscription", title: "7. Sadqa Subscription Program", sections: ["Subscription Types", "Continuous Support", "Flexibility"] },
        { id: "golak-system", title: "8. Neki Bank (Gullak) Contribution System", sections: ["Registration", "Collection Workflow", "GPS Mapping"] },
        { id: "bulk-food-redistribution", title: "9. Bulk Food Recovery & Redistribution", sections: ["Collection Process", "Distribution Network", "Quality Assurance"] },
        { id: "employment-support", title: "10. Employment & Dignity Support", sections: ["Work Opportunities", "Stipend Support", "Skill Development"] },
        { id: "roles-responsibilities", title: "11. Roles & Responsibilities", sections: ["Staff Structure", "Role Definitions", "Ethical Standards"] },
        { id: "internal-workflows", title: "12. Internal Workflows", sections: ["Beneficiary Intake", "Sponsorship Activation", "Financial Tracking"] },
        { id: "monitoring-accountability", title: "13. Monitoring & Accountability", sections: ["Quarterly Reviews", "Audits", "Complaint Resolution"] },
        { id: "glossary", title: "14. Glossary of Terms", sections: ["Key Definitions"] },
        { id: "faq", title: "15. Frequently Asked Questions", sections: ["Common Questions"] },
        { id: "closing", title: "16. Closing Message", sections: ["Our Philosophy"] }
    ];

    return (
        <>
            <div className="min-h-screen bg-background">
                {/* Hero Section */}
                <AnimatedSection variant="fade" className="relative py-20 md:py-32 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/10 to-background"></div>
                    <div className="container mx-auto px-4 relative z-10">
                        <AnimatedSection variant="fade" delay={0.2} className="max-w-5xl mx-auto text-center">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-6 leading-tight">
                                Comprehensive Workflow Guide
                                <span className="block text-primary mt-2">Khadim-e-Millat Welfare Foundation</span>
                            </h1>
                            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                                Complete documentation of our organizational structure, processes, technology infrastructure,
                                and quality assurance framework. This comprehensive guide covers every aspect of our operations
                                with complete transparency and detailed explanations.
                            </p>
                        </AnimatedSection>
                    </div>
                </AnimatedSection>

                {/* Table of Contents */}
                <section className="py-16 md:py-24 bg-muted/30">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <AnimatedSection variant="fade" className="text-center mb-12" triggerOnce>
                            <h2 className="text-3xl md:text-4xl mb-4">Table of Contents</h2>
                            <p className="text-lg text-muted-foreground">
                                Navigate through our comprehensive workflow documentation
                            </p>
                        </AnimatedSection>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tableOfContents.map((section, index) => (
                                <AnimatedSection key={section.id} variant="slideUp" delay={index * 0.05}>
                                    <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300">
                                        <CardContent className="p-6">
                                            <h3 className="text-lg font-semibold mb-3 text-primary">{section.title}</h3>
                                            <ul className="space-y-2">
                                                {section.sections.map((subsection, idx) => (
                                                    <li key={idx} className="flex items-start gap-2">
                                                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm text-muted-foreground">{subsection}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
                                                <Link href={`#${section.id}`}>
                                                    Jump to Section
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </section>
                {/* Section 1: Introduction */}
                <section id="introduction" className="py-16 md:py-24">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <AnimatedSection variant="fade" className="text-center mb-16" triggerOnce>
                            <Badge className="mb-4 bg-blue-500/10 text-blue-600 border-blue-500/20">
                                <Home className="w-4 h-4 mr-2" />
                                Section 1
                            </Badge>
                            <h2 className="text-4xl md:text-5xl mb-6">Introduction</h2>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                Understanding Khadim-e-Millat Welfare Foundation's mission, principles, and unique approach to sustainable welfare
                            </p>
                        </AnimatedSection>

                        <div className="space-y-12">
                            {/* About KMWF */}
                            <AnimatedSection variant="slideUp" triggerOnce>
                                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/50">
                                    <CardContent className="p-8">
                                        <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                                            <Building2 className="w-6 h-6 text-blue-600" />
                                            1.1 About Khadim-e-Millat Welfare Foundation
                                        </h3>
                                        <div className="prose prose-lg max-w-none text-muted-foreground">
                                            <p className="mb-4">
                                                Khadim-e-Millat Welfare Foundation (KMWF) is a community-supported welfare organisation that operates on principles of dignity, transparency, and structured assistance. The foundation works to connect individuals and families in need with reliable support, while ensuring that every contribution is managed responsibly and distributed through a verified system.
                                            </p>
                                            <p className="mb-4">
                                                KMWF does not operate on temporary relief alone. The foundation builds sustainable assistance pathways that include monthly sponsorship support, emergency aid, livelihood assistance, and welfare programs funded partly through recycled resources. This approach enables long-term stability instead of short-term dependency.
                                            </p>
                                            <p>
                                                The organisation is formally registered and operates under applicable nonprofit and charitable compliance frameworks, supporting underprivileged families, widows, orphans, elderly individuals without income, students from low-income households, and chronically ill patients requiring recurring medical support.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </AnimatedSection>

                            {/* Mission & Vision */}
                            <AnimatedSection variant="slideUp" triggerOnce>
                                <div className="grid lg:grid-cols-2 gap-8">
                                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200/50">
                                        <CardContent className="p-8">
                                            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                                                <Target className="w-6 h-6 text-green-600" />
                                                1.2 Mission
                                            </h3>
                                            <p className="text-muted-foreground">
                                                To provide structured, sustained, and transparent support to individuals and families in need, ensuring essentials like food, education, medical care, and basic living dignity are accessible.
                                            </p>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border-purple-200/50">
                                        <CardContent className="p-8">
                                            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                                                <Eye className="w-6 h-6 text-purple-600" />
                                                Vision
                                            </h3>
                                            <p className="text-muted-foreground">
                                                A community where those who have the means and those who require support are connected through a responsible system — ensuring help is meaningful, continuous, and accountable.
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </AnimatedSection>

                            {/* Core Principles */}
                            <AnimatedSection variant="slideUp" triggerOnce>
                                <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200/50">
                                    <CardContent className="p-8">
                                        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                                            <Star className="w-6 h-6 text-orange-600" />
                                            1.3 Core Principles of Welfare
                                        </h3>
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {[
                                                { title: "Dignity First", desc: "Every individual receiving support is treated with respect and confidentiality.", icon: Heart },
                                                { title: "Verified Assistance", desc: "No support is granted without a documented survey and verification.", icon: CheckSquare },
                                                { title: "Sustained Support", desc: "Sponsorship and welfare help continues over time, not only in emergency moments.", icon: Clock },
                                                { title: "Transparency", desc: "Every part of the process — from collection to distribution — is accountable and explained publicly.", icon: Eye },
                                                { title: "Community Participation", desc: "Welfare is made sustainable by involving the community in giving, volunteering, and maintaining the system.", icon: Users }
                                            ].map((principle, idx) => (
                                                <div key={idx} className="text-center">
                                                    <div className="w-12 h-12 mx-auto rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-3">
                                                        <principle.icon className="w-6 h-6 text-orange-600" />
                                                    </div>
                                                    <h4 className="font-semibold mb-2">{principle.title}</h4>
                                                    <p className="text-sm text-muted-foreground">{principle.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </AnimatedSection>
                        </div>
                    </div>
                </section>
                {/* Section 2: How Our Welfare System Works */}
                <section id="welfare-system" className="py-16 md:py-24 bg-muted/30">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <AnimatedSection variant="fade" className="text-center mb-16" triggerOnce>
                            <Badge className="mb-4 bg-green-500/10 text-green-600 border-green-500/20">
                                <Settings className="w-4 h-4 mr-2" />
                                Section 2
                            </Badge>
                            <h2 className="text-4xl md:text-5xl mb-6">How Our Welfare System Works</h2>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                Understanding our integrated ecosystem of sustainability, sponsorship, and community support
                            </p>
                        </AnimatedSection>

                        <div className="space-y-12">
                            {/* Welfare Ecosystem */}
                            <AnimatedSection variant="slideUp" triggerOnce>
                                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                                    <CardContent className="p-8">
                                        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                                            <Globe className="w-6 h-6 text-green-600" />
                                            2.1 The Integrated Welfare Ecosystem
                                        </h3>
                                        <p className="text-muted-foreground mb-6">
                                            KMWF operates through three interconnected streams that reinforce each other to ensure continuous, sustainable support:
                                        </p>
                                        <div className="grid lg:grid-cols-3 gap-6">
                                            {[
                                                {
                                                    title: "Community Contributions",
                                                    subtitle: "Sadqa, Zakat, Neki Bak, Donations",
                                                    purpose: "Enables direct welfare support",
                                                    output: "Monthly stipends, education aid, medical support",
                                                    color: "from-blue-500 to-cyan-500",
                                                    icon: Users
                                                },
                                                {
                                                    title: "Sponsorship Support",
                                                    subtitle: "Long-term family partnerships",
                                                    purpose: "Provides long-term stability to specific families",
                                                    output: "Continuous monthly assistance",
                                                    color: "from-purple-500 to-pink-500",
                                                    icon: Heart
                                                },
                                                {
                                                    title: "Scrap-to-Welfare Sustainability",
                                                    subtitle: "Recycling for welfare funding",
                                                    purpose: "Converts recyclable items into welfare funds",
                                                    output: "Helps maintain operations and recurring support programs",
                                                    color: "from-green-500 to-emerald-500",
                                                    icon: Recycle
                                                }
                                            ].map((stream, idx) => (
                                                <Card key={idx} className="bg-gradient-to-br from-card to-card/50 border-border/50">
                                                    <CardContent className="p-6">
                                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stream.color} flex items-center justify-center mb-4`}>
                                                            <stream.icon className="w-6 h-6 text-white" />
                                                        </div>
                                                        <h4 className="font-semibold mb-2">{stream.title}</h4>
                                                        <p className="text-sm text-primary mb-3">{stream.subtitle}</p>
                                                        <div className="space-y-2 text-sm text-muted-foreground">
                                                            <p><strong>Purpose:</strong> {stream.purpose}</p>
                                                            <p><strong>Output:</strong> {stream.output}</p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </AnimatedSection>

                            {/* Donor Flow */}
                            <AnimatedSection variant="slideUp" triggerOnce>
                                <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 border-indigo-200/50">
                                    <CardContent className="p-8">
                                        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                                            <ArrowDown className="w-6 h-6 text-indigo-600" />
                                            2.2 Donor → Foundation → Beneficiary Flow
                                        </h3>
                                        <div className="space-y-4">
                                            {[
                                                { step: "Donor / Contributor", desc: "Community members, businesses, individuals" },
                                                { step: "Contribution", desc: "Monetary, Scrap, Subscription, Gullak" },
                                                { step: "Recording & Allocation", desc: "Finance + Program Teams document and allocate" },
                                                { step: "Verified Beneficiary System", desc: "Survey + Verification Team ensures authenticity" },
                                                { step: "Support Delivery", desc: "Sponsorship / Welfare / Stipends / Aid Programs" },
                                                { step: "Monitoring & Follow-up", desc: "Re-evaluation + Review for continuous improvement" }
                                            ].map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-4">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                                        <span className="text-sm font-semibold text-indigo-600">{idx + 1}</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold">{item.step}</h4>
                                                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                                                    </div>
                                                    {idx < 5 && <ArrowDown className="w-4 h-4 text-indigo-400 ml-auto" />}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </AnimatedSection>
                        </div>
                    </div>
                </section>
                {/* Section 3: Identifying Families & Individuals in Need */}
                <section id="identifying-families" className="py-16 md:py-24">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <AnimatedSection variant="fade" className="text-center mb-16" triggerOnce>
                            <Badge className="mb-4 bg-purple-500/10 text-purple-600 border-purple-500/20">
                                <Search className="w-4 h-4 mr-2" />
                                Section 3
                            </Badge>
                            <h2 className="text-4xl md:text-5xl mb-6">Identifying Families & Individuals in Need</h2>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                Our structured verification process ensures assistance reaches those who genuinely need it
                            </p>
                        </AnimatedSection>

                        <div className="space-y-12">
                            {/* Request Sources */}
                            <AnimatedSection variant="slideUp" triggerOnce>
                                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                                    <CardContent className="p-8">
                                        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                                            <Phone className="w-6 h-6 text-purple-600" />
                                            3.1 Referral & Request Sources
                                        </h3>
                                        <p className="text-muted-foreground mb-6">
                                            Requests for support may come from various trusted sources. No case is accepted directly into support without survey and verification.
                                        </p>
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {[
                                                "Family members or neighbours",
                                                "Community representatives",
                                                "Local volunteers",
                                                "Hospitals, madrasa teachers, welfare workers",
                                                "Online application or direct contact",
                                                "Existing beneficiary referrals"
                                            ].map((source, idx) => (
                                                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                                                    <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                                    <span className="text-sm">{source}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </AnimatedSection>

                            {/* Survey Process */}
                            <AnimatedSection variant="slideUp" triggerOnce>
                                <div className="grid lg:grid-cols-2 gap-8">
                                    <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200/50">
                                        <CardContent className="p-8">
                                            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                                                <ClipboardList className="w-6 h-6 text-orange-600" />
                                                3.2 Survey Assignment Procedure
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                                        <span className="text-xs font-semibold text-orange-600">1</span>
                                                    </div>
                                                    <span className="text-sm">Case Request → Recorded in System</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                                        <span className="text-xs font-semibold text-orange-600">2</span>
                                                    </div>
                                                    <span className="text-sm">Surveyor Assigned</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                                        <span className="text-xs font-semibold text-orange-600">3</span>
                                                    </div>
                                                    <span className="text-sm">Visit Scheduled</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 border-teal-200/50">
                                        <CardContent className="p-8">
                                            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                                                <Home className="w-6 h-6 text-teal-600" />
                                                3.3 Home Survey Data Collection
                                            </h3>
                                            <div className="space-y-2 text-sm">
                                                {[
                                                    "Household income and expenses",
                                                    "Number and age of dependents",
                                                    "Living conditions and housing stability",
                                                    "Medical or special circumstances",
                                                    "Supporting documents (where available)",
                                                    "Photographs for record verification"
                                                ].map((item, idx) => (
                                                    <div key={idx} className="flex items-start gap-2">
                                                        <Sparkles className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                                                        <span>{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </AnimatedSection>

                            {/* Category System */}
                            <AnimatedSection variant="slideUp" triggerOnce>
                                <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-200/50">
                                    <CardContent className="p-8">
                                        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                                            <Award className="w-6 h-6 text-indigo-600" />
                                            3.4 Category Assignment System
                                        </h3>
                                        <div className="grid lg:grid-cols-3 gap-6">
                                            {[
                                                {
                                                    category: "Category 1",
                                                    desc: "Severe financial hardship, no stable income, multiple dependents",
                                                    priority: "Highest Priority",
                                                    support: "Monthly sponsorship & aid",
                                                    color: "from-red-500 to-pink-500"
                                                },
                                                {
                                                    category: "Category 2",
                                                    desc: "Low income but partially stable or supportable with partial aid",
                                                    priority: "Medium Priority",
                                                    support: "Partial or case-based support",
                                                    color: "from-yellow-500 to-orange-500"
                                                },
                                                {
                                                    category: "Category 3",
                                                    desc: "Income stable enough for essentials, but vulnerable to emergencies",
                                                    priority: "Emergency Support",
                                                    support: "Specific needs (medical, crisis, etc.)",
                                                    color: "from-green-500 to-emerald-500"
                                                }
                                            ].map((cat, idx) => (
                                                <Card key={idx} className="bg-card/50 border-border/50">
                                                    <CardContent className="p-6">
                                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4`}>
                                                            <span className="text-white font-bold">{idx + 1}</span>
                                                        </div>
                                                        <h4 className="font-semibold mb-2">{cat.category}</h4>
                                                        <p className="text-sm text-muted-foreground mb-3">{cat.desc}</p>
                                                        <div className="space-y-1 text-xs">
                                                            <p><strong>Priority:</strong> {cat.priority}</p>
                                                            <p><strong>Support:</strong> {cat.support}</p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </AnimatedSection>
                        </div>
                    </div>
                </section>
                {/* Section 4: Sponsorship Program */}
                <section id="sponsorship-program" className="py-16 md:py-24 bg-muted/30">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <AnimatedSection variant="fade" className="text-center mb-16" triggerOnce>
                            <Badge className="mb-4 bg-pink-500/10 text-pink-600 border-pink-500/20">
                                <Heart className="w-4 h-4 mr-2" />
                                Section 4
                            </Badge>
                            <h2 className="text-4xl md:text-5xl mb-6">Sponsorship Program</h2>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                One Donor, One Family — A Connection That Changes Lives
                            </p>
                        </AnimatedSection>

                        <div className="space-y-12">
                            {/* Sponsorship Categories */}
                            <AnimatedSection variant="slideUp" triggerOnce>
                                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                                    <CardContent className="p-8">
                                        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                                            <Users className="w-6 h-6 text-pink-600" />
                                            4.1 Categories of Sponsorship Support
                                        </h3>
                                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            {[
                                                { title: "Widows", desc: "Monthly household assistance", icon: Heart, color: "bg-pink-500" },
                                                { title: "Orphan Children", desc: "Education & living support", icon: Users, color: "bg-blue-500" },
                                                { title: "Elderly", desc: "No income source support", icon: Clock, color: "bg-purple-500" },
                                                { title: "Medical Patients", desc: "Recurring treatment support", icon: FileCheck, color: "bg-green-500" },
                                                { title: "Students", desc: "Low-income household education", icon: BookOpen, color: "bg-orange-500" },
                                                { title: "Disabled", desc: "Unable to work assistance", icon: Shield, color: "bg-teal-500" },
                                                { title: "Severe Hardship", desc: "Families facing crisis", icon: AlertCircle, color: "bg-red-500" },
                                                { title: "Custom Support", desc: "Specific need categories", icon: Star, color: "bg-indigo-500" }
                                            ].map((category, idx) => (
                                                <div key={idx} className="text-center p-4 rounded-lg bg-gradient-to-br from-card to-card/50 border border-border/50">
                                                    <div className={`w-12 h-12 mx-auto rounded-full ${category.color} flex items-center justify-center mb-3`}>
                                                        <category.icon className="w-6 h-6 text-white" />
                                                    </div>
                                                    <h4 className="font-semibold mb-2">{category.title}</h4>
                                                    <p className="text-sm text-muted-foreground">{category.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </AnimatedSection>

                            {/* How Donors Select */}
                            <AnimatedSection variant="slideUp" triggerOnce>
                                <div className="grid lg:grid-cols-2 gap-8">
                                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/50">
                                        <CardContent className="p-8">
                                            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                                                <Target className="w-6 h-6 text-blue-600" />
                                                4.2 How Donors Select Beneficiaries
                                            </h3>
                                            <div className="space-y-4">
                                                {[
                                                    "Donor visits the Sponsorship page",
                                                    "Selects a support category (widows, students, medical, etc.)",
                                                    "Views verified beneficiaries with brief summaries",
                                                    "Selects a beneficiary to sponsor",
                                                    "Reviews profile details and support requirements",
                                                    "Activates sponsorship with first payment"
                                                ].map((step, idx) => (
                                                    <div key={idx} className="flex items-center gap-3">
                                                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                            <span className="text-xs font-semibold text-blue-600">{idx + 1}</span>
                                                        </div>
                                                        <span className="text-sm">{step}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200/50">
                                        <CardContent className="p-8">
                                            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                                                <Calendar className="w-6 h-6 text-green-600" />
                                                4.3 Monthly Continuation
                                            </h3>
                                            <div className="space-y-4">
                                                <p className="text-muted-foreground text-sm">
                                                    Monthly support is processed automatically (if recurring payment is used) or the donor receives reminders (if manual monthly payment is chosen).
                                                </p>
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                        <span className="text-sm">Children remain in school</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                        <span className="text-sm">Medical treatment is not interrupted</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                        <span className="text-sm">Elderly individuals continue receiving support</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </AnimatedSection>

                            {/* Sponsorship Management */}
                            <AnimatedSection variant="slideUp" triggerOnce>
                                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200/50">
                                    <CardContent className="p-8">
                                        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                                            <Settings className="w-6 h-6 text-purple-600" />
                                            4.4 Sponsorship Management Options
                                        </h3>
                                        <div className="grid lg:grid-cols-3 gap-6">
                                            {[
                                                {
                                                    action: "Pause",
                                                    reason: "Temporary financial difficulty",
                                                    result: "Sponsorship Coordinator holds the case until sponsor resumes",
                                                    color: "from-yellow-500 to-orange-500"
                                                },
                                                {
                                                    action: "Transfer",
                                                    reason: "Donor wants to change who they support",
                                                    result: "A new sponsor is assigned to previous beneficiary before transfer",
                                                    color: "from-blue-500 to-indigo-500"
                                                },
                                                {
                                                    action: "Close",
                                                    reason: "Sponsor permanently stops",
                                                    result: "Case returns to Awaiting Sponsorship status",
                                                    color: "from-red-500 to-pink-500"
                                                }
                                            ].map((option, idx) => (
                                                <Card key={idx} className="bg-card/50 border-border/50">
                                                    <CardContent className="p-6">
                                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center mb-4`}>
                                                            <Settings className="w-6 h-6 text-white" />
                                                        </div>
                                                        <h4 className="font-semibold mb-2">{option.action}</h4>
                                                        <p className="text-sm text-muted-foreground mb-3"><strong>Reason:</strong> {option.reason}</p>
                                                        <p className="text-xs text-muted-foreground">{option.result}</p>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </AnimatedSection>
                        </div>
                    </div>
                </section>
                {/* Section 5: Scrap-to-Welfare Sustainability Model */}
                <section id="scrap-to-welfare" className="py-16 md:py-24">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <AnimatedSection variant="fade" className="text-center mb-16" triggerOnce>
                            <Badge className="mb-4 bg-green-500/10 text-green-600 border-green-500/20">
                                <Recycle className="w-4 h-4 mr-2" />
                                Section 5
                            </Badge>
                            <h2 className="text-4xl md:text-5xl mb-6">Scrap-to-Welfare Sustainability Model</h2>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                Transforming Waste into Welfare through systematic collection, processing, and revenue generation
                            </p>
                        </AnimatedSection>

                        <div className="space-y-12">
                            {/* Purpose */}
                            <AnimatedSection variant="slideUp" triggerOnce>
                                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200/50">
                                    <CardContent className="p-8">
                                        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                                            <Target className="w-6 h-6 text-green-600" />
                                            5.1 Purpose of the Scrap Program
                                        </h3>
                                        <div className="grid lg:grid-cols-3 gap-6">
                                            {[
                                                {
                                                    benefit: "Sustainable Funding",
                                                    outcome: "Supports monthly stipends and welfare operations without solely depending on cash donations",
                                                    icon: DollarSign,
                                                    color: "bg-green-500"
                                                },
                                                {
                                                    benefit: "Employment Opportunity",
                                                    outcome: "Provides work to individuals skilled in repair, sorting, or handling material",
                                                    icon: Users,
                                                    color: "bg-blue-500"
                                                },
                                                {
                                                    benefit: "Environmental Responsibility",
                                                    outcome: "Reduces waste by repairing, reusing, and recycling materials",
                                                    icon: Globe,
                                                    color: "bg-teal-500"
                                                }
                                            ].map((item, idx) => (
                                                <div key={idx} className="text-center">
                                                    <div className={`w-16 h-16 mx-auto rounded-2xl ${item.color} flex items-center justify-center mb-4`}>
                                                        <item.icon className="w-8 h-8 text-white" />
                                                    </div>
                                                    <h4 className="font-semibold mb-3">{item.benefit}</h4>
                                                    <p className="text-sm text-muted-foreground">{item.outcome}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </AnimatedSection>

                            {/* Collection Process */}
                            <AnimatedSection variant="slideUp" triggerOnce>
                                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                                    <CardContent className="p-8">
                                        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                                            <Truck className="w-6 h-6 text-green-600" />
                                            5.2 Scrap Collection Workflow
                                        </h3>
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {[
                                                {
                                                    step: "Collection Request",
                                                    desc: "Donors contact us via phone, WhatsApp, or website to schedule scrap pickup",
                                                    icon: Phone,
                                                    color: "bg-blue-500"
                                                },
                                                {
                                                    step: "Pickup Scheduling",
                                                    desc: "Our team schedules convenient pickup time and provides confirmation",
                                                    icon: Calendar,
                                                    color: "bg-green-500"
                                                },
                                                {
                                                    step: "On-Site Collection",
                                                    desc: "Trained volunteers collect, weigh, and provide receipt for donated items",
                                                    icon: Truck,
                                                    color: "bg-purple-500"
                                                },
                                                {
                                                    step: "Sorting & Processing",
                                                    desc: "Items are sorted, cleaned, and prepared for recycling or resale",
                                                    icon: Package,
                                                    color: "bg-orange-500"
                                                },
                                                {
                                                    step: "Revenue Generation",
                                                    desc: "Processed materials are sold to recyclers or refurbished for resale",
                                                    icon: DollarSign,
                                                    color: "bg-teal-500"
                                                },
                                                {
                                                    step: "Fund Allocation",
                                                    desc: "100% of proceeds go directly to welfare programs and beneficiary support",
                                                    icon: Heart,
                                                    color: "bg-red-500"
                                                }
                                            ].map((item, idx) => (
                                                <Card key={idx} className="bg-gradient-to-br from-card to-card/50 border-border/50">
                                                    <CardContent className="p-6">
                                                        <div className="flex items-center gap-4 mb-4">
                                                            <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center`}>
                                                                <item.icon className="w-6 h-6 text-white" />
                                                            </div>
                                                            <Badge variant="outline" className="text-xs">
                                                                Step {idx + 1}
                                                            </Badge>
                                                        </div>
                                                        <h4 className="font-semibold mb-2">{item.step}</h4>
                                                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </AnimatedSection>

                            {/* Sorting & Grading */}
                            <AnimatedSection variant="slideUp" triggerOnce>
                                <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200/50">
                                    <CardContent className="p-8">
                                        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                                            <Package className="w-6 h-6 text-orange-600" />
                                            5.3 Sorting & Grading Process
                                        </h3>
                                        <p className="text-muted-foreground mb-6">
                                            Once collected, items are sorted into three primary grades to ensure maximum utility and minimum waste:
                                        </p>
                                        <div className="grid lg:grid-cols-3 gap-6">
                                            {[
                                                {
                                                    grade: "Grade A: Usable",
                                                    condition: "Can be directly reused",
                                                    action: "Given to families in need through Welfare Support Team",
                                                    color: "from-green-500 to-emerald-500"
                                                },
                                                {
                                                    grade: "Grade B: Repairable",
                                                    condition: "Needs minor repair / cleaning",
                                                    action: "Sent to workshop → repaired → resold at minimal price",
                                                    color: "from-yellow-500 to-orange-500"
                                                },
                                                {
                                                    grade: "Grade C: Unusable",
                                                    condition: "Broken / beyond use",
                                                    action: "Sent to recycling unit → converted to raw material → funds sent to welfare account",
                                                    color: "from-red-500 to-pink-500"
                                                }
                                            ].map((grade, idx) => (
                                                <Card key={idx} className="bg-card/50 border-border/50">
                                                    <CardContent className="p-6">
                                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${grade.color} flex items-center justify-center mb-4`}>
                                                            <span className="text-white font-bold text-lg">{String.fromCharCode(65 + idx)}</span>
                                                        </div>
                                                        <h4 className="font-semibold mb-2">{grade.grade}</h4>
                                                        <p className="text-sm text-muted-foreground mb-3"><strong>Condition:</strong> {grade.condition}</p>
                                                        <p className="text-xs text-muted-foreground">{grade.action}</p>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </AnimatedSection>
                        </div>
                    </div>
                </section>
                {/* Section 6: Clothing Redistribution */}
                <section id="clothing-redistribution" className="py-16 md:py-24 bg-muted/30">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <AnimatedSection variant="fade" className="text-center mb-16" triggerOnce>
                            <Badge className="mb-4 bg-teal-500/10 text-teal-600 border-teal-500/20">
                                <Shirt className="w-4 h-4 mr-2" />
                                Section 6
                            </Badge>
                            <h2 className="text-4xl md:text-5xl mb-6">Clothing Redistribution & Fabric Recycling</h2>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                From Used Fabric to New Hope - Every piece goes through a thoughtful process
                            </p>
                        </AnimatedSection>

                        <div className="space-y-12">
                            {/* Sorting Process */}
                            <AnimatedSection variant="slideUp" triggerOnce>
                                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                                    <CardContent className="p-8">
                                        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                                            <Package className="w-6 h-6 text-teal-600" />
                                            6.1 Sorting Clothing Donations
                                        </h3>
                                        <p className="text-muted-foreground mb-6">
                                            Every clothing item is processed carefully to ensure maximum benefit and resource efficiency:
                                        </p>
                                        <div className="grid lg:grid-cols-3 gap-6">
                                            {[
                                                {
                                                    category: "Repairable Clothing",
                                                    desc: "Requires stitching, cleaning, or minor adjustment",
                                                    action: "Repaired and then distributed or sold at minimal charity value",
                                                    icon: Settings,
                                                    color: "from-blue-500 to-indigo-500"
                                                },
                                                {
                                                    category: "Unusable Fabric",
                                                    desc: "Torn, worn-out or beyond wearable condition",
                                                    action: "Converted into cotton for mattress production",
                                                    icon: Recycle,
                                                    color: "from-purple-500 to-pink-500"
                                                }
                                            ].map((item, idx) => (
                                                <Card key={idx} className="bg-gradient-to-br from-card to-card/50 border-border/50">
                                                    <CardContent className="p-6">
                                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                                                            <item.icon className="w-6 h-6 text-white" />
                                                        </div>
                                                        <h4 className="font-semibold mb-2">{item.category}</h4>
                                                        <p className="text-sm text-muted-foreground mb-3">{item.desc}</p>
                                                        <p className="text-xs text-muted-foreground font-medium">{item.action}</p>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </AnimatedSection>

                            {/* Distribution & Processing */}
                            <AnimatedSection variant="slideUp" triggerOnce>
                                <div className="grid lg:grid-cols-2 gap-8">
                                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/50">
                                        <CardContent className="p-8">
                                            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                                                <Heart className="w-6 h-6 text-blue-600" />
                                                6.2 Direct Clothing Distribution
                                            </h3>
                                            <p className="text-muted-foreground mb-4">
                                                Usable clothing is provided to verified beneficiaries through multiple channels:
                                            </p>
                                            <div className="space-y-3">
                                                {[
                                                    "Families identified in surveys",
                                                    "Individuals in sponsorship support",
                                                    "Seasonal relief drives (winter kits, Ramadan support)",
                                                    "Emergency aid distribution"
                                                ].map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-3">
                                                        <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                                        <span className="text-sm">{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                                                <p className="text-xs text-blue-700 dark:text-blue-300">
                                                    <strong>Note:</strong> Distribution is recorded to maintain transparency and prevent duplication.
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200/50">
                                        <CardContent className="p-8">
                                            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                                                <Recycle className="w-6 h-6 text-purple-600" />
                                                6.3 Fabric to Cotton Conversion
                                            </h3>
                                            <p className="text-muted-foreground mb-4">
                                                Unusable fabric is processed into cotton filling for multiple purposes:
                                            </p>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <h4 className="font-medium text-sm">Cotton Uses:</h4>
                                                    <div className="space-y-2">
                                                        {[
                                                            "Make mattresses",
                                                            "Produce comfort padding",
                                                            "Support bedding needs during relief work"
                                                        ].map((use, idx) => (
                                                            <div key={idx} className="flex items-center gap-2">
                                                                <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0" />
                                                                <span className="text-sm">{use}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <h4 className="font-medium text-sm">Mattress Distribution:</h4>
                                                    <div className="space-y-2">
                                                        {[
                                                            "Distributed to beneficiary households",
                                                            "Provided in relief programs",
                                                            "Sold at low cost to generate welfare funds"
                                                        ].map((dist, idx) => (
                                                            <div key={idx} className="flex items-center gap-2">
                                                                <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
                                                                <span className="text-sm">{dist}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </AnimatedSection>

                            {/* Fund Allocation */}
                            <AnimatedSection variant="slideUp" triggerOnce>
                                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200/50">
                                    <CardContent className="p-8">
                                        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                                            <DollarSign className="w-6 h-6 text-green-600" />
                                            6.4 Fund Allocation Transparency
                                        </h3>
                                        <div className="flex items-center justify-center mb-6">
                                            <div className="flex items-center flex-col md:flex-row space-x-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 rounded bg-green-500"></div>
                                                    <span>Revenue Generated</span>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90 md:rotate-0" />
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 rounded bg-blue-500"></div>
                                                    <span>Recorded</span>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90 md:rotate-0" />
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 rounded bg-purple-500"></div>
                                                    <span>Reviewed</span>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90 md:rotate-0" />
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 rounded bg-orange-500"></div>
                                                    <span>Deposited</span>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90 md:rotate-0" />
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 rounded bg-red-500"></div>
                                                    <span>Welfare Fund</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-3 gap-4">
                                            {[
                                                "No material is wasted",
                                                "No contribution is untracked",
                                                "Every step is auditable"
                                            ].map((principle, idx) => (
                                                <div key={idx} className="text-center p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                                    <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                                    <p className="text-sm font-medium">{principle}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </AnimatedSection>
                        </div>
                    </div>
                </section>
                {/* Call to Action */}
                {/* <section className="py-16 md:py-24 bg-gradient-to-br from-primary/20 via-purple-500/10 to-background">
                    <div className="container mx-auto px-4">
                        <AnimatedSection variant="fade" className="max-w-4xl mx-auto" triggerOnce>
                            <Card className="bg-gradient-to-br from-primary to-purple-500 border-0">
                                <CardContent className="p-8 md:p-12 text-center">
                                    <Quote className="w-12 h-12 text-white/80 mx-auto mb-6" />
                                    <h2 className="text-3xl md:text-4xl text-white mb-4">
                                        Complete Workflow Documentation
                                    </h2>
                                    <p className="text-white/90 mb-6 text-lg">
                                        This comprehensive guide covers all 15 sections of our operations with complete transparency.
                                        Every process, role, and system is documented to ensure accountability and trust in our mission.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                                        <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                                            Download Full Documentation
                                            <ArrowRight className="ml-2 w-5 h-5" />
                                        </Button>
                                        <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                                            <Link href="/transparency">
                                                View Our Transparency Report
                                            </Link>
                                        </Button>
                                    </div>
                                    <div className="pt-8 border-t border-white/20">
                                        <p className="text-white/90 italic">
                                            "At Khadim-e-Millat, every program begins with trust and ends with impact —
                                            uniting faith, community, and sustainability in a single act of giving."
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </AnimatedSection>
                    </div>
                </section> */}
            </div>
            {/* Section 7: Sadqa Subscription Program */}
            <section id="sadqa-subscription" className="py-16 md:py-24">
                <div className="container mx-auto px-4 max-w-6xl">
                    <AnimatedSection variant="fade" className="text-center mb-16" triggerOnce>
                        <Badge className="mb-4 bg-indigo-500/10 text-indigo-600 border-indigo-500/20">
                            <Calendar className="w-4 h-4 mr-2" />
                            Section 7
                        </Badge>
                        <h2 className="text-4xl md:text-5xl mb-6">Sadqa Subscription Program</h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Continuous support through small, regular contributions that ensure steady welfare activities
                        </p>
                    </AnimatedSection>

                    <div className="space-y-12">
                        {/* Subscription Types */}
                        <AnimatedSection variant="slideUp" triggerOnce>
                            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-200/50">
                                <CardContent className="p-8">
                                    <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                                        <Calendar className="w-6 h-6 text-indigo-600" />
                                        7.1 Subscription Types
                                    </h3>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {[
                                            { type: "Daily Sadqa", desc: "Small daily contributions", icon: Clock, color: "bg-blue-500" },
                                            { type: "Weekly (Juma) Sadqa", desc: "Friday weekly giving", icon: Calendar, color: "bg-green-500" },
                                            { type: "Monthly Support Plans", desc: "Monthly recurring donations", icon: CreditCard, color: "bg-purple-500" },
                                            { type: "Yearly Contribution Plans", desc: "Annual commitment plans", icon: Award, color: "bg-orange-500" }
                                        ].map((plan, idx) => (
                                            <Card key={idx} className="bg-card/50 border-border/50 text-center">
                                                <CardContent className="p-6">
                                                    <div className={`w-12 h-12 mx-auto rounded-full ${plan.color} flex items-center justify-center mb-4`}>
                                                        <plan.icon className="w-6 h-6 text-white" />
                                                    </div>
                                                    <h4 className="font-semibold mb-2">{plan.type}</h4>
                                                    <p className="text-sm text-muted-foreground">{plan.desc}</p>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </AnimatedSection>

                        {/* What Sadqa Supports */}
                        <AnimatedSection variant="slideUp" triggerOnce>
                            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                                <CardContent className="p-8">
                                    <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                                        <Heart className="w-6 h-6 text-indigo-600" />
                                        7.2 What Continuous Sadqa Supports
                                    </h3>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {[
                                            "Monthly ration support",
                                            "Basic living assistance for elderly or disabled individuals",
                                            "Education continuity for children",
                                            "Medical support for recurring treatment needs",
                                            "Emergency response funds",
                                            "Operational sustainability"
                                        ].map((support, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-4 rounded-lg bg-indigo-50 dark:bg-indigo-950/20">
                                                <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                                                <span className="text-sm">{support}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* Section 8: Gullak Contribution System */}
            <section id="golak-system" className="py-16 md:py-24 bg-muted/30">
                <div className="container mx-auto px-4 max-w-6xl">
                    <AnimatedSection variant="fade" className="text-center mb-16" triggerOnce>
                        <Badge className="mb-4 bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                            <MapPin className="w-4 h-4 mr-2" />
                            Section 8
                        </Badge>
                        <h2 className="text-4xl md:text-5xl mb-6">Neki Bank (Gullak) Contribution System</h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Community Contribution Network - Small contributions, big impact through structured collection
                        </p>
                    </AnimatedSection>

                    <div className="space-y-12">
                        {/* Gullak Registration */}
                        <AnimatedSection variant="slideUp" triggerOnce>
                            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200/50">
                                <CardContent className="p-8">
                                    <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                                        <Database className="w-6 h-6 text-yellow-600" />
                                        8.1 Gullak Registration & Unique ID System
                                    </h3>
                                    <p className="text-muted-foreground mb-6">
                                        Each Gullak (Neki Bank) is officially registered before being placed, ensuring complete transparency and tracking:
                                    </p>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {[
                                            { item: "Unique Gullak ID", desc: "Individual identification number", icon: QrCode },
                                            { item: "Assigned Caretaker", desc: "Responsible community member", icon: UserCheck },
                                            { item: "GPS Location", desc: "Latitude + Longitude mapping", icon: MapPin },
                                            { item: "System Entry", desc: "Digital management system", icon: Database }
                                        ].map((feature, idx) => (
                                            <div key={idx} className="text-center">
                                                <div className="w-12 h-12 mx-auto rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mb-3">
                                                    <feature.icon className="w-6 h-6 text-yellow-600" />
                                                </div>
                                                <h4 className="font-semibold mb-2">{feature.item}</h4>
                                                <p className="text-sm text-muted-foreground">{feature.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </AnimatedSection>

                        {/* Collection Workflow */}
                        <AnimatedSection variant="slideUp" triggerOnce>
                            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                                <CardContent className="p-8">
                                    <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                                        <Workflow className="w-6 h-6 text-yellow-600" />
                                        8.2 Collection and Deposit Workflow
                                    </h3>
                                    <div className="space-y-4">
                                        {[
                                            { step: "Gullak is reported ready for collection", icon: Phone },
                                            { step: "Collection Team visits the location", icon: Truck },
                                            { step: "Caretaker and Collection Team open the Gullak together", icon: Users },
                                            { step: "Amount is counted and recorded in presence of both", icon: CheckSquare },
                                            { step: "Collection is logged with Gullak ID + Date + Amount", icon: FileText },
                                            { step: "Funds are deposited to KMWF welfare account", icon: Banknote },
                                            { step: "Entry is verified by Finance Officer", icon: CheckSquare }
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                                                <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-sm font-semibold text-yellow-600">{idx + 1}</span>
                                                </div>
                                                <div className="flex items-center gap-3 flex-1">
                                                    <item.icon className="w-5 h-5 text-yellow-600" />
                                                    <span className="text-sm">{item.step}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                            <strong>Important:</strong> No individual handles collected funds privately at any step.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* Section 9: Bulk Food Recovery & Redistribution */}
            <section id="bulk-food-redistribution" className="py-16 md:py-24">
                <div className="container mx-auto px-4 max-w-6xl">
                    <AnimatedSection variant="fade" className="text-center mb-16" triggerOnce>
                        <Badge className="mb-4 bg-orange-500/10 text-orange-600 border-orange-500/20">
                            <UtensilsCrossed className="w-4 h-4 mr-2" />
                            Section 9
                        </Badge>
                        <h2 className="text-4xl md:text-5xl mb-6">Bulk Food Recovery & Redistribution</h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Transforming surplus into sustenance
                        </p>
                    </AnimatedSection>

                    <div className="space-y-12">
                        {/* Main Description */}
                        <AnimatedSection variant="slideUp" triggerOnce>
                            <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200/50">
                                <CardContent className="p-8">
                                    <div className="prose prose-lg max-w-none text-muted-foreground">
                                        <p className="mb-4">
                                            Not all generosity starts with money — sometimes, it starts with food that would otherwise go to waste. Through this model, KMWF collects and redistributes leftover food from community events, weddings, restaurants, and households to families who need it most.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </AnimatedSection>

                        {/* How It Works */}
                        <AnimatedSection variant="slideUp" triggerOnce>
                            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                                <CardContent className="p-8">
                                    <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                                        <Workflow className="w-6 h-6 text-orange-600" />
                                        How it works:
                                    </h3>
                                    <div className="space-y-6">
                                        {[
                                            "Anyone can report excess food using the KMWF website or helpline.",
                                            "Our field team inspects, collects, and safely packs the food within hours.",
                                            "The collected food is distributed across identified underprivileged neighborhoods and rural areas.",
                                            "Every pickup and delivery is documented for transparency and hygiene assurance."
                                        ].map((step, idx) => (
                                            <div key={idx} className="flex items-start gap-4">
                                                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
                                                    {idx + 1}
                                                </div>
                                                <p className="text-muted-foreground pt-1">{step}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </AnimatedSection>

                        {/* Impact Statement */}
                        <AnimatedSection variant="slideUp" triggerOnce>
                            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200/50">
                                <CardContent className="p-8">
                                    <div className="prose prose-lg max-w-none text-muted-foreground mb-6">
                                        <p>
                                            This process ensures that good food never goes to waste, and no one sleeps hungry while blessings go uneaten. It's a system that turns gratitude into nourishment — where every leftover becomes a lifeline.
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <Button className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 hover:opacity-90">
                                            Report Extra Food
                                            <ArrowRight className="ml-2 w-5 h-5" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* Section 10: Employment & Dignity Support */}
            <section id="employment-support" className="py-16 md:py-24 bg-muted/30">
                <div className="container mx-auto px-4 max-w-6xl">
                    <AnimatedSection variant="fade" className="text-center mb-16" triggerOnce>
                        <Badge className="mb-4 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                            <Users className="w-4 h-4 mr-2" />
                            Section 10
                        </Badge>
                        <h2 className="text-4xl md:text-5xl mb-6">Employment & Dignity Support</h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Creating Livelihoods, Not Dependence - Restoring dignity through sustainable employment
                        </p>
                    </AnimatedSection>

                    <div className="space-y-12">
                        {/* Work Opportunities */}
                        <AnimatedSection variant="slideUp" triggerOnce>
                            <div className="grid lg:grid-cols-2 gap-8">
                                <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border-emerald-200/50">
                                    <CardContent className="p-8">
                                        <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                                            <Building2 className="w-6 h-6 text-emerald-600" />
                                            10.1 Work Opportunities & Skills Matching
                                        </h3>
                                        <p className="text-muted-foreground mb-4">
                                            Many individuals in need are not lacking ability — they lack opportunity, tools, or access to work.
                                        </p>
                                        <div className="space-y-3">
                                            {[
                                                "Repair work in the scrap workshop",
                                                "Sorting and categorization roles",
                                                "Packaging, preparation, and collection support",
                                                "Relief drives and distribution events",
                                                "Data support and administrative tasks",
                                                "External work referrals through networks"
                                            ].map((opportunity, idx) => (
                                                <div key={idx} className="flex items-center gap-3">
                                                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                                    <span className="text-sm">{opportunity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/50">
                                    <CardContent className="p-8">
                                        <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                                            <Heart className="w-6 h-6 text-blue-600" />
                                            10.2 Stipend Support Program
                                        </h3>
                                        <p className="text-muted-foreground mb-4">
                                            For individuals whose circumstances make self-sufficiency difficult:
                                        </p>
                                        <div className="space-y-3">
                                            {[
                                                "Elderly without family support",
                                                "Persons with chronic illness",
                                                "Widows with infants or multiple dependents",
                                                "Individuals with disabilities",
                                                "Terminal or long-term treatment patients"
                                            ].map((category, idx) => (
                                                <div key={idx} className="flex items-center gap-3">
                                                    <Heart className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                                    <span className="text-sm">{category}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                                            <p className="text-xs text-blue-700 dark:text-blue-300">
                                                Stipends are verified, recorded, reviewed periodically, and adjusted as needed.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </AnimatedSection>

                        {/* Future Vision */}
                        <AnimatedSection variant="slideUp" triggerOnce>
                            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200/50">
                                <CardContent className="p-8">
                                    <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                                        <Star className="w-6 h-6 text-purple-600" />
                                        10.3 Skill Growth & Future Livelihood Development
                                    </h3>
                                    <p className="text-muted-foreground mb-6">
                                        Over time, the foundation plans to expand into comprehensive skill development:
                                    </p>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {[
                                            { title: "Mini ITI Training", desc: "Technical skill development centers", icon: Settings },
                                            { title: "Vocational Programs", desc: "Low-cost skill training", icon: Award },
                                            { title: "Workshop Training", desc: "Mobile repair and electrical", icon: Building2 },
                                            { title: "Service Networks", desc: "Plumbing, electrician, tailoring", icon: Users }
                                        ].map((program, idx) => (
                                            <div key={idx} className="text-center">
                                                <div className="w-12 h-12 mx-auto rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
                                                    <program.icon className="w-6 h-6 text-purple-600" />
                                                </div>
                                                <h4 className="font-semibold mb-2">{program.title}</h4>
                                                <p className="text-sm text-muted-foreground">{program.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </AnimatedSection>
                    </div>
                </div>
            </section>
            {/* Section 11: Roles & Responsibilities */}
            <section id="roles-responsibilities" className="py-16 md:py-24">
                <div className="container mx-auto px-4 max-w-6xl">
                    <AnimatedSection variant="fade" className="text-center mb-16" triggerOnce>
                        <Badge className="mb-4 bg-red-500/10 text-red-600 border-red-500/20">
                            <Users className="w-4 h-4 mr-2" />
                            Section 11
                        </Badge>
                        <h2 className="text-4xl md:text-5xl mb-6">Roles & Responsibilities</h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Staff Structure & System Transparency - Clear roles ensure fair, efficient, and transparent support
                        </p>
                    </AnimatedSection>

                    <div className="space-y-12">
                        {/* System Hierarchy */}
                        <AnimatedSection variant="slideUp" triggerOnce>                              <Card className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 border-red-200/50">
                            <CardContent className="p-8">
                                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                                    <Building2 className="w-6 h-6 text-red-600" />
                                    11.1 System Hierarchy Overview
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { role: "Board / Governance Oversight", desc: "Strategic direction and oversight" },
                                        { role: "Program Lead", desc: "Overall program management" },
                                        { role: "Sponsorship Coordinator", desc: "Case management and coordination" },
                                        { role: "Survey Team → Verification Officer", desc: "Field verification and assessment" },
                                        { role: "Beneficiary Approval Desk", desc: "Final approval decisions" },
                                        { role: "Finance & Accounts Department", desc: "Financial management and transparency" },
                                        { role: "Collection & Workshop / Gullak Team", desc: "Material collection and pressing" },
                                        { role: "System Administrator & Data Entry", desc: "Digital system management" }
                                    ].map((level, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 rounded-lg bg-red-50 dark:bg-red-950/20">
                                            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                                                <span className="text-sm font-semibold text-red-600">{idx + 1}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">{level.role}</h4>
                                                <p className="text-sm text-muted-foreground">{level.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        </AnimatedSection>

                        {/* Key Roles */}
                        <AnimatedSection variant="slideUp" triggerOnce>
                            <div className="grid lg:grid-cols-2 gap-8">
                                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                                    <CardContent className="p-8">
                                        <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                                            <UserCheck className="w-6 h-6 text-red-600" />
                                            11.2 Role: Sponsorship Coordinator
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-medium mb-2">Primary Responsibilities:</h4>
                                                <div className="space-y-2">
                                                    {[
                                                        "Receive assistance requests (walk-in, call, WhatsApp, online form)",
                                                        "Log new cases into the Case Registry",
                                                        "Assign Surveyors based on location and workload",
                                                        "Track survey progress and follow-up",
                                                        "Present cases to Verification Officer for review"
                                                    ].map((resp, idx) => (
                                                        <div key={idx} className="flex items-start gap-2">
                                                            <CheckCircle2 className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                                            <span className="text-sm">{resp}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                                                <p className="text-xs text-red-700 dark:text-red-300">
                                                    <strong>Authority Limits:</strong> Cannot approve/reject cases, finalize category level, or disburse funds.
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                                    <CardContent className="p-8">
                                        <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                                            <Search className="w-6 h-6 text-red-600" />
                                            11.3 Role: Surveyor (Field Verification Staff)
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-medium mb-2">Responsibilities:</h4>
                                                <div className="space-y-2">
                                                    {[
                                                        "Conduct on-site visits to beneficiary households",
                                                        "Document household income & expenses",
                                                        "Capture photographs (respectfully, with consent)",
                                                        "Upload survey form and images to the system",
                                                        "Report special conditions requiring urgent review"
                                                    ].map((resp, idx) => (
                                                        <div key={idx} className="flex items-start gap-2">
                                                            <Sparkles className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                                            <span className="text-sm">{resp}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                                                <p className="text-xs text-red-700 dark:text-red-300">
                                                    <strong>Authority Limits:</strong> Cannot assign beneficiary category, promise assistance, or request payment/favors.
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </AnimatedSection>

                        {/* Ethical Standards */}
                        <AnimatedSection variant="slideUp" triggerOnce>
                            <Card className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20 border-gray-200/50">
                                <CardContent className="p-8">
                                    <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                                        <Shield className="w-6 h-6 text-gray-600" />
                                        11.4 Ethical Conduct & Confidentiality Standards
                                    </h3>
                                    <p className="text-muted-foreground mb-6">
                                        All staff, volunteers, and participants must adhere to strict ethical guidelines:
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {[
                                            "Respect beneficiary privacy",
                                            "Avoid showing poverty imagery or exploitation",
                                            "Never request payment or favors in exchange for service",
                                            "Maintain clear verbal boundaries: Support is a right, not charity"
                                        ].map((standard, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-4 rounded-lg bg-gray-100 dark:bg-gray-900/30">
                                                <Shield className="w-5 h-5 text-gray-600 flex-shrink-0" />
                                                <span className="text-sm">{standard}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* Section 12: Internal Workflows */}
            <section id="internal-workflows" className="py-16 md:py-24 bg-muted/30">
                <div className="container mx-auto px-4 max-w-6xl">
                    <AnimatedSection variant="fade" className="text-center mb-16" triggerOnce>
                        <Badge className="mb-4 bg-cyan-500/10 text-cyan-600 border-cyan-500/20">
                            <Workflow className="w-4 h-4 mr-2" />
                            Section 12
                        </Badge>
                        <h2 className="text-4xl md:text-5xl mb-6">Internal Workflows</h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Step-by-step processes explained simply for complete transparency and understanding
                        </p>
                    </AnimatedSection>

                    <div className="space-y-12">
                        {/* Beneficiary Intake Flow */}
                        <AnimatedSection variant="slideUp" triggerOnce>
                            <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 border-cyan-200/50">
                                <CardContent className="p-8">
                                    <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                                        <ArrowDown className="w-6 h-6 text-cyan-600" />
                                        12.1 Beneficiary Intake & Approval Flow
                                    </h3>
                                    <p className="text-muted-foreground mb-6">
                                        This workflow describes how a new family or individual enters the welfare system:
                                    </p>
                                    <div className="space-y-3">
                                        {[
                                            "Assistance Request Received",
                                            "Case Logged into System",
                                            "Surveyor Assigned",
                                            "Home Visit Conducted & Data Recorded",
                                            "Survey Report Submitted",
                                            "Verification Officer Cross-Checks Information",
                                            "Category Assigned (1 / 2 / 3)",
                                            "Approval Desk Reviews & Confirms Decision",
                                            "Beneficiary Profile Created in System",
                                            "Beneficiary Card Issued (Eligibility Confirmed)"
                                        ].map((step, idx) => (
                                            <div key={idx} className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-sm font-semibold text-cyan-600">{idx + 1}</span>
                                                </div>
                                                <span className="text-sm">{step}</span>
                                                {idx < 9 && <ArrowDown className="w-4 h-4 text-cyan-400 ml-auto" />}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 p-4 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                                        <p className="text-sm text-cyan-800 dark:text-cyan-200">
                                            <strong>Outcome:</strong> Family is now eligible for sponsorship, relief support, or stipends, depending on their category.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </AnimatedSection>

                        {/* Financial Record Flow */}
                        <AnimatedSection variant="slideUp" triggerOnce>
                            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                                <CardContent className="p-8">
                                    <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                                        <BarChart3 className="w-6 h-6 text-cyan-600" />
                                        12.2 Financial Record & Audit Flow
                                    </h3>
                                    <p className="text-muted-foreground mb-6">
                                        All financial transactions are traceable, documented, and reviewable:
                                    </p>
                                    <div className="grid lg:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            {[
                                                "Funds Received (Sponsorship + Scrap + Gullak + Subscriptions)",
                                                "Finance Ledger Entry (Digital Record)",
                                                "Verification Against Beneficiary Support Schedules",
                                                "Funds Disbursed to Welfare Programs"
                                            ].map((step, idx) => (
                                                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-cyan-50 dark:bg-cyan-950/20">
                                                    <div className="w-6 h-6 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                                                        <span className="text-xs font-semibold text-cyan-600">{idx + 1}</span>
                                                    </div>
                                                    <span className="text-sm">{step}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-4">
                                            {[
                                                "Monthly Summary Reports Created",
                                                "Quarterly Internal Audit",
                                                "Annual External / Legal Compliance Audit"
                                            ].map((step, idx) => (
                                                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                                                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                                        <span className="text-xs font-semibold text-green-600">{idx + 5}</span>
                                                    </div>
                                                    <span className="text-sm">{step}</span>
                                                </div>
                                            ))}
                                            <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                                <p className="text-sm text-green-800 dark:text-green-200">
                                                    <strong>Outcome:</strong> Every rupee can be explained, traced, and justified.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* Section 13: Monitoring & Accountability */}
            <section id="monitoring-accountability" className="py-16 md:py-24">
                <div className="container mx-auto px-4 max-w-6xl">
                    <AnimatedSection variant="fade" className="text-center mb-16" triggerOnce>
                        <Badge className="mb-4 bg-orange-500/10 text-orange-600 border-orange-500/20">
                            <Eye className="w-4 h-4 mr-2" />
                            Section 13
                        </Badge>
                        <h2 className="text-4xl md:text-5xl mb-6">Monitoring & Accountability</h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Ensuring support remains fair, funds are used responsibly, and trust is maintained
                        </p>
                    </AnimatedSection>

                    <div className="space-y-12">
                        {/* Monitoring Systems */}
                        <AnimatedSection variant="slideUp" triggerOnce>
                            <div className="grid lg:grid-cols-3 gap-8">
                                <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200/50">
                                    <CardContent className="p-8">
                                        <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                                            <Calendar className="w-6 h-6 text-orange-600" />
                                            13.1 Quarterly Case Review
                                        </h3>
                                        <p className="text-muted-foreground mb-4">
                                            Beneficiary situations may improve or change over time:
                                        </p>
                                        <div className="space-y-3">
                                            {[
                                                "Category levels are re-evaluated",
                                                "Support amounts may be adjusted",
                                                "Misuse results in case suspension",
                                                "Fair distribution maintained"
                                            ].map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-orange-600 flex-shrink-0" />
                                                    <span className="text-sm">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/50">
                                    <CardContent className="p-8">
                                        <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                                            <BarChart3 className="w-6 h-6 text-blue-600" />
                                            13.2 Financial Tracking
                                        </h3>
                                        <p className="text-muted-foreground mb-4">
                                            All contributions are:
                                        </p>
                                        <div className="space-y-3">
                                            {[
                                                "Digitally recorded",
                                                "Linked to source and purpose",
                                                "Stored securely for reference",
                                                "Traceable from donation to distribution"
                                            ].map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <Database className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                                    <span className="text-sm">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200/50">
                                    <CardContent className="p-8">
                                        <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                                            <Shield className="w-6 h-6 text-green-600" />
                                            13.3 Audits & Compliance
                                        </h3>
                                        <div className="space-y-3">
                                            {[
                                                { period: "Monthly", type: "Internal summaries" },
                                                { period: "Quarterly", type: "Internal audits" },
                                                { period: "Annual", type: "External audits" },
                                                { period: "Ongoing", type: "Legal compliance" }
                                            ].map((audit, idx) => (
                                                <div key={idx} className="flex items-center gap-3 p-2 rounded bg-green-100 dark:bg-green-900/30">
                                                    <Award className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                    <div>
                                                        <span className="text-sm font-medium">{audit.period}:</span>
                                                        <span className="text-sm text-muted-foreground ml-1">{audit.type}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </AnimatedSection>

                        {/* Complaint Resolution */}
                        <AnimatedSection variant="slideUp" triggerOnce>
                            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                                <CardContent className="p-8">
                                    <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                                        <MessageSquare className="w-6 h-6 text-orange-600" />
                                        13.4 Complaint Resolution & Reporting Channels
                                    </h3>
                                    <p className="text-muted-foreground mb-6">
                                        Concerns, suggestions, or complaints can be raised through multiple channels:
                                    </p>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {[
                                            { method: "In Person", desc: "At the foundation office", icon: Building2 },
                                            { method: "Website", desc: "Through contact form", icon: Globe },
                                            { method: "Phone/WhatsApp", desc: "Direct communication", icon: Phone },
                                            { method: "Email", desc: "Written complaints", icon: Mail }
                                        ].map((channel, idx) => (
                                            <div key={idx} className="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                                                <div className="w-12 h-12 mx-auto rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-3">
                                                    <channel.icon className="w-6 h-6 text-orange-600" />
                                                </div>
                                                <h4 className="font-semibold mb-2">{channel.method}</h4>
                                                <p className="text-sm text-muted-foreground">{channel.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 p-4 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                        <p className="text-sm text-orange-800 dark:text-orange-200">
                                            <strong>Important:</strong> Every report is logged and reviewed to maintain system fairness and respect.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </AnimatedSection>
                    </div>
                </div>
            </section>
            {/* Section 14: Glossary */}
            <section id="glossary" className="py-16 md:py-24 bg-muted/30">
                <div className="container mx-auto px-4 max-w-6xl">
                    <AnimatedSection variant="fade" className="text-center mb-16" triggerOnce>
                        <Badge className="mb-4 bg-violet-500/10 text-violet-600 border-violet-500/20">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Section 14
                        </Badge>
                        <h2 className="text-4xl md:text-5xl mb-6">Glossary of Terms</h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Key definitions for public clarity and understanding
                        </p>
                    </AnimatedSection>

                    <div className="space-y-8">
                        <AnimatedSection variant="slideUp" triggerOnce>
                            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                                <CardContent className="p-8">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        {[
                                            { term: "Beneficiary", def: "A person or family receiving support through the foundation." },
                                            { term: "Surveyor", def: "The field staff member who conducts home visits and collects case information." },
                                            { term: "Verification Officer", def: "The role responsible for reviewing survey findings and confirming eligibility." },
                                            { term: "Category Level (1/2/3)", def: "Classification of a beneficiary based on need severity." },
                                            { term: "Sponsorship", def: "Ongoing monthly support provided to a verified beneficiary." },
                                            { term: "Stipend Support", def: "Monthly financial assistance provided to those unable to earn." },
                                            { term: "Scrap Donation", def: "Contribution of material items that can be repaired, reused, or recycled for welfare funding." },
                                            { term: "Upcycling", def: "Converting used or damaged items into usable goods (e.g., mattresses)." },
                                            { term: "Gullak", def: "A registered community donation box with an assigned caretaker and tracking ID." },
                                            { term: "Sadqa Subscription", def: "A recurring daily, weekly, monthly, or yearly charitable contribution plan." },
                                            { term: "Welfare Support Pool", def: "The combined fund used to sustain monthly support programs and relief activities." },
                                            { term: "Case Registry", def: "The system record of all requests for assistance." },
                                            { term: "Beneficiary Profile", def: "The documented record of a verified beneficiary, stored in the system." },
                                            { term: "Disbursement", def: "The release of support funds or goods to a beneficiary." },
                                            { term: "Audit", def: "A formal review of records to ensure transparency and accountability." }
                                        ].map((item, idx) => (
                                            <div key={idx} className="p-4 rounded-lg bg-violet-50 dark:bg-violet-950/20 border border-violet-200/50">
                                                <h4 className="font-semibold text-violet-800 dark:text-violet-200 mb-2">{item.term}</h4>
                                                <p className="text-sm text-muted-foreground">{item.def}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* Section 15: FAQ */}
            <section id="faq" className="py-16 md:py-24">
                <div className="container mx-auto px-4 max-w-6xl">
                    <AnimatedSection variant="fade" className="text-center mb-16" triggerOnce>
                        <Badge className="mb-4 bg-teal-500/10 text-teal-600 border-teal-500/20">
                            <HelpCircle className="w-4 h-4 mr-2" />
                            Section 15
                        </Badge>
                        <h2 className="text-4xl md:text-5xl mb-6">Frequently Asked Questions</h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Common questions from donors, beneficiaries, volunteers, and community members
                        </p>
                    </AnimatedSection>

                    <div className="space-y-8">
                        <AnimatedSection variant="slideUp" triggerOnce>
                            <div className="grid lg:grid-cols-2 gap-8">
                                {[
                                    {
                                        q: "How does the foundation identify who needs help?",
                                        a: "Every case goes through a documented process: request received → surveyor visits → verification officer checks → case categorized → beneficiary profile added. Only verified cases receive support."
                                    },
                                    {
                                        q: "What is the difference between Category 1, 2, and 3 families?",
                                        a: "Category 1: Severe hardship → Highest priority. Category 2: Low income but partially stable → Partial support. Category 3: Generally stable but vulnerable → Emergency/medical support only."
                                    },
                                    {
                                        q: "If I sponsor someone, will I know who I am helping?",
                                        a: "Yes — you receive a beneficiary summary after sponsorship begins. However, personal privacy and dignity are always respected. Direct contact is arranged only when appropriate."
                                    },
                                    {
                                        q: "How long does sponsorship last?",
                                        a: "Sponsorship continues until the sponsor chooses to stop, the family's condition improves, or special circumstances require change. It's designed to be stable but flexible."
                                    },
                                    {
                                        q: "Can I change, pause, or cancel my sponsorship?",
                                        a: "Yes. You may adjust the amount, pause temporarily, or end sponsorship at any time. The Sponsorship Coordinator ensures no beneficiary is left unsupported without transition."
                                    },
                                    {
                                        q: "Where does scrap and donated material go?",
                                        a: "Every item follows this process: Sorting → Repair/Reuse → Resale/Recycling → Revenue → Welfare Support. No donated item is wasted. Every step is documented."
                                    },
                                    {
                                        q: "What does the Gullak system do?",
                                        a: "Gullak boxes allow small, daily community contributions. Each has a unique ID, registered caretaker, GPS location mapping, and logged collection cycles. All funds go to welfare support."
                                    },
                                    /*
                                    {
                                        q: "Are donations tax-deductible?",
                                        a: "Yes. The organization is registered under 80G for tax-deductible donations. Details and receipts can be issued upon request."
                                    },
                                    */
                                    {
                                        q: "How can I volunteer or get involved?",
                                        a: "You can contribute by sponsoring a beneficiary, setting up Sadqa subscription, donating scrap/clothing, helping in relief drives, or hosting a Gullak. Volunteers are welcomed and guided."
                                    },
                                    {
                                        q: "How do you ensure transparency?",
                                        a: "Through verified beneficiary systems, documented processes, regular audits, digital record-keeping, public documentation, and multiple complaint channels. Every step is traceable and accountable."
                                    }
                                ].map((faq, idx) => (
                                    <Card key={idx} className="bg-card/50 backdrop-blur-sm border-border/50">
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-4">
                                                <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
                                                    <HelpCircle className="w-5 h-5 text-teal-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold mb-3 text-teal-800 dark:text-teal-200">{faq.q}</h4>
                                                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* Section 16: Closing Message */}
            <section id="closing" className="py-16 md:py-24 bg-muted/30">
                <div className="container mx-auto px-4 max-w-6xl">
                    <AnimatedSection variant="fade" className="text-center mb-16" triggerOnce>
                        <Badge className="mb-4 bg-rose-500/10 text-rose-600 border-rose-500/20">
                            <Heart className="w-4 h-4 mr-2" />
                            Section 16
                        </Badge>
                        <h2 className="text-4xl md:text-5xl mb-6">Closing Message</h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            A warm, human, hopeful ending to our comprehensive documentation
                        </p>
                    </AnimatedSection>

                    <div className="space-y-12">
                        <AnimatedSection variant="slideUp" triggerOnce>
                            <Card className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 border-rose-200/50">
                                <CardContent className="p-12 text-center">
                                    <Quote className="w-16 h-16 text-rose-500 mx-auto mb-8" />
                                    <div className="prose prose-lg max-w-4xl mx-auto text-muted-foreground">
                                        <p className="text-xl mb-6">
                                            Khadim-e-Millat Welfare Foundation is built on a simple belief: support is most meaningful when it is shared with responsibility and dignity.
                                        </p>
                                        <p className="text-lg mb-6">
                                            The work we do is not based on charity alone. It is based on community, structure, and accountability—so that every contribution, whether large or small, becomes a continuous source of relief and stability for someone in need.
                                        </p>
                                        <div className="grid md:grid-cols-2 gap-8 my-8">
                                            <div className="text-left">
                                                <h4 className="font-semibold mb-4 text-rose-800 dark:text-rose-200">Our system ensures that:</h4>
                                                <div className="space-y-2">
                                                    {[
                                                        "Help is verified, not assumed",
                                                        "Support is sustained, not temporary",
                                                        "Resources are used carefully, not wastefully",
                                                        "Dignity is protected, not compromised"
                                                    ].map((principle, idx) => (
                                                        <div key={idx} className="flex items-center gap-3">
                                                            <CheckCircle2 className="w-5 h-5 text-rose-500 flex-shrink-0" />
                                                            <span className="text-sm">{principle}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="text-left">
                                                <h4 className="font-semibold mb-4 text-rose-800 dark:text-rose-200">Everyone can contribute through:</h4>
                                                <div className="space-y-2">
                                                    {[
                                                        "Sponsorship support",
                                                        "Daily Sadqa subscriptions",
                                                        "Scrap and clothing donations",
                                                        "Volunteering time and skills",
                                                        "Hosting or caretaking a Gullak"
                                                    ].map((way, idx) => (
                                                        <div key={idx} className="flex items-center gap-3">
                                                            <Heart className="w-5 h-5 text-rose-500 flex-shrink-0" />
                                                            <span className="text-sm">{way}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-lg mb-6">
                                            We recognize that every household, shop, student, professional, and neighbor has the ability to contribute in some way. This foundation grows not because of any one person, but because people choose to participate together.
                                        </p>
                                        <p className="text-lg mb-8">
                                            If you are reading this, you are already part of that shared responsibility.
                                        </p>
                                        <div className="text-center">
                                            <p className="text-xl font-semibold text-rose-800 dark:text-rose-200 mb-4">
                                                Thank you for being here — and for standing with the intention to uplift others with fairness, clarity, and sincerity.
                                            </p>
                                            <div className="space-y-2 text-lg font-medium text-rose-700 dark:text-rose-300">
                                                <p>Together, we are Khadim-e-Millat</p>
                                                <p>Together, we keep the work moving.</p>
                                                <p>Together, we make support sustainable.</p>
                                                <p>Together, we honor dignity.</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </AnimatedSection>
                    </div>
                </div>
            </section>


            {/* Contact Information */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <AnimatedSection variant="fade" className="text-center mb-12" triggerOnce>
                        <h2 className="text-3xl md:text-4xl mb-4">
                            Get Involved in Our Mission
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Whether you need assistance, want to contribute, or wish to volunteer — we're here to help
                        </p>
                    </AnimatedSection>

                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <AnimatedSection variant="slideUp" delay={0.1}>
                            <Card className="bg-card/50 backdrop-blur-sm border-border/50 text-center hover:border-primary/50 transition-all duration-300">
                                <CardContent className="p-6">
                                    <Phone className="w-10 h-10 text-primary mx-auto mb-4" />
                                    <h3 className="text-lg mb-2">Request Assistance</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Call our helpline to start the verification process
                                    </p>
                                    <Link href="/contact">
                                        <Button variant="outline" size="sm">
                                            Contact Us
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </AnimatedSection>

                        <AnimatedSection variant="slideUp" delay={0.2}>
                            <Card className="bg-card/50 backdrop-blur-sm border-border/50 text-center hover:border-primary/50 transition-all duration-300">
                                <CardContent className="p-6">
                                    <Heart className="w-10 h-10 text-primary mx-auto mb-4" />
                                    <h3 className="text-lg mb-2">Make a Donation</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Contribute through our secure, transparent channels
                                    </p>
                                    <Link href="/donate">
                                        <Button variant="outline" size="sm">
                                            Donate Now
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </AnimatedSection>

                        <AnimatedSection variant="slideUp" delay={0.3}>
                            <Card className="bg-card/50 backdrop-blur-sm border-border/50 text-center hover:border-primary/50 transition-all duration-300">
                                <CardContent className="p-6">
                                    <Users className="w-10 h-10 text-primary mx-auto mb-4" />
                                    <h3 className="text-lg mb-2">Volunteer With Us</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Join our field team and be part of the workflow
                                    </p>
                                    <Link href="/contact">
                                        <Button variant="outline" size="sm">
                                            Apply to Join
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </AnimatedSection>
                    </div>
                </div>
            </section>
        </>
    );
}