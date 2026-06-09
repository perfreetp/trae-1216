import React, { useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import classnames from 'classnames'
import { mockCertificateApplications } from '@/data/mockPerformance'

type CertType = '在职证明' | '收入证明' | '离职证明' | '工作证明'

const CertificatePage: React.FC = () => {
  const [applications, setApplications] = useState(mockCertificateApplications)

  const certTypes: Array<{ type: CertType; icon: string; desc: string }> = [
    { type: '在职证明', icon: '🏢', desc: '签证/贷款/买房等' },
    { type: '收入证明', icon: '💰', desc: '贷款/签证/信用卡' },
    { type: '工作证明', icon: '📋', desc: '职称/考试报名等' },
    { type: '离职证明', icon: '📤', desc: '新单位入职手续' }
  ]

  const handleApply = (type: CertType) => {
    console.log('[Certificate] apply:', type)
    Taro.showModal({
      title: `申请${type}`,
      editable: true,
      placeholderText: '请输入申请用途（如：银行房贷、签证办理等）',
      success: (res) => {
        if (res.confirm && res.content) {
          const newApp = {
            id: `CA${Date.now()}`,
            type,
            typeName: type,
            purpose: res.content,
            applyDate: new Date().toISOString().slice(0, 10),
            status: 'pending' as const,
            approver: '吴艳（人事主管）'
          }
          setApplications([newApp, ...applications])
          Taro.showToast({ title: '申请已提交', icon: 'success' })
        }
      }
    })
  }

  const handleDownload = (app: typeof mockCertificateApplications[0]) => {
    console.log('[Certificate] download:', app.id)
    Taro.showToast({ title: `正在下载${app.typeName}`, icon: 'none' })
  }

  const handleUrge = (app: typeof mockCertificateApplications[0]) => {
    console.log('[Certificate] urge:', app.id)
    Taro.showModal({
      title: '催办确认',
      content: `确定要催促${app.approver}处理吗？`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '催办已发送', icon: 'success' })
        }
      }
    })
  }

  const statusMap = {
    pending: { text: '审批中', cls: styles.statusPending },
    approved: { text: '已通过', cls: styles.statusApproved },
    rejected: { text: '已拒绝', cls: styles.statusRejected }
  }

  return (
    <ScrollView scrollY style={{ height: '100vh' }}>
      <View className={styles.container}>
        <View className={styles.applyCard}>
          <Text className={styles.applyTitle}>📄 在线开具证明</Text>
          <Text className={styles.applyDesc}>选择需要开具的证明类型，审批通过后可下载PDF版本</Text>
          <View className={styles.certTypeGrid}>
            {certTypes.map(item => (
              <View
                className={styles.certTypeItem}
                key={item.type}
                onClick={() => handleApply(item.type)}
              >
                <Text className={styles.typeIcon}>{item.icon}</Text>
                <Text className={styles.typeName}>{item.type}</Text>
                <Text className={styles.typeHint}>{item.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.historySection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>
              申请记录
              <View className={styles.countBadge}>{applications.length}</View>
            </Text>
          </View>
          <View className={styles.historyList}>
            {applications.map(app => {
              const statusInfo = statusMap[app.status]
              return (
                <View className={styles.historyCard} key={app.id}>
                  <View className={styles.historyHeader}>
                    <Text className={styles.historyType}>
                      {app.type === '在职证明' ? '🏢' :
                       app.type === '收入证明' ? '💰' :
                       app.type === '离职证明' ? '📤' : '📋'}
                      {app.typeName}
                    </Text>
                    <View className={classnames(styles.statusTag, statusInfo.cls)}>
                      {statusInfo.text}
                    </View>
                  </View>
                  <View className={styles.historyBody}>
                    <View className={styles.historyRow}>
                      <Text className={styles.rowLabel}>申请用途</Text>
                      <Text className={styles.rowValue}>{app.purpose}</Text>
                    </View>
                    <View className={styles.historyRow}>
                      <Text className={styles.rowLabel}>申请时间</Text>
                      <Text className={styles.rowValue}>{app.applyDate}</Text>
                    </View>
                    <View className={styles.historyRow}>
                      <Text className={styles.rowLabel}>审批人</Text>
                      <Text className={styles.rowValue}>{app.approver}</Text>
                    </View>
                  </View>
                  <View className={styles.historyFooter}>
                    {app.status === 'pending' && (
                      <View
                        className={classnames(styles.actionBtn, styles.btnOutline)}
                        onClick={() => handleUrge(app)}
                      >
                        🔥 催办
                      </View>
                    )}
                    {app.status === 'approved' && app.downloadUrl && (
                      <View
                        className={classnames(styles.actionBtn, styles.btnPrimary)}
                        onClick={() => handleDownload(app)}
                      >
                        ⬇ 下载PDF
                      </View>
                    )}
                  </View>
                </View>
              )
            })}
          </View>
        </View>

        <View className={styles.tipsCard}>
          <Text className={styles.tipsTitle}>⚠️ 温馨提示</Text>
          <Text className={styles.tipsContent}>
            {'\n'}1. 证明申请提交后，将由人事部门在1-2个工作日内完成审批{'\n'}
            {'\n'}2. 电子版证明与纸质版具有同等法律效力{'\n'}
            {'\n'}3. 如需加盖鲜章的纸质证明，请在审批通过后联系人事窗口领取{'\n'}
            {'\n'}4. 每月同一类型证明最多可申请3次{'\n'}
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}

export default CertificatePage
