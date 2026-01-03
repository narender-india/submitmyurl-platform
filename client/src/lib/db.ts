import { nanoid } from 'nanoid';

// Types
export type Plan = 'free' | 'basic' | 'pro' | 'business';
export type Status = 'pending' | 'approved' | 'rejected';
export type Category = 'Business' | 'Blog' | 'E-commerce' | 'Portfolio' | 'Other';

export interface User {
  id: string;
  email: string;
  credits: number;
  plan: Plan;
  referralCode: string;
  earnings: number;
  country: 'IN' | 'US' | 'Other';
  createdAt: string;
}

export interface Submission {
  id: string;
  userId: string;
  websiteUrl: string;
  websiteName: string;
  category: Category;
  description: string;
  plan: Plan;
  status: Status;
  submissionDate: string;
  visitors: number; // Simulated
  rejectionReason?: string;
}

// Initial Data
const INITIAL_USERS: User[] = [
  {
    id: 'user_demo',
    email: 'demo@submitmyurl.com',
    credits: 5,
    plan: 'pro',
    referralCode: 'DEMO123',
    earnings: 1500,
    country: 'IN',
    createdAt: new Date().toISOString(),
  }
];

const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'SMU-882192',
    userId: 'user_demo',
    websiteUrl: 'https://example.com',
    websiteName: 'Example Business',
    category: 'Business',
    description: 'A sample business website submission for demonstration purposes.',
    plan: 'pro',
    status: 'approved',
    submissionDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    visitors: 1240,
  },
  {
    id: 'SMU-129381',
    userId: 'user_demo',
    websiteUrl: 'https://myblog.com',
    websiteName: 'My Personal Blog',
    category: 'Blog',
    description: 'Just a personal blog about tech and life.',
    plan: 'free',
    status: 'pending',
    submissionDate: new Date().toISOString(),
    visitors: 0,
  }
];

// DB Implementation
class MockDB {
  private users: User[];
  private submissions: Submission[];

  constructor() {
    this.users = this.load('users', INITIAL_USERS);
    this.submissions = this.load('submissions', INITIAL_SUBMISSIONS);
  }

  private load<T>(key: string, initial: T): T {
    try {
      const item = localStorage.getItem(`smu_${key}`);
      return item ? JSON.parse(item) : initial;
    } catch {
      return initial;
    }
  }

  private save(key: string, data: any) {
    try {
      localStorage.setItem(`smu_${key}`, JSON.stringify(data));
    } catch (e) {
      console.error('LocalStorage error', e);
    }
  }

  // User Methods
  getUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email === email);
  }

  createUser(email: string): User {
    const existing = this.getUserByEmail(email);
    if (existing) return existing;

    const newUser: User = {
      id: `user_${nanoid(6)}`,
      email,
      credits: 5,
      plan: 'free',
      referralCode: `REF${nanoid(6).toUpperCase()}`,
      earnings: 0,
      country: 'IN', // Defaulting to IN for demo
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    this.save('users', this.users);
    return newUser;
  }

  // Submission Methods
  createSubmission(data: Omit<Submission, 'id' | 'status' | 'submissionDate' | 'visitors'>): Submission {
    const newSubmission: Submission = {
      ...data,
      id: `SMU-${nanoid(6).toUpperCase()}`,
      status: data.plan === 'free' ? 'pending' : 'approved', // Auto-approve paid for demo
      submissionDate: new Date().toISOString(),
      visitors: 0,
    };

    this.submissions.push(newSubmission);
    this.save('submissions', this.submissions);
    return newSubmission;
  }

  getSubmissions(userId?: string): Submission[] {
    if (userId) return this.submissions.filter(s => s.userId === userId);
    return this.submissions;
  }

  getSubmissionById(id: string): Submission | undefined {
    return this.submissions.find(s => s.id === id || s.id === id.toUpperCase()); // Case insensitive check
  }
  
  // Admin Methods
  getAllStats() {
    return {
      totalSubmissions: this.submissions.length,
      pending: this.submissions.filter(s => s.status === 'pending').length,
      approved: this.submissions.filter(s => s.status === 'approved').length,
      rejected: this.submissions.filter(s => s.status === 'rejected').length,
      revenue: this.submissions.filter(s => s.plan !== 'free').length * 199, // Simulated revenue
    };
  }

  updateSubmissionStatus(id: string, status: Status, reason?: string) {
    const sub = this.submissions.find(s => s.id === id);
    if (sub) {
      sub.status = status;
      if (reason) sub.rejectionReason = reason;
      this.save('submissions', this.submissions);
    }
  }

  deleteSubmission(id: string) {
    this.submissions = this.submissions.filter(s => s.id !== id);
    this.save('submissions', this.submissions);
  }
}

export const db = new MockDB();
