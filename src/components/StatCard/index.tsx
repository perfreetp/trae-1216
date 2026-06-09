import React from 'react'
import { View, Text } from '@tarojs/components'
import styles from './index.module.scss'

interface StatItem {
  label: string
  value: string
  unit: string
  color: string
}

interface StatCardProps {
  items: StatItem[]
}

const StatCard: React.FC<StatCardProps> = ({ items }) => {
  return (
    <View className={styles.card}>
      <View className={styles.statList}>
        {items.map((item, idx) => (
          <View className={styles.statItem} key={idx}>
            <View className={styles.valueWrap}>
              <Text className={styles.value} style={{ color: item.color }}>{item.value}</Text>
              <Text className={styles.unit}>{item.unit}</Text>
            </View>
            <Text className={styles.label}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

export default StatCard
