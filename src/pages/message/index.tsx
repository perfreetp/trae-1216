import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import classnames from 'classnames'
import { mockNotices, mockTodoItems } from '@/data/mockMessage'

type FilterType = 'all' | 'approval' | 'system' | 'announcement' | 'reminder'

const MessagePage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [notices, setNotices] = useState(mockNotices)

  const unreadCount = notices.filter(n => !n.isRead).length
  const approvalCount = notices.filter(n => n.type === 'approval').length
  const systemCount = notices.filter(n => n.type === 'system').length
  const announcementCount = notices.filter(n => n.type === 'announcement').length
  const reminderCount = notices.filter(n => n.type === 'reminder').length

  const filteredNotices = useMemo(() => {
    if (activeFilter === 'all') return notices
    return notices.filter(n => n.type === activeFilter)
  }, [notices, activeFilter])

  const filterOptions = [
    { key: 'all' as FilterType, label: '全部', count: notices.length, unread: unreadCount },
    { key: 'approval' as FilterType, label: '审批通知', count: approvalCount, unread: notices.filter(n => n.type === 'approval' && !n.isRead).length },
    { key: 'system' as FilterType, label: '系统消息', count: systemCount, unread: notices.filter(n => n.type === 'system' && !n.isRead).length },
    { key: 'announcement' as FilterType, label: '公告通知', count: announcementCount, unread: notices.filter(n => n.type === 'announcement' && !n.isRead).length },
    { key: 'reminder' as FilterType, label: '待办提醒', count: reminderCount, unread: notices.filter(n => n.type === 'reminder' && !n.isRead).length }
  ]

  const typeMap: Record<string, { icon: string; iconCls: string; typeCls: string; label: string }> = {
    approval: { icon: '✅', iconCls: styles.iconApproval, typeCls: styles.typeApproval, label: '审批' },
    system: { icon: '💻', iconCls: styles.iconSystem, typeCls: styles.typeSystem, label: '系统' },
    announcement: { icon: '📢', iconCls: styles.iconAnnouncement, typeCls: styles.typeAnnouncement, label: '公告' },
    reminder: { icon: '⏰', iconCls: styles.iconReminder, typeCls: styles.typeReminder, label: '提醒' }
  }

  const handleMessageClick = (notice: typeof notices[0]) => {
    console.log('[Message] click notice:', notice.id)
    if (!notice.isRead) {
      setNotices(prev => prev.map(n => n.id === notice.id ? { ...n, isRead: true } : n))
    }
    Taro.showToast({ title: notice.title, icon: 'none' })
  }

  const handleMarkAll = () => {
    console.log('[Message] mark all as read')
    setNotices(prev => prev.map(n => ({ ...n, isRead: true })))
    Taro.showToast({ title: '已全部标记为已读', icon: 'success' })
  }

  const handleUrge = (notice: typeof notices[0]) => {
    console.log('[Message] urge:', notice.id)
    Taro.showModal({
      title: '催办确认',
      content: '确定要发送催办提醒吗？审批人会收到短信和消息提醒。',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '催办已发送', icon: 'success' })
        }
      }
    })
  }

  return (
    <ScrollView scrollY style={{ height: '100vh' }}>
      <View className={styles.container}>
        <View className={styles.summaryCard}>
          <Text className={styles.summaryTitle}>消息概览</Text>
          <View className={styles.summaryRow}>
            <View className={styles.summaryCol}>
              <Text className={styles.summaryNum}>{unreadCount}</Text>
              <Text className={styles.summaryLabel}>未读消息</Text>
            </View>
            <View className={styles.summaryCol}>
              <Text className={styles.summaryNum}>{mockTodoItems.length}</Text>
              <Text className={styles.summaryLabel}>待办事项</Text>
            </View>
            <View className={styles.summaryCol}>
              <Text className={styles.summaryNum}>{mockTodoItems.filter(t => t.status === 'urgent').length}</Text>
              <Text className={styles.summaryLabel}>紧急事项</Text>
            </View>
            <View className={styles.summaryCol}>
              <Text className={styles.summaryNum}>{notices.length}</Text>
              <Text className={styles.summaryLabel}>历史消息</Text>
            </View>
          </View>
        </View>

        <View className={styles.filterRow}>
          {filterOptions.map(opt => (
            <View
              className={classnames(styles.filterChip, activeFilter === opt.key && styles.filterChipActive)}
              key={opt.key}
              onClick={() => setActiveFilter(opt.key)}
            >
              <Text>{opt.label}</Text>
              {opt.unread > 0 && (
                <View className={classnames(styles.chipCount, activeFilter !== opt.key && styles.chipCountInactive)}>
                  {opt.unread}
                </View>
              )}
            </View>
          ))}
        </View>

        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            <Text>消息列表</Text>
            {unreadCount > 0 && (
              <Text className={styles.markAll} onClick={handleMarkAll}>全部已读</Text>
            )}
          </View>
          <View className={styles.messageList}>
            {filteredNotices.length === 0 ? (
              <View style={{
                padding: '80rpx 0',
                textAlign: 'center',
                color: '#86909C',
                fontSize: '28rpx'
              }}>
                暂无相关消息
              </View>
            ) : filteredNotices.map(notice => {
              const typeInfo = typeMap[notice.type]
              return (
                <View
                  className={classnames(styles.messageCard, !notice.isRead && styles.messageUnread)}
                  key={notice.id}
                  onClick={() => handleMessageClick(notice)}
                >
                  <View className={styles.messageHeader}>
                    <View className={classnames(styles.iconWrap, typeInfo.iconCls)}>
                      <Text>{typeInfo.icon}</Text>
                    </View>
                    <View className={styles.messageInfo}>
                      <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text className={styles.messageTitle}>
                          {notice.title}
                          {!notice.isRead && <View className={styles.unreadDot} />}
                        </Text>
                      </View>
                      <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View className={classnames(styles.messageType, typeInfo.typeCls)}>
                          {typeInfo.label}
                        </View>
                        <Text className={styles.messageTime}>{notice.publishDate}</Text>
                      </View>
                    </View>
                  </View>
                  <Text className={styles.messageContent}>{notice.content}</Text>
                  {notice.type === 'approval' && notice.relatedId && !notice.isRead && (
                    <View className={styles.messageFooter}>
                      <View
                        className={classnames(styles.msgBtn, styles.btnUrgent)}
                        onClick={(e) => { e.stopPropagation(); handleUrge(notice) }}
                      >
                        🔥 催办
                      </View>
                      <View
                        className={classnames(styles.msgBtn, styles.btnPrimary)}
                        onClick={(e) => { e.stopPropagation(); Taro.showToast({ title: '查看详情', icon: 'none' }) }}
                      >
                        查看详情
                      </View>
                    </View>
                  )}
                </View>
              )
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default MessagePage
