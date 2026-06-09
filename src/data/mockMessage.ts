import type { NoticeItem, TodoItem, FunctionItem } from '@/types'

export const mockTodoItems: TodoItem[] = [
  { id: 'TD001', title: '补填6月6日出勤说明', description: '6月6日存在迟到记录，请在3天内提交说明', type: 'leave', status: 'urgent', deadline: '2024-06-10', actionText: '立即处理' },
  { id: 'TD002', title: '完成2024年中绩效自评', description: '请在6月20日前完成绩效目标自评', type: 'performance', status: 'urgent', deadline: '2024-06-20', actionText: '去填写' },
  { id: 'TD003', title: '确认《信息安全管理规定》', description: '新制度已发布，请在6月30日前阅读确认', type: 'policy', status: 'pending', deadline: '2024-06-30', actionText: '去阅读' },
  { id: 'TD004', title: 'React技能认证考试', description: '请在6月20日前完成认证考试', type: 'training', status: 'pending', deadline: '2024-06-20', actionText: '开始考试' },
  { id: 'TD005', title: 'PMP证书即将到期', description: 'PMP项目管理证书将于6月20日到期', type: 'certificate', status: 'normal', deadline: '2024-06-20', actionText: '查看详情' }
]

export const mockNotices: NoticeItem[] = [
  { id: 'N001', title: '年假申请已通过', content: '您的2天年假申请（6月20日-6月21日）已获得周敏审批通过，请知悉。', type: 'approval', publishDate: '2024-06-07 14:30', isRead: false, relatedId: 'L001' },
  { id: 'N002', title: '5月工资条已发放', content: '2024年5月工资条已发放至您的账户，请登录查看详情。', type: 'system', publishDate: '2024-06-05 10:00', isRead: false },
  { id: 'N003', title: '系统维护通知', content: '系统将于6月8日22:00-24:00进行例行维护，期间服务可能中断，感谢您的理解。', type: 'announcement', publishDate: '2024-06-04 16:00', isRead: true },
  { id: 'N004', title: '端午节放假安排', content: '根据国家规定，6月10日端午节放假1天，与周末连休共3天。祝大家节日快乐！', type: 'announcement', publishDate: '2024-06-01 09:00', isRead: true },
  { id: 'N005', title: '培训课程报名提醒', content: '《微服务架构设计与实践》课程报名截止6月25日，请感兴趣的同事尽快报名。', type: 'reminder', publishDate: '2024-05-30 11:20', isRead: true },
  { id: 'N006', title: '病假申请已通过', content: '您的1天病假申请（5月28日）已获得审批通过。', type: 'approval', publishDate: '2024-05-28 09:15', isRead: true },
  { id: 'N007', title: '考核提醒', content: '2024年中绩效考核工作即将开始，请提前准备绩效进展材料。', type: 'reminder', publishDate: '2024-05-25 14:00', isRead: true }
]

export const mockFunctionItems: FunctionItem[] = [
  { id: 'F001', name: '提交请假', icon: '📝', color: '#165DFF', pagePath: '/pages/attendance/index' },
  { id: 'F002', name: '外出打卡', icon: '📍', color: '#FF7D00', pagePath: '/pages/attendance/index' },
  { id: 'F003', name: '查询排班', icon: '📅', color: '#00B42A', pagePath: '/pages/attendance/index' },
  { id: 'F004', name: '证明申请', icon: '📄', color: '#722ED1', pagePath: '/pages/certificate/index' },
  { id: 'F005', name: '工资条', icon: '💰', color: '#F53F3F', pagePath: '/pages/profile/index' },
  { id: 'F006', name: '绩效目标', icon: '🎯', color: '#14C9C9', pagePath: '/pages/performance/index' },
  { id: 'F007', name: '制度阅读', icon: '📖', color: '#EB2F96', pagePath: '/pages/training/index' },
  { id: 'F008', name: '培训报名', icon: '🎓', color: '#165DFF', pagePath: '/pages/training/index' },
  { id: 'F009', name: '在线考试', icon: '✍️', color: '#FF7D00', pagePath: '/pages/training/index' },
  { id: 'F010', name: '加班余额', icon: '⏰', color: '#00B42A', pagePath: '/pages/attendance/index' },
  { id: 'F011', name: '通讯录', icon: '📞', color: '#722ED1', pagePath: '/pages/contacts/index' },
  { id: 'F012', name: '问题反馈', icon: '💬', color: '#F53F3F', pagePath: '/pages/feedback/index' }
]

export const mockHomeStats = [
  { label: '本月出勤', value: '18', unit: '天', color: '#165DFF' },
  { label: '年假剩余', value: '8.5', unit: '天', color: '#00B42A' },
  { label: '加班时长', value: '16', unit: '小时', color: '#FF7D00' },
  { label: '待办事项', value: '5', unit: '件', color: '#F53F3F' }
]
