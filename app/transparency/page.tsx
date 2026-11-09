import { AnimatedSection } from '@/components/animations';
import type { Metadata } from 'next';
import { Card, CardContent } from "@/components/ui/card";
import { Badge, Button } from "@/components/ui";
import {
    Shield,
    FileCheck,
    TrendingUp,
    Users,
    CheckCircle2,
    Download,
    Mail,
    BarChart3,
    Wallet,
    CreditCard,
    Smartphone,
    Building2,
    Eye,
    Award,
    FileText,
    Quote,
    ExternalLink,
    Scale,
    BookOpen,
} from "lucide-react";

export const metadata: Metadata = {
    title: 'Transparency & Accountability - Khadim-e-Millat',
    description: 'See exactly how your donations are used — verified beneficiaries, audited accounts, and full reports at Khadim-e-Millat Welfare Foundation.'
};

// Motion shim to avoid importing motion/react directly; renders plain elements.
const motion: any = {
    div: (props: any) => {
        const { children, className, ...rest } = props;
        return <div className={className} {...rest}>{children}</div>;
    },
    section: (props: any) => {
        const { children, className, ...rest } = props;
        return <section className={className} {...rest}>{children}</section>;
    }
};

export default function TransparencyPage() {
    const donationFlow = [
        {
            category: "Scrap & Clothing Recycling",
            destination: "Welfare fund",
            icon: TrendingUp,
            color: "from-green-500 to-emerald-500",
        },
        {
            category: "Sponsorships",
            destination: "Verified families",
            icon: Users,
            color: "from-blue-500 to-purple-500",
        },
        {
            category: "Campaigns",
            destination: "Urgent needs (medical, education, etc.)",
            icon: FileCheck,
            color: "from-purple-500 to-pink-500",
        },
        {
            category: "Employment & Stipends",
            destination: "Sustainable livelihoods",
            icon: Wallet,
            color: "from-orange-500 to-red-500",
        },
        {
            category: "Operations",
            destination: "Organisation maintenance & field logistics",
            icon: Building2,
            color: "from-cyan-500 to-blue-500",
        },
    ];

    const verificationSteps = [
        {
            title: "On-Ground Surveys",
            description:
                "Trained field volunteers conduct structured surveys to identify families or individuals in genuine need.",
            icon: Users,
        },
        {
            title: "Assessment",
            description:
                "We assess income, living conditions, and actual need before enrollment.",
            icon: FileCheck,
        },
        {
            title: "Verification",
            description:
                "Multiple checks ensure that contributions reach the genuinely deserving.",
            icon: CheckCircle2,
        },
        {
            title: "Ongoing Monitoring",
            description:
                "Regular follow-ups and updates to maintain accuracy and trust.",
            icon: Eye,
        },
    ];

    const trackingFeatures = [
        {
            title: "Unique IDs & Receipts",
            description:
                "Each donation is recorded and traceable through unique transaction IDs.",
            icon: FileText,
        },
        {
            title: "Sponsor Updates",
            description:
                "Periodic updates about supported families with stories and impact photos.",
            icon: Users,
        },
        {
            title: "Scrap Reports",
            description:
                "Summary reports of proceeds and fund allocation available on request.",
            icon: BarChart3,
        },
    ];

    const verificationLinks = [
        {
            name: "Tofler",
            url: "https://www.tofler.in/khadimemillat-welfare-foundation/company/U85300UP2021NPL143120",
        },
        {
            name: "Falcon Ebiz",
            url: "https://www.falconebiz.com/company/KHADIMEMILLAT-WELFARE-FOUNDATION-U85300UP2021NPL143120",
        },
        {
            name: "Zauba Corp",
            url: "https://www.zaubacorp.com/KHADIMEMILLAT-WELFARE-FOUNDATION-U85300UP2021NPL143120",
        },
    ];

    const governanceFeatures = [
        {
            title: "Quarterly Reviews & Internal Audits",
            description:
                "To ensure complete financial and ethical compliance",
            icon: BarChart3,
        },
        {
            title: "Transparent Record-Keeping",
            description:
                "Digital ledgers for donations, scrap proceeds, and program expenses",
            icon: FileText,
        },
        {
            title: "Annual External Audit",
            description:
                "Conducted by a licensed Chartered Accountant",
            icon: Award,
        },
        {
            title: "Verified Online Presence",
            description:
                "Legal and financial details can be independently viewed on multiple platforms",
            icon: Eye,
        },
    ];

    const paymentMethods = [
        {
            icon: CreditCard,
            title: "Online Donations",
            description:
                "via Razorpay, supporting UPI, debit/credit cards, net banking, and digital wallets",
            badge: "Instant Receipt",
        },
        {
            icon: Building2,
            title: "Offline Donations",
            description:
                "At our office or through our doorstep cash-collection request service",
            badge: "Receipt Provided",
        },
        {
            icon: TrendingUp,
            title: "Scrap & Clothing",
            description:
                "On-site pickup or drop-off at collection centres",
            badge: "Free Pickup",
        },
    ];

    const integrityMeasures = [
        {
            title: "Independent CA Review",
            description:
                "Chartered accountant review conducted annually",
            icon: Award,
        },
        {
            title: "NGO Best Practices",
            description:
                "Record-keeping as per NGO best-practice standards",
            icon: FileCheck,
        },
        {
            title: "Digital Ledgering",
            description:
                "For scrap proceeds, sponsorships, and disbursements",
            icon: BarChart3,
        },
        {
            title: "Compliance Reviews",
            description: "Periodic internal compliance reviews",
            icon: Shield,
        },
    ];

    return (
        <>
            {/* metadata provided via Next.js `metadata` export above */}
            <div className="min-h-screen bg-background">
                {/* Hero Section */}
                <AnimatedSection variant="fade" className="relative py-20 md:py-32 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/10 to-background"></div>
                    <div className="container mx-auto px-4 relative z-10">
                        <AnimatedSection variant="fade" delay={0.2} className="max-w-4xl mx-auto text-center">
                            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                                Transparency & Accountability
                            </Badge>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6">
                                Built on Trust — Strengthened by Openness
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                                At Khadim-e-Millat, transparency isn't a
                                checkbox — it's the foundation of every effort.
                                From how we verify families to how every rupee
                                is allocated, we ensure clarity for every
                                supporter.
                            </p>
                        </AnimatedSection>
                    </div>
                </AnimatedSection>

                {/* How We Use Donations */}
                <section className="py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <AnimatedSection variant="fade" className="text-center mb-12" triggerOnce>
                            <h2 className="text-3xl md:text-4xl mb-4">
                                How We Use Donations
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                Where Your Contribution Goes
                            </p>
                        </AnimatedSection>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {donationFlow.map((item, index) => (
                                <AnimatedSection key={index} variant="scale" delay={index * 0.06} className="">
                                    <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hoact:border-primary/50 transition-all duration-300 group">
                                        <CardContent className="p-6">
                                            <div
                                                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                                            >
                                                <item.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className="text-lg mb-2">
                                                {item.category}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                                                <span>{item.destination}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Verification Process */}
                <section className="py-16 md:py-24 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <AnimatedSection variant="fade" className="text-center mb-12" triggerOnce>
                            <h2 className="text-3xl md:text-4xl mb-4">
                                Verification Process
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                                Every family or individual we assist goes
                                through a structured on-ground survey conducted
                                by our field volunteers.
                            </p>
                        </AnimatedSection>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {verificationSteps.map((step, index) => (
                                <AnimatedSection key={index} variant="scale" delay={index * 0.06} className="">
                                    <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 text-center">
                                        <CardContent className="p-6">
                                            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                                <step.icon className="w-8 h-8 text-primary" />
                                            </div>
                                            <h3 className="text-lg mb-2">
                                                {step.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {step.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Donation Tracking */}
                <section className="py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <AnimatedSection variant="fade" className="text-center mb-12" triggerOnce>
                            <h2 className="text-3xl md:text-4xl mb-4">
                                Donation Tracking
                            </h2>
                        </AnimatedSection>

                        <div className="grid md:grid-cols-3 gap-6 mb-12">
                            {trackingFeatures.map((feature, index) => (
                                <AnimatedSection key={index} variant="scale" delay={index * 0.06} className="">
                                    <Card className="h-full bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
                                        <CardContent className="p-6">
                                            <feature.icon className="w-10 h-10 text-primary mb-4" />
                                            <h3 className="text-lg mb-2">
                                                {feature.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {feature.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Governance & Oversight */}
                <section className="py-16 md:py-24 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <AnimatedSection variant="fade" className="text-center mb-12" triggerOnce>
                                <h2 className="text-3xl md:text-4xl mb-4">
                                    Governance & Oversight
                                </h2>
                                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                                    Legally Registered, Independently Verified,
                                    and Fully Accountable
                                </p>
                            </AnimatedSection>

                            {/* Legal Registration Card */}
                            <AnimatedSection variant="fade" className="mb-8" triggerOnce>
                                <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
                                    <CardContent className="p-6 md:p-8">
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                                                <Scale className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl md:text-2xl mb-2">
                                                    Legal Registration & Recognition
                                                </h3>
                                                <p className="text-muted-foreground">
                                                    Khadim-e-Millat Welfare Foundation is
                                                    a{" "}
                                                    <strong>
                                                        legally registered non-profit
                                                    </strong>{" "}
                                                    under the Companies Act, 2013 (
                                                    <strong>
                                                        CIN U85300UP2021NPL143120
                                                    </strong>
                                                    ), recognised by the Government of
                                                    India
                                                    {/* and eligible for{" "}
                                                    <strong>
                                                        Income-Tax Exemptions under Sections
                                                        80G and 12A
                                                    </strong> */}
                                                    .
                                                </p>
                                            </div>
                                        </div>

                                        <p className="text-muted-foreground mb-6">
                                            Our operations are supervised by a{" "}
                                            <strong>
                                                registered executive board and field
                                                coordinators
                                            </strong>
                                            , supported by qualified accountants and
                                            independent reviewers.
                                        </p>
                                    </CardContent>
                                </Card>
                            </AnimatedSection>

                            {/* Governance Features Grid */}
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                {governanceFeatures.map((feature, index) => (
                                    <AnimatedSection key={index} variant="scale" delay={index * 0.06} className="">
                                        <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300">
                                            <CardContent className="p-6 text-center">
                                                <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                                    <feature.icon className="w-7 h-7 text-primary" />
                                                </div>
                                                <h3 className="text-lg mb-2">
                                                    {feature.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {feature.description}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </AnimatedSection>
                                ))}
                            </div>

                            {/* MCA Document & Verification Links */}
                            <AnimatedSection variant="fade" className="grid lg:grid-cols-2 gap-8" triggerOnce>
                                {/* MCA Document */}
                                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <BookOpen className="w-6 h-6 text-primary" />
                                            <h3 className="text-xl">
                                                Ministry of Corporate Affairs
                                            </h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Official registration document from MCA
                                            Portal showing our active legal status:
                                        </p>
                                        <div className="rounded-lg overflow-hidden border border-border/50 mb-4">
                                            <img
                                                src="assets/mca-proof.jpg"
                                                alt="Ministry of Corporate Affairs - Khadim-e-Millat Welfare Foundation Registration Document"
                                                className="w-full h-auto"
                                            />
                                        </div>
                                        <div className="bg-muted/50 rounded-lg p-4">
                                            <p className="text-sm text-muted-foreground mb-2">
                                                <strong>
                                                    How to verify on MCA Portal:
                                                </strong>
                                            </p>
                                            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                                                <li>
                                                    Visit <strong>mca.gov.in</strong>
                                                </li>
                                                <li>
                                                    Go to{" "}
                                                    <strong>
                                                        MCA Services → Master Data → View
                                                        Companies
                                                    </strong>
                                                </li>
                                                <li>
                                                    Enter CIN:{" "}
                                                    <strong>U85300UP2021NPL143120</strong>
                                                </li>
                                            </ol>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Verification Links */}
                                <div className="space-y-6">
                                    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Eye className="w-6 h-6 text-primary" />
                                                <h3 className="text-xl">
                                                    Independent Verification
                                                </h3>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-4">
                                                Our legal and financial details can be
                                                independently viewed on:
                                            </p>
                                            <div className="space-y-3">
                                                {verificationLinks.map(
                                                    (link, index) => (
                                                        <a
                                                            key={index}
                                                            href={link.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="block"
                                                        >
                                                            <Button
                                                                variant="outline"
                                                                className="w-full justify-between hoact:bg-primary/10 hoact:border-primary/50 transition-all"
                                                            >
                                                                <span>
                                                                    Verify on {link.name}
                                                                </span>
                                                                <ExternalLink className="w-4 h-4" />
                                                            </Button>
                                                        </a>
                                                    ),
                                                )}
                                                <a
                                                    href="https://www.mca.gov.in/content/mca/global/en/mca/master-data/MDS.html"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block"
                                                >
                                                    <Button
                                                        variant="outline"
                                                        className="w-full justify-between bg-primary/5 border-primary/30 hoact:bg-primary/10 hoact:border-primary/50 transition-all"
                                                    >
                                                        <span>🔗 Verify on MCA Portal</span>
                                                        <ExternalLink className="w-4 h-4" />
                                                    </Button>
                                                </a>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Trust Quote */}
                                    <Card className="bg-gradient-to-br from-primary to-purple-500 border-0">
                                        <CardContent className="p-6">
                                            <Quote className="w-8 h-8 text-white/80 mb-3" />
                                            <p className="text-white italic mb-4">
                                                We treat every contribution — money,
                                                material or time — as an{" "}
                                                <strong>amanah</strong> (trust), and
                                                invite everyone to verify our
                                                authenticity before they give.
                                            </p>
                                            <div className="pt-4 border-t border-white/20">
                                                <p className="text-white/90 text-sm">
                                                    Complete transparency isn't just our
                                                    policy — it's our promise.
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </AnimatedSection>
                        </div>
                    </div>
                </section>

                {/* Financials & Impact Reports */}
                <section className="py-16 md:py-24 overflow-hidden">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <AnimatedSection variant="fade" className="text-center mb-12" triggerOnce>
                            <h2 className="text-3xl md:text-4xl mb-4">
                                Financials & Impact Reports
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                Your Contribution, Accounted for — Every Step
                                of the Way
                            </p>
                        </AnimatedSection>

                            <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 w-full overflow-hidden">
                                {/* Fund Allocation */}
                                <AnimatedSection variant="slideUp" delay={0.1} className="w-full min-w-0">
                                    <Card className="bg-card/50 backdrop-blur-sm border-border/50 w-full">
                                        <CardContent className="p-6 md:p-8">
                                            <h3 className="text-2xl mb-4">
                                                Fund Allocation Overview
                                            </h3>
                                            <p className="text-muted-foreground mb-6">
                                                Our welfare model is built on balanced
                                                sustainability:
                                            </p>
                                            <div className="space-y-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                                        <TrendingUp className="w-4 h-4 text-green-500" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium mb-1">
                                                            Scrap Proceeds
                                                        </h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            Fuel nearly half of our welfare
                                                            programs through responsible
                                                            recycling.
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                                        <Users className="w-4 h-4 text-blue-500" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium mb-1">
                                                            Sponsorships & Surveys
                                                        </h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            Direct monthly support to verified
                                                            families and individuals.
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                                        <FileCheck className="w-4 h-4 text-purple-500" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium mb-1">
                                                            Other Welfare Programs
                                                        </h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            Seasonal drives, education aid,
                                                            and emergency relief.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </AnimatedSection>

                                {/* Reports */}
                                <AnimatedSection variant="slideUp" delay={0.2} className="space-y-6 w-full min-w-0">
                                    <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20 w-full">
                                        <CardContent className="p-6 md:p-8">
                                            <FileText className="w-12 h-12 text-primary mb-4" />
                                            <h3 className="text-xl mb-4">
                                                Annual Reports & Financial Summaries
                                            </h3>
                                            <p className="text-muted-foreground mb-6">
                                                We publish yearly statements covering:
                                            </p>
                                            <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                                                <li className="flex gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                                    <span>
                                                        Total donations & scrap proceeds
                                                        received
                                                    </span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                                    <span>Program-wise expenditure</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                                    <span>
                                                        Administrative & operational costs
                                                    </span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                                    <span>Community impact data</span>
                                                </li>
                                            </ul>
                                            <div className="space-y-3">
                                                <Button
                                                    className="w-full justify-between"
                                                    variant="outline"
                                                >
                                                    Latest Annual Report
                                                    <span>coming soon</span>
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    className="w-full justify-between"
                                                    variant="outline"
                                                >
                                                    Quarterly Financial Summary
                                                    <span>coming soon</span>
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-card/50 backdrop-blur-sm border-border/50 w-full">
                                        <CardContent className="p-6">
                                            <Quote className="w-8 h-8 text-primary mb-3" />
                                            <p className="text-lg italic text-muted-foreground">
                                                "True charity is transparent — because
                                                every act of kindness deserves clarity,
                                                and every donor deserves trust."
                                            </p>
                                        </CardContent>
                                    </Card>
                                </AnimatedSection>
                            </div>
                    </div>
                </section>

                {/* Payment Options */}
                <section className="py-16 md:py-24 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <AnimatedSection variant="fade" className="text-center mb-12" triggerOnce>
                            <h2 className="text-3xl md:text-4xl mb-4">
                                Payment & Donation Options
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                We strive to make giving simple, safe, and
                                inclusive.
                            </p>
                        </AnimatedSection>

                        <div className="grid md:grid-cols-3 gap-6">
                            {paymentMethods.map((method, index) => (
                                <AnimatedSection key={index} variant="slideUp" delay={index * 0.1}>
                                    <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hoact:border-primary/50 transition-all duration-300">
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <method.icon className="w-10 h-10 text-primary" />
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {method.badge}
                                                </Badge>
                                            </div>
                                            <h3 className="text-lg mb-2">
                                                {method.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {method.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </AnimatedSection>
                            ))}
                        </div>

                        <AnimatedSection variant="fade" className="mt-8 max-w-3xl mx-auto" triggerOnce>
                            <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
                                <CardContent className="p-6">
                                    <Shield className="w-8 h-8 text-primary mb-3" />
                                    <p className="text-sm text-muted-foreground">
                                        All online transactions are processed
                                        through secure, PCI-compliant gateways, and
                                        donors receive instant confirmations and
                                        receipts.
                                    </p>
                                </CardContent>
                            </Card>
                        </AnimatedSection>
                    </div>
                </section>

                {/* Financial Integrity */}
                <section className="py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <AnimatedSection variant="fade" className="text-center mb-12" triggerOnce>
                            <h2 className="text-3xl md:text-4xl mb-4">
                                How We Maintain Financial Integrity
                            </h2>
                        </AnimatedSection>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {integrityMeasures.map((measure, index) => (
                                <AnimatedSection key={index} variant="slideUp" delay={index * 0.1}>
                                    <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 text-center">
                                        <CardContent className="p-6">
                                            <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                                <measure.icon className="w-7 h-7 text-primary" />
                                            </div>
                                            <h3 className="text-lg mb-2">
                                                {measure.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {measure.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </AnimatedSection>
                            ))}
                        </div>

                        <AnimatedSection variant="fade" className="mt-12 text-center" triggerOnce>
                            <p className="text-lg text-muted-foreground italic">
                                Transparency today ensures trust tomorrow.
                            </p>
                        </AnimatedSection>
                    </div>
                </section>

                {/* Join Our Circle of Accountability */}
                <section className="py-16 md:py-24 bg-gradient-to-br from-primary/20 via-purple-500/10 to-background">
                    <div className="container mx-auto px-4">
                        <AnimatedSection variant="fade" className="max-w-4xl mx-auto" triggerOnce>
                            <Card className="bg-gradient-to-br from-primary to-purple-500 border-0">
                                <CardContent className="p-8 md:p-12 text-center">
                                    <h2 className="text-3xl md:text-4xl text-white mb-4">
                                        Join Our Circle of Accountability
                                    </h2>
                                    <p className="text-white/90 mb-6">
                                        You can always request detailed information
                                        or project-specific expenditure breakdowns.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                        <div className="flex items-center gap-3 text-white">
                                            <Mail className="w-5 h-5" />
                                            <span>
                                                transparency@khadimemillat.org
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-8 pt-8 border-t border-white/20">
                                        <p className="text-lg text-white italic">
                                            "Review our reports, join our mission, and
                                            witness how every rupee turns into real
                                            impact."
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </AnimatedSection>
                    </div>
                </section>
            </div>
        </>
    );
}