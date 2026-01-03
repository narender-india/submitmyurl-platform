import { useState, useEffect } from "react";
import { Navbar, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  LayoutDashboard, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Search,
  Lock,
  MoreHorizontal,
  DollarSign,
  AlertCircle
} from "lucide-react";
import { db, Submission } from "@/lib/db";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState({ totalSubmissions: 0, pending: 0, approved: 0, rejected: 0, revenue: 0 });
  const [rejectReason, setRejectReason] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check session
    if (sessionStorage.getItem("smu_admin_auth") === "true") {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const loadData = () => {
    setSubmissions(db.getSubmissions().sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()));
    setStats(db.getAllStats());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsAuthenticated(true);
      sessionStorage.setItem("smu_admin_auth", "true");
      loadData();
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect password",
        variant: "destructive"
      });
    }
  };

  const handleAction = (id: string, action: 'approve' | 'reject' | 'delete', reason?: string) => {
    if (action === 'delete') {
      db.deleteSubmission(id);
      toast({ title: "Deleted", description: "Submission deleted permanently." });
    } else if (action === 'approve') {
      db.updateSubmissionStatus(id, 'approved');
      toast({ title: "Approved", description: "Submission has been approved." });
    } else if (action === 'reject') {
      db.updateSubmissionStatus(id, 'rejected', reason);
      toast({ title: "Rejected", description: "Submission has been rejected." });
    }
    loadData();
    setSelectedId(null);
    setRejectReason("");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-900 font-sans items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800 border-slate-700 text-white">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-slate-400" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
            <CardDescription className="text-slate-400">Restricted Access Area</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input 
                type="password" 
                placeholder="Enter password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Access Dashboard</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <header className="bg-slate-900 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="font-heading font-bold text-xl flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-blue-400" />
            Admin Panel
          </div>
          <Button 
            variant="ghost" 
            className="text-slate-300 hover:text-white hover:bg-slate-800"
            onClick={() => {
              setIsAuthenticated(false);
              sessionStorage.removeItem("smu_admin_auth");
            }}
          >
            Logout
          </Button>
        </div>
      </header>

      <main className="flex-1 container py-8">
        
        {/* Stats Row */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.revenue}</div>
              <p className="text-xs text-muted-foreground">Estimated earnings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Needs attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approved}</div>
              <p className="text-xs text-muted-foreground">Active listings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <LayoutDashboard className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Submissions Table */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
            <CardDescription>Manage incoming website submissions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.length === 0 ? (
                   <TableRow>
                     <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                       No submissions found.
                     </TableCell>
                   </TableRow>
                ) : (
                  submissions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-mono text-xs">{sub.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{sub.websiteName}</div>
                        <div className="text-xs text-muted-foreground">{sub.websiteUrl}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {sub.plan}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {format(new Date(sub.submissionDate), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(
                          sub.status === 'approved' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                          sub.status === 'rejected' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
                          'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        )}>
                          {sub.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleAction(sub.id, 'approve')}
                            title="Approve"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => setSelectedId(sub.id)}
                                title="Reject"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reject Submission</DialogTitle>
                                <DialogDescription>
                                  Please provide a reason for rejecting this submission.
                                </DialogDescription>
                              </DialogHeader>
                              <Textarea 
                                placeholder="Reason for rejection (e.g. Broken link, Inappropriate content)" 
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                              />
                              <DialogFooter>
                                <Button variant="destructive" onClick={() => selectedId && handleAction(selectedId, 'reject', rejectReason)}>
                                  Reject Submission
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleAction(sub.id, 'delete')}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
