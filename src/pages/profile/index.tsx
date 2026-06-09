import React, { useState } from 'react'
import { View, Text, Image, ScrollView, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import SectionHeader from '@/components/SectionHeader'
import classnames from 'classnames'
import { mockUserInfo, mockCertificates, mockPayrollRecords } from '@/data/mockUser'

type SectionType = 'basic' | 'payroll' | 'cert'

const ProfilePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionType>('basic')
  const [emergencyContact, setEmergencyContact] = useState(mockUserInfo.emergencyContact)
  const [certificates, setCertificates] = useState(mockCertificates)
  const [payrollRecords, setPayrollRecords] = useState(mockPayrollRecords)
  const [editEmergencyVisible, setEditEmergencyVisible] = useState(false)
  const [editForm, setEditForm] = useState({ name: emergencyContact.name, relation: emergencyContact.relation, phone: emergencyContact.phone })

  const calcTenure = (entryDate: string) => {
    const start = new Date(entryDate)
    const now = new Date()
    const years = now.getFullYear() - start.getFullYear()
    const months = now.getMonth() - start.getMonth()
    return `${years}年${months >= 0 ? months : 12 + months}个月`
  }

  const openEditEmergency = () => {
    setEditForm({ name: emergencyContact.name, relation: emergencyContact.relation, phone: emergencyContact.phone })
    setEditEmergencyVisible(true)
  }

  const handleSaveEmergency = () => {
    if (!editForm.name.trim()) { Taro.showToast({ title: '请输入姓名', icon: 'none' }); return }
    if (!editForm.relation.trim()) { Taro.showToast({ title: '请输入关系', icon: 'none' }); return }
    if (!editForm.phone.trim()) { Taro.showToast({ title: '请输入电话', icon: 'none' }); return }
    setEmergencyContact({ ...editForm })
    setEditEmergencyVisible(false)
    Taro.showToast({ title: '保存成功', icon: 'success' })
  }

  const handleUploadCert = () => {
    Taro.chooseImage({
      count: 1,
      success: (res) => {
        const tempPath = res.tempFilePaths[0]
        const certTypes = ['学历证书', '职业资格', '培训证书', '身份证明', '其他证件']
        const today = new Date().toISOString().slice(0, 10)
        const newCert = {
          id: `C${Date.now()}`,
          type: certTypes[Math.floor(Math.random() * certTypes.length)],
          name: `上传证件_${today}`,
          uploadDate: today,
          expireDate: '-',
          status: 'valid' as const,
          thumbnail: tempPath
        }
        setCertificates([newCert, ...certificates])
        Taro.showToast({ title: '上传成功', icon: 'success' })
      },
      fail: (err) => {
        console.error('[Profile] chooseImage error:', err)
      }
    })
  }

  const handleDownloadPayroll = (record: typeof mockPayrollRecords[0]) => {
    Taro.showModal({
      title: record.month + ' 工资条',
      content: `基本工资：¥${record.basicSalary}\n绩效奖金：¥${record.performanceBonus}\n加班费：¥${record.overtimePay}\n津贴：¥${record.allowance}\n扣款：¥${record.deduction}\n个税：¥${record.tax}\n社保：¥${record.socialInsurance}\n\n实发工资：¥${record.netSalary.toLocaleString()}`,
      confirmText: record.isDownloaded ? '关闭' : '下载并查看',
      success: (res) => {
        if (res.confirm && !record.isDownloaded) {
          setPayrollRecords(payrollRecords.map(r => r.id === record.id ? { ...r, isDownloaded: true } : r))
          Taro.showToast({ title: '已下载到本地', icon: 'success' })
        }
      }
    })
  }

  const handleNavigate = (path: string) => {
    console.log('[Profile] navigate to:', path)
    if (path.includes('tabBar') || path === '/pages/contacts/index') {
      Taro.navigateTo({ url: path })
    } else {
      Taro.navigateTo({ url: path })
    }
  }

  const getStatusInfo = (s: string) => ({
    valid: { text: '有效', cls: styles.statusValid },
    expiring: { text: '即将到期', cls: styles.statusExpiring },
    expired: { text: '已过期', cls: styles.statusExpired }
  }[s] || { text: s, cls: styles.statusValid })

  return (
    <ScrollView scrollY style={{ height: '100vh' }}>
      <View className={styles.container}>
        <View className={styles.heroSection}>
          <View className={styles.heroTop}>
            <Image className={styles.avatar} src={mockUserInfo.avatar} mode='aspectFill' />
            <View className={styles.userInfo}>
              <Text className={styles.userName}>
                {mockUserInfo.name}
                <View className={styles.tagVerified}>✓ 已实名认证</View>
              </Text>
              <Text className={styles.userDept}>{mockUserInfo.department}</Text>
              <Text className={styles.userPosition}>{mockUserInfo.position}</Text>
            </View>
          </View>
          <View className={styles.heroInfoGrid}>
            <View className={styles.infoItem}>
              <Text className={styles.infoNum}>{calcTenure(mockUserInfo.entryDate)}</Text>
              <Text className={styles.infoLabel}>司龄</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoNum}>{mockUserInfo.employeeNo}</Text>
              <Text className={styles.infoLabel}>工号</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoNum}>{mockCertificates.length}</Text>
              <Text className={styles.infoLabel}>证件</Text>
            </View>
          </View>
        </View>

        <View className={styles.cardSection}>
          <View className={styles.menuList} style={{ marginBottom: '24rpx' }}>
            {[
              { icon: '🏆', title: '绩效目标', desc: '填写进度、查看考核结果', path: '/pages/performance/index' },
              { icon: '📄', title: '证明申请', desc: '在职证明、收入证明等', path: '/pages/certificate/index' },
              { icon: '📞', title: '组织通讯录', desc: '公司联系人信息', path: '/pages/contacts/index' },
              { icon: '💬', title: '问题反馈', desc: '人事问题建议提交', path: '/pages/feedback/index' }
            ].map(item => (
              <View className={styles.menuItem} key={item.title} onClick={() => handleNavigate(item.path)}>
                <View className={styles.menuIcon}>{item.icon}</View>
                <View className={styles.menuContent}>
                  <Text className={styles.menuTitle}>{item.title}</Text>
                  <Text className={styles.menuDesc}>{item.desc}</Text>
                </View>
                <Text className={styles.menuArrow}>›</Text>
              </View>
            ))}
          </View>

          <View style={{ display: 'flex', gap: '16rpx', marginBottom: '24rpx' }}>
            {[
              { key: 'basic' as SectionType, label: '个人档案' },
              { key: 'payroll' as SectionType, label: '工资条' },
              { key: 'cert' as SectionType, label: '证件管理' }
            ].map(tab => (
              <View
                key={tab.key}
                onClick={() => setActiveSection(tab.key)}
                style={{
                  flex: 1,
                  height: '64rpx',
                  borderRadius: '32rpx',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '26rpx',
                  fontWeight: activeSection === tab.key ? 600 : 400,
                  background: activeSection === tab.key ? 'linear-gradient(135deg,#165DFF 0%,#4080FF 100%)' : '#fff',
                  color: activeSection === tab.key ? '#fff' : '#4E5969',
                  boxShadow: '0 2rpx 12rpx rgba(0,0,0,0.08)',
                  transition: 'all 0.25s ease'
                }}
              >
                {tab.label}
              </View>
            ))}
          </View>

          {activeSection === 'basic' && (
            <>
              <View className={styles.infoCard}>
                <View className={styles.cardHeader}>
                  <Text className={styles.cardTitle}>📋 基本信息</Text>
                </View>
                <View className={styles.infoList}>
                  {[
                    { label: '姓名', value: mockUserInfo.name },
                    { label: '性别', value: '男' },
                    { label: '身份证号', value: mockUserInfo.idCard, lock: true },
                    { label: '联系电话', value: mockUserInfo.phone },
                    { label: '电子邮箱', value: mockUserInfo.email },
                    { label: '入职日期', value: mockUserInfo.entryDate },
                    { label: '户籍地址', value: mockUserInfo.address }
                  ].map(item => (
                    <View className={styles.infoRow} key={item.label}>
                      <Text className={styles.rowLabel}>{item.label}</Text>
                      <View className={styles.rowValue}>
                        {item.lock
                          ? <View className={styles.rowValueLock}>{item.value} 🔒</View>
                          : item.value}
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              <View className={styles.infoCard}>
                <View className={styles.cardHeader}>
                  <Text className={styles.cardTitle}>👨‍👩‍👧 紧急联系人</Text>
                  <View className={styles.editBtn} onClick={openEditEmergency}>✏️ 编辑</View>
                </View>
                <View className={styles.emergencyWrap}>
                  <View className={styles.emergencyRow}>
                    <Text className={styles.emergencyLabel}>👤 姓名</Text>
                    <Text className={styles.emergencyValue}>{emergencyContact.name}</Text>
                  </View>
                  <View className={styles.emergencyRow}>
                    <Text className={styles.emergencyLabel}>👥 关系</Text>
                    <Text className={styles.emergencyValue}>{emergencyContact.relation}</Text>
                  </View>
                  <View className={styles.emergencyRow}>
                    <Text className={styles.emergencyLabel}>📱 联系电话</Text>
                    <Text className={styles.emergencyValue}>{emergencyContact.phone}</Text>
                  </View>
                </View>
              </View>
            </>
          )}

          {activeSection === 'payroll' && (
            <>
              <SectionHeader title='最近工资条' subtitle='可查看详情并下载' />
              {payrollRecords.map(record => (
                <View className={styles.payrollItem} key={record.id} onClick={() => handleDownloadPayroll(record)}>
                  <View className={styles.payrollInfo}>
                    <Text className={styles.payrollMonth}>💰 {record.month}</Text>
                    <Text className={styles.payrollMeta}>
                      发放日：{record.month.replace('年', '-').replace('月', '')}-15
                    </Text>
                  </View>
                  <View className={styles.payrollAmount}>
                    <Text className={styles.amountLabel}>实发工资</Text>
                    <Text className={styles.amountValue}>¥{record.netSalary.toLocaleString()}</Text>
                  </View>
                  <View
                    className={classnames(styles.downloadBtn, record.isDownloaded && styles.downloadedBtn)}
                    onClick={(e) => { e.stopPropagation(); handleDownloadPayroll(record) }}
                  >
                    {record.isDownloaded ? '✓ 已下载' : '⬇ 下载'}
                  </View>
                </View>
              ))}
            </>
          )}

          {activeSection === 'cert' && (
            <>
              <SectionHeader title='证件管理' subtitle={`共 ${certificates.length} 份证件`} />
              <View className={styles.certList}>
                {certificates.map(cert => {
                  const statusInfo = getStatusInfo(cert.status)
                  return (
                    <View className={styles.certItem} key={cert.id}>
                      {(cert as any).thumbnail && (
                        <Image className={styles.certThumb} src={(cert as any).thumbnail} mode='aspectFill' />
                      )}
                      <View className={styles.certInfo}>
                        <Text className={styles.certName}>{cert.name}</Text>
                        <View className={styles.certMeta}>
                          <Text>分类：{cert.type}</Text>
                          <Text>上传：{cert.uploadDate}</Text>
                          {cert.expireDate !== '-' && <Text>到期：{cert.expireDate}</Text>}
                        </View>
                      </View>
                      <View className={classnames(styles.certStatus, statusInfo.cls)}>
                        {statusInfo.text}
                      </View>
                    </View>
                  )
                })}
              </View>
              <View style={{ marginTop: '16rpx' }}>
                <View className={styles.uploadBtn} onClick={handleUploadCert}>
                  <Text style={{ fontSize: '32rpx' }}>📤</Text>
                  <Text>上传新证件</Text>
                </View>
              </View>
            </>
          )}
        </View>
      </View>

      {editEmergencyVisible && (
          <View className={styles.modalMask} onClick={() => setEditEmergencyVisible(false)}>
            <View className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
              <View className={styles.modalHeader}>
                <Text className={styles.modalTitle}>编辑紧急联系人</Text>
                <Text className={styles.modalClose} onClick={() => setEditEmergencyVisible(false)}>×</Text>
              </View>
              <View className={styles.modalBody}>
                <View className={styles.formItem}>
                  <Text className={styles.formLabel}>👤 姓名</Text>
                  <Input
                    className={styles.formInput}
                    placeholder='请输入姓名'
                    placeholderStyle='color:#86909C'
                    value={editForm.name}
                    onInput={(e) => setEditForm({ ...editForm, name: e.detail.value })}
                  />
                </View>
                <View className={styles.formItem}>
                  <Text className={styles.formLabel}>👥 关系</Text>
                  <Input
                    className={styles.formInput}
                    placeholder='如：配偶、父亲、母亲、子女'
                    placeholderStyle='color:#86909C'
                    value={editForm.relation}
                    onInput={(e) => setEditForm({ ...editForm, relation: e.detail.value })}
                  />
                </View>
                <View className={styles.formItem}>
                  <Text className={styles.formLabel}>📱 联系电话</Text>
                  <Input
                    className={styles.formInput}
                    type='number'
                    placeholder='请输入联系电话'
                    placeholderStyle='color:#86909C'
                    value={editForm.phone}
                    onInput={(e) => setEditForm({ ...editForm, phone: e.detail.value })}
                  />
                </View>
              </View>
              <View className={styles.modalFooter}>
                <View className={styles.modalCancel} onClick={() => setEditEmergencyVisible(false)}>取消</View>
                <View className={styles.modalConfirm} onClick={handleSaveEmergency}>保存</View>
              </View>
            </View>
          </View>
      )}
    </ScrollView>
  )
}

export default ProfilePage
