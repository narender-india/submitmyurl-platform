import { Navbar, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle2, Globe2, Rocket, TrendingUp, Search, ShieldCheck } from "lucide-react";
import heroImage from "@assets/generated_images/abstract_blue_and_purple_digital_growth_waves_background.png";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-900 py-20 text-white md:py-32">
          <div className="absolute inset-0 z-0">
             <div 
              className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen"
              style={{ backgroundImage: `url(${heroImage})` }} 
             />
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90" />
          </div>
          
          <div className="container relative z-10 mx-auto text-center">
            <div className="mx-auto max-w-3xl space-y-6">
              <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm backdrop-blur-sm">
                <span className="mr-2 flex h-2 w-2 rounded-full bg-green-400"></span>
                India's #1 Website Promotion Platform
              </div>
              <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
                Get Your Website Discovered <span className="text-blue-400">Globally</span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-slate-300 md:text-xl">
                Submit your URL to 500+ directories instantly. Get free backlinks, increase traffic, and boost your SEO rankings with one click.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/submit">
                  <Button size="lg" className="h-12 px-8 text-lg font-semibold shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                    Submit Website Now
                  </Button>
                </Link>
                <Link href="/status">
                  <Button size="lg" variant="outline" className="h-12 border-white/20 bg-white/5 px-8 text-lg text-white hover:bg-white/10 hover:text-white">
                    Check Status
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="mb-4 font-heading text-3xl font-bold">Why Choose SubmitMyURL?</h2>
              <p className="text-muted-foreground">Everything you need to grow your website traffic</p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: <Globe2 className="h-10 w-10 text-primary" />,
                  title: "Global Reach",
                  desc: "Your website gets distributed to our partner network across 50+ countries."
                },
                {
                  icon: <Rocket className="h-10 w-10 text-orange-500" />,
                  title: "Instant Approval",
                  desc: "Skip the waiting queue. Get your website listed and live instantly with Pro plans."
                },
                {
                  icon: <TrendingUp className="h-10 w-10 text-green-500" />,
                  title: "Traffic Growth",
                  desc: "Guaranteed visitors and high-quality do-follow backlinks for better SEO."
                }
              ].map((feature, i) => (
                <div key={i} className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-muted">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 font-heading text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Preview */}
        <section className="border-t bg-muted/30 py-20">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="mb-4 font-heading text-3xl font-bold">Simple, Transparent Pricing</h2>
              <p className="text-muted-foreground">Choose the plan that fits your growth needs</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              {/* Free Plan */}
              <div className="rounded-2xl border bg-card p-8 shadow-sm">
                <h3 className="font-heading text-xl font-bold">Free Forever</h3>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-bold">₹0</span>
                  <span className="text-muted-foreground">/forever</span>
                </div>
                <ul className="mb-8 space-y-3">
                  <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-green-500" /> Basic Listing</li>
                  <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-green-500" /> 50 Visitors Guarantee</li>
                  <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-green-500" /> Manual Review (24-72h)</li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="h-4 w-4" /> Standard Support</li>
                </ul>
                <Link href="/submit">
                  <Button variant="outline" className="w-full">Get Started</Button>
                </Link>
              </div>

              {/* Pro Plan - Highlighted */}
              <div className="relative rounded-2xl border-2 border-primary bg-card p-8 shadow-xl md:-mt-4 md:mb-4">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-white uppercase tracking-wide">
                  Recommended
                </div>
                <h3 className="font-heading text-xl font-bold text-primary">Pro Plan</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold">₹199</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="mb-8 space-y-3">
                  <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="h-4 w-4 text-primary" /> Priority Listing</li>
                  <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="h-4 w-4 text-primary" /> 2,000 Visitors Guarantee</li>
                  <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="h-4 w-4 text-primary" /> Instant Approval</li>
                  <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="h-4 w-4 text-primary" /> No Ads in Dashboard</li>
                  <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="h-4 w-4 text-primary" /> Do-Follow Backlinks</li>
                </ul>
                <Link href="/submit">
                  <Button className="w-full shadow-lg shadow-blue-500/20">Choose Pro</Button>
                </Link>
              </div>

              {/* Business Plan */}
              <div className="rounded-2xl border bg-card p-8 shadow-sm">
                <h3 className="font-heading text-xl font-bold">Business</h3>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-bold">₹499</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="mb-8 space-y-3">
                  <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-green-500" /> Featured Listing</li>
                  <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-green-500" /> 5,000 Visitors Guarantee</li>
                  <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-green-500" /> Instant Approval</li>
                  <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-green-500" /> Priority Email Support</li>
                </ul>
                <Link href="/submit">
                  <Button variant="outline" className="w-full">Choose Business</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
