import { useState } from "react";
import { Navbar, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Globe, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { db, Submission } from "@/lib/db";
import { format } from "date-fns";

export default function Status() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Submission | null | "not_found">(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      // Search by ID or URL (Mock logic: search all submissions)
      // In a real app this would be an API call
      // Here we cheat and look through all submissions in our mock DB
      const allSubmissions = db.getSubmissions();
      const found = allSubmissions.find(s => 
        s.id.toLowerCase() === query.toLowerCase() || 
        s.websiteUrl.toLowerCase().includes(query.toLowerCase())
      );

      setResult(found || "not_found");
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />
      
      <main className="flex-1 container py-12 md:py-20">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-3xl font-heading font-bold mb-4">Check Submission Status</h1>
          <p className="text-muted-foreground">Enter your Submission ID or Website URL to track your approval status.</p>
        </div>

        <Card className="max-w-xl mx-auto shadow-lg mb-12">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input 
                placeholder="Ex: SMU-882192 or example.com" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-12 text-lg"
              />
              <Button type="submit" size="lg" className="h-12 px-6" disabled={loading}>
                {loading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <Search className="w-5 h-5" />}
              </Button>
            </form>
          </CardContent>
        </Card>

        {result === "not_found" && (
          <div className="max-w-xl mx-auto text-center p-8 bg-white rounded-lg border border-red-100">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-900 mb-2">Submission Not Found</h3>
            <p className="text-red-600 mb-6">We couldn't find any submission matching your query. Please check your details and try again.</p>
            <Button variant="outline" onClick={() => setQuery("")}>Try Again</Button>
          </div>
        )}

        {result && result !== "not_found" && (
          <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="overflow-hidden border-2 border-primary/10">
              <div className={`h-2 w-full ${
                result.status === 'approved' ? 'bg-green-500' : 
                result.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
              }`} />
              <CardHeader className="bg-slate-50/50 pb-8 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Submission ID</div>
                    <CardTitle className="font-mono text-2xl text-primary">{result.id}</CardTitle>
                  </div>
                  <Badge className={
                    result.status === 'approved' ? 'bg-green-500 hover:bg-green-600' :
                    result.status === 'rejected' ? 'bg-red-500 hover:bg-red-600' : 'bg-yellow-500 hover:bg-yellow-600'
                  }>
                    {result.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2"><Globe className="w-3 h-3" /> Website</div>
                    <div className="font-medium truncate">{result.websiteName}</div>
                    <div className="text-sm text-blue-500 truncate">{result.websiteUrl}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2"><Clock className="w-3 h-3" /> Submitted On</div>
                    <div className="font-medium">{format(new Date(result.submissionDate), 'MMM dd, yyyy')}</div>
                    <div className="text-sm text-muted-foreground">{format(new Date(result.submissionDate), 'h:mm a')}</div>
                  </div>
                </div>

                {result.status === 'pending' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                    <Clock className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-900 text-sm">Review in Progress</h4>
                      <p className="text-yellow-800 text-sm mt-1">
                        Your submission is currently being reviewed by our team. Estimated completion: <span className="font-bold">24-48 hours</span>.
                      </p>
                    </div>
                  </div>
                )}

                {result.status === 'approved' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-900 text-sm">Submission Live</h4>
                      <p className="text-green-800 text-sm mt-1">
                        Great news! Your website has been approved and is now listed in our directory network.
                      </p>
                    </div>
                  </div>
                )}

                {result.status === 'rejected' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-900 text-sm">Submission Rejected</h4>
                      <p className="text-red-800 text-sm mt-1">
                        Reason: {result.rejectionReason || "Violation of terms or quality standards."}
                      </p>
                      <Button variant="link" className="text-red-900 p-0 h-auto font-semibold mt-2 underline">
                        Edit & Resubmit
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
