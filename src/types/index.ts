export interface UserInfo {
  id: string
  name: string
  avatar: string
  employeeNo: string
  department: string
  position: string
  phone: string
  email: string
  entryDate: string
  idCard: string
  address: string
  emergencyContact: EmergencyContact
  certificates: Certificate[]
}

export interface EmergencyContact {
  name: string
  relation: string
  phone: string
}

export interface Certificate {
  id: string
  type: string
  name: string
  uploadDate: string
  expireDate: string
  status: 'valid' | 'expiring' | 'expired'
}

export interface ScheduleItem {
  date: string
  shift: 'morning' | 'afternoon' | 'night' | 'rest' | 'normal'
  shiftName: string
  startTime?: string
  endTime?: string
  location?: string
}

export interface LeaveRecord {
  id: string
  type: 'annual' | 'sick' | 'personal' | 'marriage' | 'maternity' | 'bereavement'
  typeName: string
  startDate: string
  endDate: string
  days: number
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  applyDate: string
  approver: string
}

export interface OvertimeBalance {
  annualLeave: number
  compensatoryLeave: number
  sickLeave: number
  overtimeHours: number
}

export interface AttendanceRecord {
  id: string
  date: string
  type: 'checkin' | 'checkout' | '外出' | '加班'
  time: string
  location: string
  status: 'normal' | 'late' | 'early' | 'absent'
}

export interface NoticeItem {
  id: string
  title: string
  content: string
  type: 'approval' | 'system' | 'announcement' | 'reminder'
  publishDate: string
  isRead: boolean
  relatedId?: string
}

export interface TodoItem {
  id: string
  title: string
  description: string
  type: 'leave' | 'certificate' | 'training' | 'performance' | 'policy'
  status: 'urgent' | 'pending' | 'normal'
  deadline: string
  actionText: string
}

export interface FunctionItem {
  id: string
  name: string
  icon: string
  color: string
  pagePath?: string
  action?: string
}

export interface TrainingCourse {
  id: string
  title: string
  cover: string
  category: string
  duration: number
  progress: number
  status: 'not_started' | 'in_progress' | 'completed'
  enrollDeadline?: string
  enrollStatus?: 'not_enrolled' | 'enrolled' | 'approved'
  instructor?: string
}

export interface ExamItem {
  id: string
  title: string
  courseTitle: string
  duration: number
  totalScore: number
  passScore: number
  deadline: string
  status: 'not_taken' | 'in_progress' | 'passed' | 'failed'
  attemptCount: number
  maxAttempts: number
}

export interface PolicyDoc {
  id: string
  title: string
  category: string
  version: string
  publishDate: string
  isConfirmed: boolean
  confirmDeadline: string
}

export interface PerformanceGoal {
  id: string
  title: string
  category: string
  weight: number
  target: string
  progress: number
  actual?: string
  selfScore?: number
  leaderScore?: number
  status: 'draft' | 'in_progress' | 'reviewing' | 'completed'
  deadline: string
}

export interface CertificateApplication {
  id: string
  type: '在职证明' | '收入证明' | '离职证明' | '工作证明'
  typeName: string
  purpose: string
  applyDate: string
  status: 'pending' | 'approved' | 'rejected'
  approver: string
  downloadUrl?: string
}

export interface PayrollRecord {
  id: string
  month: string
  basicSalary: number
  performanceBonus: number
  overtimePay: number
  allowance: number
  deduction: number
  tax: number
  socialInsurance: number
  netSalary: number
  isDownloaded: boolean
}

export interface ContactPerson {
  id: string
  name: string
  avatar: string
  position: string
  department: string
  phone: string
  email: string
}

export interface Department {
  id: string
  name: string
  memberCount: number
  members: ContactPerson[]
  children?: Department[]
}

export interface FeedbackRecord {
  id: string
  category: string
  content: string
  images: string[]
  createDate: string
  status: 'submitted' | 'processing' | 'replied' | 'closed'
  reply?: string
}
