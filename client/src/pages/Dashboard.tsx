import { useState, useEffect } from "react";
import { Navbar, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutDashboard, 
  BarChart3, 
  Users, 
  Globe, 
  Settings, 
  LogOut, 
  CreditCard,
  Plus,
  ArrowUpRight,
  TrendingUp,
  MapPin
} from "lucide-react";
import { db, User, Submission } from "@/lib/db";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from "@/lib/utils";

// Mock Login Component
function LoginScreen({ onLogin }: { onLogin: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">Enter your email to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Send Magic Link</Button>
                <div className="text-center text-xs text-muted-foreground mt-4">
                  Or try <button type="button" onClick={() => setEmail("demo@submitmyurl.com")} className="text-primary hover:underline">demo account</button>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Check your email</h3>
                  <p className="text-muted-foreground text-sm">We sent a magic link to {email}</p>
                </div>
                <Button 
                  className="w-full" 
                  variant="secondary"
                  onClick={() => onLogin(email)} // Simulating clicking the email link
                >
                  (Simulate) Click Magic Link
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Chart Data
const trafficData = [
  { name: 'Mon', visitors: 400 },
  { name: 'Tue', visitors: 300 },
  { name: 'Wed', visitors: 600 },
  { name: 'Thu', visitors: 800 },
  { name: 'Fri', visitors: 500 },
  { name: 'Sat', visitors: 900 },
  { name: 'Sun', visitors: 1100 },
];

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    // Check if user session exists (mock)
    const savedEmail = sessionStorage.getItem('smu_user_email');
    if (savedEmail) {
      handleLogin(savedEmail);
    }
  }, []);

  const handleLogin = (email: string) => {
    let u = db.getUserByEmail(email);
    if (!u) {
      // Auto register for demo if not found
      u = db.createUser(email);
    }
    setUser(u);
    setSubmissions(db.getSubmissions(u.id));
    sessionStorage.setItem('smu_user_email', email);
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('smu_user_email');
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden w-64 flex-col border-r bg-white md:flex">
          <div className="p-6">
            <div className="flex items-center gap-2 font-heading font-bold text-xl text-primary">
              <BarChart3 className="h-6 w-6" />
              <span>SubmitMyURL</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-4">
              <Button variant="secondary" className="w-full justify-start font-medium">
                <LayoutDashboard className="mr-3 h-5 w-5" />
                Dashboard
              </Button>
              <Button variant="ghost" className="w-full justify-start font-medium text-slate-500">
                <Globe className="mr-3 h-5 w-5" />
                My Websites
              </Button>
              <Button variant="ghost" className="w-full justify-start font-medium text-slate-500">
                <Users className="mr-3 h-5 w-5" />
                Referrals
              </Button>
              <Button variant="ghost" className="w-full justify-start font-medium text-slate-500">
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </Button>
            </nav>
          </div>
          <div className="p-4 border-t">
            <div className="bg-slate-100 rounded-lg p-4 mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase">Current Plan</p>
              <div className="flex justify-between items-center mt-1">
                <span className="font-bold text-slate-900 capitalize">{user.plan}</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Active</span>
              </div>
              <Button size="sm" className="w-full mt-3 h-8 text-xs" variant="outline">Upgrade</Button>
            </div>
            <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <header className="flex h-16 items-center justify-between border-b bg-white px-6">
            <h1 className="text-lg font-semibold md:hidden">SubmitMyURL</h1>
            <div className="flex items-center gap-4 ml-auto">
              <div className="hidden md:block text-sm text-right">
                <p className="font-medium">{user.email}</p>
                <p className="text-xs text-muted-foreground">ID: {user.id}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {user.email[0].toUpperCase()}
              </div>
            </div>
          </header>

          <div className="p-6 md:p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-heading font-bold text-slate-900">Dashboard</h2>
                <p className="text-muted-foreground">Overview of your website traffic and submissions.</p>
              </div>
              <Button className="shrink-0">
                <Plus className="mr-2 h-4 w-4" /> New Submission
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Visitors</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12,345</div>
                  <p className="text-xs text-muted-foreground flex items-center mt-1 text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" /> +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Submissions</CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{submissions.filter(s => s.status === 'approved').length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {submissions.filter(s => s.status === 'pending').length} pending approval
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Credits Remaining</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.credits}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Free submissions available
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Traffic Chart */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Traffic Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trafficData}>
                      <defs>
                        <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Area type="monotone" dataKey="visitors" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorVis)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Submissions List */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submissions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No websites submitted yet.
                    </div>
                  ) : (
                    submissions.map((sub) => (
                      <div key={sub.id} className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                            <Globe className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{sub.websiteName}</h4>
                            <p className="text-sm text-slate-500">{sub.websiteUrl}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
                            sub.status === 'approved' ? 'bg-green-100 text-green-800' :
                            sub.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          )}>
                            {sub.status}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">{sub.plan} Plan</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Ad Space (For Free Users) */}
            {user.plan === 'free' && (
              <div className="h-24 bg-slate-200 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                <span className="font-semibold">Ad Space (Upgrade to Pro to remove)</span>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
