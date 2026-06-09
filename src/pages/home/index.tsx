import React, { useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import StatCard from '@/components/StatCard'
import SectionHeader from '@/components/SectionHeader'
import FunctionGrid from '@/components/FunctionGrid'
import TodoItem from '@/components/TodoItem'
import { mockUserInfo } from '@/data/mockUser'
import { mockTodoItems, mockFunctionItems, mockHomeStats, mockNotices } from '@/data/mockMessage'

const HomePage: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    console.log('[Home] pull down refresh')
    setTimeout(() => {
      setRefreshing(false)
      Taro.stopPullDownRefresh()
      Taro.showToast({ title: '刷新成功', icon: 'success' })
    }, 1200)
  }

  const handleNoticeClick = (notice: typeof mockNotices[0]) => {
    console.log('[Home] notice click:', notice.id)
    Taro.showToast({ title: notice.title, icon: 'none' })
  }

  const getUnreadCount = () => mockNotices.filter(n => !n.isRead).length

  return (
    <ScrollView
      scrollY
      enableBackToTop
      refresherEnabled
      refresherTriggered={refreshing}
      onRefresherRefresh={handleRefresh}
      style={{ height: '100vh' }}
    >
      <View className={styles.container}>
        <View className={styles.heroSection}>
          <View className={styles.heroHeader}>
            <View className={styles.greeting}>
              <Image className={styles.avatar} src={mockUserInfo.avatar} mode='aspectFill' />
              <View className={styles.greetingText}>
                <Text className={styles.hello}>早上好 ☀️</Text>
                <Text className={styles.userName}>{mockUserInfo.name}</Text>
              </View>
            </View>
            <View className={styles.heroActions}>
              <View
                className={styles.iconBtn}
                onClick={() => Taro.navigateTo({ url: '/pages/contacts/index' })}
              >
                <Text>📞</Text>
              </View>
              <View
                className={styles.iconBtn}
                onClick={() => Taro.switchTab({ url: '/pages/message/index' })}
              >
                <Text>🔔</Text>
                {getUnreadCount() > 0 && (
                  <View className={styles.badge}>{getUnreadCount()}</View>
                )}
              </View>
            </View>
          </View>
          <View className={styles.heroInfo}>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>工号：</Text>
              <Text>{mockUserInfo.employeeNo}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>部门：</Text>
              <Text>{mockUserInfo.department}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>职位：</Text>
              <Text>{mockUserInfo.position}</Text>
            </View>
          </View>
        </View>

        <View className={styles.statSection}>
          <StatCard items={mockHomeStats} />
        </View>

        <View className={styles.section}>
          <SectionHeader title='常用功能' subtitle='快捷入口' />
          <FunctionGrid items={mockFunctionItems} />
        </View>

        <View className={styles.section}>
          <SectionHeader
            title='待办事项'
            subtitle={`${mockTodoItems.length} 项待处理`}
            actionText='催办'
            onAction={() => Taro.showToast({ title: '已发送催办提醒', icon: 'success' })}
          />
          <View className={styles.todoList}>
            {mockTodoItems.slice(0, 3).map(item => (
              <TodoItem item={item} key={item.id} />
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <SectionHeader
            title='最新通知'
            actionText='全部'
            onAction={() => Taro.switchTab({ url: '/pages/message/index' })}
          />
          <View className={styles.noticeCard}>
            {mockNotices.slice(0, 4).map(notice => (
              <View
                className={styles.noticeItem}
                key={notice.id}
                onClick={() => handleNoticeClick(notice)}
              >
                <View className={styles.noticeIcon}>
                  <Text>
                    {notice.type === 'approval' ? '✅' :
                     notice.type === 'system' ? '💻' :
                     notice.type === 'announcement' ? '📢' : '⏰'}
                  </Text>
                </View>
                <View className={styles.noticeContent}>
                  <Text className={styles.noticeTitle}>{notice.title}</Text>
                  <Text className={styles.noticeTime}>{notice.publishDate}</Text>
                </View>
                {!notice.isRead && <View className={styles.unreadDot} />}
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default HomePage
