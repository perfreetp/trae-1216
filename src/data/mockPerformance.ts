import type { PerformanceGoal, CertificateApplication, FeedbackRecord } from '@/types'

export const mockPerformanceGoals: PerformanceGoal[] = [
  { id: 'PG001', title: '完成年度核心项目前端开发', category: '业绩目标', weight: 40, target: '按计划完成ERP系统重构项目前端模块，按时交付率≥95%', progress: 75, actual: 'ERP重构项目已完成75%，按时交付率98%', selfScore: 85, status: 'reviewing', deadline: '2024-12-31' },
  { id: 'PG002', title: '前端架构优化与规范制定', category: '能力发展', weight: 20, target: '完成前端技术栈升级，制定团队代码规范，提升代码质量', progress: 60, actual: '技术栈已升级至React 18，代码规范初稿完成', selfScore: 80, status: 'reviewing', deadline: '2024-12-31' },
  { id: 'PG003', title: '团队知识分享与培养', category: '团队协作', weight: 15, target: '组织技术分享不少于6次，完成2名新人带教', progress: 80, actual: '已完成5次分享，新人带教进度符合预期', selfScore: 88, status: 'reviewing', deadline: '2024-12-31' },
  { id: 'PG004', title: 'Bug修复率与线上稳定性', category: '业绩目标', weight: 15, target: '线上P0/P1 Bug清零，P2 Bug修复率≥95%，页面可用性≥99.9%', progress: 90, actual: 'P0/P1 Bug清零，P2修复率97%，可用性99.95%', selfScore: 92, status: 'reviewing', deadline: '2024-12-31' },
  { id: 'PG005', title: '个人学习与认证', category: '能力发展', weight: 10, target: '完成至少3门专业课程培训，获得1项专业认证', progress: 70, actual: '完成4门培训，PMP认证续期处理中', selfScore: 78, status: 'reviewing', deadline: '2024-12-31' }
]

export const mockCertificateApplications: CertificateApplication[] = [
  { id: 'CA001', type: '在职证明', typeName: '在职证明', purpose: '银行贷款申请', applyDate: '2024-05-15', status: 'approved', approver: '吴艳（人事主管）', downloadUrl: '#' },
  { id: 'CA002', type: '收入证明', typeName: '收入证明', purpose: '子女留学签证', applyDate: '2024-06-01', status: 'pending', approver: '吴艳（人事主管）' },
  { id: 'CA003', type: '工作证明', typeName: '工作证明', purpose: '职称评定', applyDate: '2024-03-20', status: 'approved', approver: '吴艳（人事主管）', downloadUrl: '#' },
  { id: 'CA004', type: '在职证明', typeName: '在职证明', purpose: '办理护照', applyDate: '2024-01-10', status: 'approved', approver: '吴艳（人事主管）', downloadUrl: '#' }
]

export const mockFeedbackRecords: FeedbackRecord[] = [
  { id: 'FB001', category: '薪资福利', content: '建议增加弹性福利制度，让员工可以自主选择福利项目组合。', images: [], createDate: '2024-05-20 14:30', status: 'replied', reply: '感谢您的宝贵建议！我们正在评估弹性福利方案，预计Q3推出试点，敬请期待。' },
  { id: 'FB002', category: '系统问题', content: '考勤打卡功能在iPhone 15 Pro上偶尔会定位失败，需要多次尝试才能成功。', images: [], createDate: '2024-06-02 10:15', status: 'processing' },
  { id: 'FB003', category: '培训发展', content: '希望能增加更多管理类和软技能培训课程，技术类课程已经很丰富了。', images: [], createDate: '2024-04-15 16:45', status: 'closed', reply: '已采纳！我们已在Q2培训计划中新增了5门管理类课程，欢迎报名参加。' }
]
