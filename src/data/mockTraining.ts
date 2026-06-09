import type { TrainingCourse, ExamItem, PolicyDoc } from '@/types'

export const mockTrainingCourses: TrainingCourse[] = [
  { id: 'T001', title: 'React 18 新特性深度解析', cover: 'https://picsum.photos/id/1/750/500', category: '技术技能', duration: 360, progress: 85, status: 'in_progress', instructor: '陈强（技术总监）' },
  { id: 'T002', title: '高效团队协作与沟通技巧', cover: 'https://picsum.photos/id/3/750/500', category: '职业素养', duration: 180, progress: 100, status: 'completed', instructor: '周敏（HR总监）' },
  { id: 'T003', title: '信息安全与数据保护培训', cover: 'https://picsum.photos/id/2/750/500', category: '合规培训', duration: 120, progress: 0, status: 'not_started', enrollDeadline: '2024-06-30', enrollStatus: 'approved', instructor: '外部讲师' },
  { id: 'T004', title: '项目管理实战（PMP方法论）', cover: 'https://picsum.photos/id/119/750/500', category: '管理技能', duration: 480, progress: 30, status: 'in_progress', instructor: '外部讲师' },
  { id: 'T005', title: '微服务架构设计与实践', cover: 'https://picsum.photos/id/160/750/500', category: '技术技能', duration: 540, progress: 0, status: 'not_started', enrollDeadline: '2024-06-25', enrollStatus: 'not_enrolled' },
  { id: 'T006', title: '职场心理健康与压力管理', cover: 'https://picsum.photos/id/201/750/500', category: '职业素养', duration: 90, progress: 100, status: 'completed', instructor: '周敏（HR总监）' }
]

export const mockExamItems: ExamItem[] = [
  { id: 'E001', title: '公司规章制度考试（2024版）', courseTitle: '新员工入职培训', duration: 60, totalScore: 100, passScore: 80, deadline: '2024-06-30', status: 'not_taken', attemptCount: 0, maxAttempts: 3 },
  { id: 'E002', title: '信息安全知识考核', courseTitle: '信息安全与数据保护培训', duration: 45, totalScore: 100, passScore: 90, deadline: '2024-07-15', status: 'not_taken', attemptCount: 0, maxAttempts: 2 },
  { id: 'E003', title: 'React 技能认证', courseTitle: 'React 18 新特性深度解析', duration: 90, totalScore: 100, passScore: 70, deadline: '2024-06-20', status: 'in_progress', attemptCount: 1, maxAttempts: 3 },
  { id: 'E004', title: '职场沟通能力评估', courseTitle: '高效团队协作与沟通技巧', duration: 30, totalScore: 100, passScore: 75, deadline: '2024-05-31', status: 'passed', attemptCount: 1, maxAttempts: 2 },
  { id: 'E005', title: '心理健康知识测验', courseTitle: '职场心理健康与压力管理', duration: 20, totalScore: 100, passScore: 60, deadline: '2024-05-10', status: 'passed', attemptCount: 1, maxAttempts: 2 }
]

export const mockPolicyDocs: PolicyDoc[] = [
  { id: 'POL001', title: '员工考勤管理制度（2024修订版）', category: '人事制度', version: 'V3.2', publishDate: '2024-05-20', isConfirmed: true, confirmDeadline: '2024-06-10' },
  { id: 'POL002', title: '信息安全管理规定', category: '合规制度', version: 'V2.1', publishDate: '2024-05-15', isConfirmed: false, confirmDeadline: '2024-06-30' },
  { id: 'POL003', title: '差旅与报销管理办法', category: '财务制度', version: 'V4.0', publishDate: '2024-04-10', isConfirmed: true, confirmDeadline: '2024-05-10' },
  { id: 'POL004', title: '知识产权保密协议', category: '合规制度', version: 'V1.5', publishDate: '2024-03-01', isConfirmed: false, confirmDeadline: '2024-06-20' },
  { id: 'POL005', title: '员工福利管理手册', category: '人事制度', version: 'V2.0', publishDate: '2024-01-15', isConfirmed: true, confirmDeadline: '2024-02-15' },
  { id: 'POL006', title: '绩效管理办法', category: '人事制度', version: 'V3.0', publishDate: '2023-12-01', isConfirmed: true, confirmDeadline: '2024-01-15' }
]
