import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Navbar, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { CheckCircle2, ChevronRight, ChevronLeft, ShieldCheck, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { db, Plan, Category } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";

// Validation Schema
const step1Schema = z.object({
  websiteUrl: z.string().url({ message: "Please enter a valid URL (include http:// or https://)" }),
  websiteName: z.string().min(3, "Website name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  category: z.enum(['Business', 'Blog', 'E-commerce', 'Portfolio', 'Other'] as const),
  description: z.string().min(20, "Description must be at least 20 characters").max(500),
});

type Step1Data = z.infer<typeof step1Schema>;

const plans: { id: Plan; name: string; price: number; visitors: string; features: string[] }[] = [
  {
    id: "free",
    name: "Free Forever",
    price: 0,
    visitors: "50 Visitors",
    features: ["Basic Listing", "Manual Review (24-72h)", "Standard Support"]
  },
  {
    id: "pro",
    name: "Pro",
    price: 199,
    visitors: "2,000 Visitors",
    features: ["Priority Listing", "Instant Approval", "No Ads in Dashboard", "Do-Follow Backlinks"]
  },
  {
    id: "business",
    name: "Business",
    price: 499,
    visitors: "5,000 Visitors",
    features: ["Featured Listing", "Priority Support", "Instant Approval", "Extended Reach"]
  }
];

export default function Submit() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Step1Data> & { plan: Plan }>({
    plan: "pro" // Default recommended
  });
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, trigger, watch, setValue } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      category: "Business",
      ...formData
    }
  });

  const onStep1Submit = async (data: Step1Data) => {
    // Check spam words
    const spamWords = ['casino', 'gambling', 'betting', 'porn', 'adult', 'xxx', 'crypto', 'bitcoin', 'loan', 'viagra'];
    const content = (data.description + " " + data.websiteName).toLowerCase();
    
    if (spamWords.some(word => content.includes(word))) {
      toast({
        title: "Submission Rejected",
        description: "Your content contains prohibited keywords.",
        variant: "destructive"
      });
      return;
    }

    setFormData(prev => ({ ...prev, ...data }));
    setStep(2);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // 1. Create/Get User
      const user = db.createUser(formData.email!);
      
      // 2. Create Submission
      const submission = db.createSubmission({
        userId: user.id,
        websiteUrl: formData.websiteUrl!,
        websiteName: formData.websiteName!,
        category: formData.category!,
        description: formData.description!,
        plan: formData.plan!,
      });

      setSubmissionId(submission.id);
      setStep(4);
      
      // Send confirmation email (simulated)
      console.log(`Sending email to ${formData.email} for submission ${submission.id}`);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />
      
      <main className="flex-1 container py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex justify-between relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 -translate-y-1/2 rounded-full"></div>
              <div className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-500" 
                style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
              
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 bg-white transition-all font-bold",
                  step >= s ? "border-primary text-primary" : "border-slate-300 text-slate-400",
                  step > s && "bg-primary text-white"
                )}>
                  {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs font-medium text-slate-500 px-2">
              <span>Details</span>
              <span>Select Plan</span>
              <span>Review</span>
              <span>Done</span>
            </div>
          </div>

          <Card className="shadow-lg border-0 overflow-hidden">
            <CardContent className="p-0">
              {/* HEADER */}
              <div className="bg-slate-900 text-white p-6 md:p-8">
                <h1 className="text-2xl md:text-3xl font-heading font-bold">
                  {step === 1 && "Website Details"}
                  {step === 2 && "Select a Plan"}
                  {step === 3 && "Review & Payment"}
                  {step === 4 && "Submission Successful!"}
                </h1>
                <p className="text-slate-400 mt-2">
                  {step === 1 && "Enter your website information to get started."}
                  {step === 2 && "Choose the best plan for your traffic goals."}
                  {step === 3 && "Confirm your details and complete submission."}
                  {step === 4 && "Your website has been submitted to our network."}
                </p>
              </div>

              {/* BODY */}
              <div className="p-6 md:p-8 bg-white min-h-[400px]">
                
                {/* STEP 1: DETAILS */}
                {step === 1 && (
                  <form onSubmit={handleSubmit(onStep1Submit)} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="websiteUrl">Website URL</Label>
                        <Input 
                          id="websiteUrl" 
                          placeholder="https://example.com" 
                          {...register("websiteUrl")} 
                          className={errors.websiteUrl ? "border-red-500" : ""}
                        />
                        {errors.websiteUrl && <p className="text-red-500 text-xs">{errors.websiteUrl.message}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="websiteName">Website Name</Label>
                        <Input 
                          id="websiteName" 
                          placeholder="My Awesome Business" 
                          {...register("websiteName")}
                          className={errors.websiteName ? "border-red-500" : ""}
                        />
                         {errors.websiteName && <p className="text-red-500 text-xs">{errors.websiteName.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="you@company.com" 
                          {...register("email")}
                          className={errors.email ? "border-red-500" : ""}
                        />
                         {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select 
                          onValueChange={(val) => setValue("category", val as Category)} 
                          defaultValue="Business"
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Business">Business</SelectItem>
                            <SelectItem value="Blog">Blog</SelectItem>
                            <SelectItem value="E-commerce">E-commerce</SelectItem>
                            <SelectItem value="Portfolio">Portfolio</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Min 20 chars)</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Tell us about your website..." 
                        className={cn("h-32", errors.description ? "border-red-500" : "")}
                        {...register("description")}
                      />
                       {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
                    </div>
                    
                    {/* HoneyPot (hidden) */}
                    <input type="text" name="website_hp" className="hidden" tabIndex={-1} autoComplete="off" />

                    <div className="flex justify-end pt-4">
                      <Button type="submit" size="lg" className="px-8">
                        Continue <ChevronRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </form>
                )}

                {/* STEP 2: PLANS */}
                {step === 2 && (
                  <div className="space-y-8">
                    <RadioGroup 
                      value={formData.plan} 
                      onValueChange={(val) => setFormData(prev => ({ ...prev, plan: val as Plan }))}
                      className="grid gap-6 md:grid-cols-3"
                    >
                      {plans.map((plan) => (
                        <div key={plan.id} className="relative">
                          <RadioGroupItem value={plan.id} id={plan.id} className="peer sr-only" />
                          <Label 
                            htmlFor={plan.id}
                            className={cn(
                              "flex flex-col h-full rounded-xl border-2 p-6 hover:bg-slate-50 cursor-pointer transition-all",
                              formData.plan === plan.id ? "border-primary bg-blue-50/30 ring-2 ring-primary ring-offset-2" : "border-slate-200"
                            )}
                          >
                            <div className="mb-4">
                              <h3 className="font-heading font-bold text-lg">{plan.name}</h3>
                              <div className="mt-2 flex items-baseline">
                                <span className="text-2xl font-bold">₹{plan.price}</span>
                                {plan.price > 0 && <span className="text-muted-foreground text-sm ml-1">/mo</span>}
                              </div>
                            </div>
                            
                            <ul className="space-y-2 mb-6 flex-1">
                              <li className="text-sm font-medium text-blue-600 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" /> {plan.visitors}
                              </li>
                              {plan.features.map((f, i) => (
                                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                  <CheckCircle2 className="w-3 h-3 mt-1 text-green-500 shrink-0" /> {f}
                                </li>
                              ))}
                            </ul>
                            
                            <div className={cn(
                              "w-full py-2 text-center rounded-lg text-sm font-semibold transition-colors",
                              formData.plan === plan.id ? "bg-primary text-white" : "bg-slate-100 text-slate-600"
                            )}>
                              {formData.plan === plan.id ? "Selected" : "Select"}
                            </div>
                          </Label>
                          {plan.id === "pro" && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-950 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                              Recommended
                            </div>
                          )}
                        </div>
                      ))}
                    </RadioGroup>

                    <div className="flex justify-between pt-4 border-t">
                      <Button variant="ghost" onClick={() => setStep(1)}>
                        <ChevronLeft className="mr-2 w-4 h-4" /> Back
                      </Button>
                      <Button onClick={() => setStep(3)} size="lg" className="px-8">
                        Continue <ChevronRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 3: REVIEW */}
                {step === 3 && (
                  <div className="space-y-8">
                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 space-y-4">
                      <h3 className="font-heading font-semibold text-lg border-b pb-2">Submission Summary</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Website</p>
                          <p className="font-medium truncate">{formData.websiteName}</p>
                          <p className="text-slate-500 truncate">{formData.websiteUrl}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Plan</p>
                          <p className="font-medium uppercase text-primary">{formData.plan}</p>
                          <p className="text-slate-500">₹{plans.find(p => p.id === formData.plan)?.price}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-muted-foreground">Email</p>
                          <p className="font-medium">{formData.email}</p>
                        </div>
                      </div>
                    </div>

                    {formData.plan !== 'free' && (
                      <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                        <h3 className="font-heading font-semibold text-lg text-blue-900 mb-4">Payment Required</h3>
                        <p className="text-sm text-blue-800 mb-4">
                          To activate your <strong>{formData.plan.toUpperCase()}</strong> plan, please send <strong>₹{plans.find(p => p.id === formData.plan)?.price}</strong> via PayPal.
                        </p>
                        <div className="bg-white p-4 rounded border border-blue-200 mb-4 font-mono text-sm">
                          kantacsc@gmail.com
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="txnId">PayPal Transaction ID</Label>
                          <Input id="txnId" placeholder="Enter Transaction ID for verification" />
                          <p className="text-xs text-muted-foreground">We verify payments instantly.</p>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between pt-4 border-t">
                      <Button variant="ghost" onClick={() => setStep(2)} disabled={isSubmitting}>
                        <ChevronLeft className="mr-2 w-4 h-4" /> Back
                      </Button>
                      <Button onClick={handleFinalSubmit} size="lg" className="px-8" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                          </>
                        ) : (
                          <>Submit Website</>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 4: SUCCESS */}
                {step === 4 && (
                  <div className="text-center py-12 space-y-6">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </div>
                    
                    <div className="space-y-2">
                      <h2 className="text-3xl font-bold text-slate-900">Submission Received!</h2>
                      <p className="text-slate-500 max-w-md mx-auto">
                        Your website has been successfully submitted. We've sent a confirmation email to <strong>{formData.email}</strong>.
                      </p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg inline-block text-left border mx-auto">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide font-bold mb-1">Submission ID</p>
                      <p className="font-mono text-xl font-bold text-primary">{submissionId}</p>
                    </div>

                    <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
                      <Link href="/status">
                        <Button variant="outline" className="w-full sm:w-auto">Check Status</Button>
                      </Link>
                      <Link href="/dashboard">
                        <Button className="w-full sm:w-auto">Go to Dashboard</Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
