import type { UserInfo, EmergencyContact, Certificate, PayrollRecord, ContactPerson, Department } from '@/types'

export const mockUserInfo: UserInfo = {
  id: 'U20240001',
  name: '张伟',
  avatar: 'https://picsum.photos/id/64/200/200',
  employeeNo: 'EMP20240001',
  department: '技术研发部 / 前端开发组',
  position: '高级前端工程师',
  phone: '138****8888',
  email: 'zhangwei@company.com',
  entryDate: '2020-03-15',
  idCard: '310***********1234',
  address: '上海市浦东新区张江高科技园区',
  emergencyContact: {
    name: '李娜',
    relation: '配偶',
    phone: '139****6666'
  },
  certificates: [
    { id: 'C001', type: '学历证书', name: '本科毕业证书', uploadDate: '2020-03-15', expireDate: '-', status: 'valid' },
    { id: 'C002', type: '学历证书', name: '学士学位证书', uploadDate: '2020-03-15', expireDate: '-', status: 'valid' },
    { id: 'C003', type: '职业资格', name: 'PMP项目管理证书', uploadDate: '2022-06-20', expireDate: '2025-06-20', status: 'expiring' },
    { id: 'C004', type: '培训证书', name: '敏捷开发认证', uploadDate: '2023-09-10', expireDate: '-', status: 'valid' }
  ]
}

export const mockEmergencyContact: EmergencyContact = {
  name: '李娜',
  relation: '配偶',
  phone: '139****6666'
}

export const mockCertificates: Certificate[] = mockUserInfo.certificates

export const mockPayrollRecords: PayrollRecord[] = [
  { id: 'P202405', month: '2024年5月', basicSalary: 18000, performanceBonus: 4500, overtimePay: 1200, allowance: 800, deduction: 200, tax: 2100, socialInsurance: 1890, netSalary: 20310, isDownloaded: true },
  { id: 'P202404', month: '2024年4月', basicSalary: 18000, performanceBonus: 4000, overtimePay: 800, allowance: 800, deduction: 150, tax: 2050, socialInsurance: 1890, netSalary: 19510, isDownloaded: true },
  { id: 'P202403', month: '2024年3月', basicSalary: 18000, performanceBonus: 3800, overtimePay: 0, allowance: 800, deduction: 100, tax: 1980, socialInsurance: 1890, netSalary: 18630, isDownloaded: true },
  { id: 'P202402', month: '2024年2月', basicSalary: 18000, performanceBonus: 5000, overtimePay: 300, allowance: 800, deduction: 0, tax: 2200, socialInsurance: 1890, netSalary: 20010, isDownloaded: false },
  { id: 'P202401', month: '2024年1月', basicSalary: 18000, performanceBonus: 6000, overtimePay: 500, allowance: 800, deduction: 250, tax: 2400, socialInsurance: 1890, netSalary: 20760, isDownloaded: false }
]

const devMembers: ContactPerson[] = [
  { id: 'U001', name: '张伟', avatar: 'https://picsum.photos/id/64/200/200', position: '高级前端工程师', department: '前端开发组', phone: '138****8888', email: 'zhangwei@company.com' },
  { id: 'U002', name: '王芳', avatar: 'https://picsum.photos/id/91/200/200', position: '前端工程师', department: '前端开发组', phone: '137****7777', email: 'wangfang@company.com' },
  { id: 'U003', name: '李明', avatar: 'https://picsum.photos/id/177/200/200', position: '前端工程师', department: '前端开发组', phone: '136****6666', email: 'liming@company.com' },
  { id: 'U004', name: '刘洋', avatar: 'https://picsum.photos/id/338/200/200', position: '前端实习生', department: '前端开发组', phone: '135****5555', email: 'liuyang@company.com' }
]

const backendMembers: ContactPerson[] = [
  { id: 'U005', name: '陈强', avatar: 'https://picsum.photos/id/1027/200/200', position: '技术总监', department: '后端开发组', phone: '139****9999', email: 'chenqiang@company.com' },
  { id: 'U006', name: '赵磊', avatar: 'https://picsum.photos/id/1/200/200', position: '高级后端工程师', department: '后端开发组', phone: '138****8880', email: 'zhaolei@company.com' },
  { id: 'U007', name: '孙丽', avatar: 'https://picsum.photos/id/237/200/200', position: '后端工程师', department: '后端开发组', phone: '137****7770', email: 'sunli@company.com' }
]

const hrMembers: ContactPerson[] = [
  { id: 'U008', name: '周敏', avatar: 'https://picsum.photos/id/659/200/200', position: 'HR总监', department: '人力资源部', phone: '136****6660', email: 'zhoumin@company.com' },
  { id: 'U009', name: '吴艳', avatar: 'https://picsum.photos/id/718/200/200', position: '人事主管', department: '人力资源部', phone: '135****5550', email: 'wuyan@company.com' },
  { id: 'U010', name: '郑华', avatar: 'https://picsum.photos/id/783/200/200', position: '招聘专员', department: '人力资源部', phone: '134****4440', email: 'zhenghua@company.com' }
]

const finMembers: ContactPerson[] = [
  { id: 'U011', name: '钱进', avatar: 'https://picsum.photos/id/1025/200/200', position: '财务总监', department: '财务部', phone: '133****3330', email: 'qianjin@company.com' },
  { id: 'U012', name: '冯静', avatar: 'https://picsum.photos/id/103/200/200', position: '会计', department: '财务部', phone: '132****2220', email: 'fengjing@company.com' }
]

export const mockDepartments: Department[] = [
  {
    id: 'D001',
    name: '技术研发部',
    memberCount: 7,
    members: [],
    children: [
      { id: 'D001-1', name: '前端开发组', memberCount: 4, members: devMembers },
      { id: 'D001-2', name: '后端开发组', memberCount: 3, members: backendMembers }
    ]
  },
  { id: 'D002', name: '人力资源部', memberCount: 3, members: hrMembers },
  { id: 'D003', name: '财务部', memberCount: 2, members: finMembers }
]
