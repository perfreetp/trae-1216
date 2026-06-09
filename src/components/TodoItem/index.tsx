import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import type { TodoItem as TodoItemType } from '@/types'
import classnames from 'classnames'

interface TodoItemProps {
  item: TodoItemType
}

const TodoItem: React.FC<TodoItemProps> = ({ item }) => {
  const handleAction = () => {
    console.log('[TodoItem] action:', item.title)
    Taro.showToast({ title: item.actionText, icon: 'none' })
  }

  const statusMap = {
    urgent: { bar: styles.barUrgent, badge: styles.badgeUrgent, text: '紧急' },
    pending: { bar: styles.barPending, badge: styles.badgePending, text: '待办' },
    normal: { bar: styles.barNormal, badge: styles.badgeNormal, text: '提醒' }
  }
  const status = statusMap[item.status]

  return (
    <View className={styles.item}>
      <View className={classnames(styles.leftBar, status.bar)} />
      <View className={styles.content}>
        <View className={styles.header}>
          <Text className={styles.title}>{item.title}</Text>
          <View className={classnames(styles.badge, status.badge)}>{status.text}</View>
        </View>
        <Text className={styles.desc}>{item.description}</Text>
        <View className={styles.footer}>
          <Text className={styles.deadline}>截止：{item.deadline}</Text>
          <View className={styles.actionBtn} onClick={handleAction}>{item.actionText}</View>
        </View>
      </View>
    </View>
  )
}

export default TodoItem
