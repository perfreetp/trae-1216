import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  actionText?: string
  onAction?: () => void
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, actionText, onAction }) => {
  const handleAction = () => {
    if (onAction) {
      onAction()
    } else if (actionText) {
      Taro.showToast({ title: '查看更多', icon: 'none' })
    }
  }

  return (
    <View className={styles.header}>
      <View className={styles.titleWrap}>
        <View className={styles.bar} />
        <Text className={styles.title}>{title}</Text>
        {subtitle && <Text className={styles.subtitle}>{subtitle}</Text>}
      </View>
      {actionText && (
        <View className={styles.action} onClick={handleAction}>
          <Text>{actionText}</Text>
          <Text className={styles.arrow}>›</Text>
        </View>
      )}
    </View>
  )
}

export default SectionHeader
