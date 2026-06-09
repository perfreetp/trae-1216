import type { ScheduleItem, LeaveRecord, OvertimeBalance, AttendanceRecord } from '@/types'

const shiftMap = {
  morning: { name: '早班', start: '08:00', end: '16:00', location: '总部A栋' },
  afternoon: { name: '中班', start: '14:00', end: '22:00', location: '总部A栋' },
  night: { name: '晚班', start: '22:00', end: '06:00', location: '总部B栋' },
  rest: { name: '休息', start: undefined, end: undefined, location: undefined },
  normal: { name: '正常班', start: '09:00', end: '18:00', location: '总部A栋' }
}

function generateSchedule(): ScheduleItem[] {
  const schedule: ScheduleItem[] = []
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const dayOfWeek = new Date(year, month, d).getDay()
    let shift: ScheduleItem['shift']

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      shift = 'rest'
    } else if (d % 7 === 0) {
      shift = 'morning'
    } else if (d % 11 === 0) {
      shift = 'night'
    } else if (d % 5 === 0) {
      shift = 'afternoon'
    } else {
      shift = 'normal'
    }

    const shiftInfo = shiftMap[shift]
    schedule.push({
      date,
      shift,
      shiftName: shiftInfo.name,
      startTime: shiftInfo.start,
      endTime: shiftInfo.end,
      location: shiftInfo.location
    })
  }
  return schedule
}

export const mockSchedule: ScheduleItem[] = generateSchedule()

export const mockLeaveRecords: LeaveRecord[] = [
  { id: 'L001', type: 'annual', typeName: '年假', startDate: '2024-06-20', endDate: '2024-06-21', days: 2, reason: '个人事务处理', status: 'pending', applyDate: '2024-06-05', approver: '周敏（HR总监）' },
  { id: 'L002', type: 'sick', typeName: '病假', startDate: '2024-05-28', endDate: '2024-05-28', days: 1, reason: '感冒发热', status: 'approved', applyDate: '2024-05-28', approver: '周敏（HR总监）' },
  { id: 'L003', type: 'personal', typeName: '事假', startDate: '2024-04-15', endDate: '2024-04-15', days: 1, reason: '参加同学婚礼', status: 'approved', applyDate: '2024-04-10', approver: '周敏（HR总监）' },
  { id: 'L004', type: 'annual', typeName: '年假', startDate: '2024-02-05', endDate: '2024-02-16', days: 10, reason: '春节探亲', status: 'approved', applyDate: '2024-01-15', approver: '周敏（HR总监）' },
  { id: 'L005', type: 'sick', typeName: '病假', startDate: '2024-01-08', endDate: '2024-01-09', days: 2, reason: '急性肠胃炎', status: 'rejected', applyDate: '2024-01-08', approver: '周敏（HR总监）' }
]

export const mockOvertimeBalance: OvertimeBalance = {
  annualLeave: 8.5,
  compensatoryLeave: 2.5,
  sickLeave: 10,
  overtimeHours: 16
}

export const mockAttendanceRecords: AttendanceRecord[] = [
  { id: 'A001', date: '2024-06-07', type: 'checkin', time: '08:55', location: '总部A栋1楼门禁', status: 'normal' },
  { id: 'A002', date: '2024-06-07', type: 'checkout', time: '18:12', location: '总部A栋1楼门禁', status: 'normal' },
  { id: 'A003', date: '2024-06-06', type: 'checkin', time: '09:18', location: '总部A栋1楼门禁', status: 'late' },
  { id: 'A004', date: '2024-06-06', type: '外出', time: '14:30', location: '客户公司（浦东）', status: 'normal' },
  { id: 'A005', date: '2024-06-06', type: 'checkout', time: '19:45', location: '总部A栋1楼门禁', status: 'normal' },
  { id: 'A006', date: '2024-06-05', type: 'checkin', time: '08:48', location: '总部A栋1楼门禁', status: 'normal' },
  { id: 'A007', date: '2024-06-05', type: '加班', time: '21:00', location: '总部A栋1楼门禁', status: 'normal' },
  { id: 'A008', date: '2024-06-04', type: 'checkin', time: '09:02', location: '总部A栋1楼门禁', status: 'normal' },
  { id: 'A009', date: '2024-06-04', type: 'checkout', time: '17:48', location: '总部A栋1楼门禁', status: 'early' }
]
