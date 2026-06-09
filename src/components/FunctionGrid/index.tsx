import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import type { FunctionItem } from '@/types'

interface FunctionGridProps {
  items: FunctionItem[]
}

const FunctionGrid: React.FC<FunctionGridProps> = ({ items }) => {
  const handleItemClick = (item: FunctionItem) => {
    console.log('[FunctionGrid] click item:', item.name, item.pagePath)
    if (item.pagePath) {
      if (item.pagePath.includes('tabBar') ||
          item.pagePath.includes('/pages/home/') ||
          item.pagePath.includes('/pages/attendance/') ||
          item.pagePath.includes('/pages/training/') ||
          item.pagePath.includes('/pages/message/') ||
          item.pagePath.includes('/pages/profile/')) {
        Taro.switchTab({ url: item.pagePath }).catch((err) => {
          console.error('[FunctionGrid] switchTab error:', err)
          Taro.showToast({ title: '页面跳转失败', icon: 'none' })
        })
      } else {
        Taro.navigateTo({ url: item.pagePath }).catch((err) => {
          console.error('[FunctionGrid] navigateTo error:', err)
          Taro.showToast({ title: '页面跳转失败', icon: 'none' })
        })
      }
    } else {
      Taro.showToast({ title: `${item.name}`, icon: 'none' })
    }
  }

  return (
    <View className={styles.grid}>
      {items.map((item, idx) => (
        <View className={styles.item} key={item.id} onClick={() => handleItemClick(item)}>
          <View className={`${styles.iconWrap} ${styles['iconBg' + (idx % 8)]}`}>
            <Text>{item.icon}</Text>
          </View>
          <Text className={styles.name}>{item.name}</Text>
        </View>
      ))}
    </View>
  )
}

export default FunctionGrid
