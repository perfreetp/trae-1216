import React, { useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import classnames from 'classnames'
import { mockPerformanceGoals } from '@/data/mockPerformance'

const PerformancePage: React.FC = () => {
  const [goals, setGoals] = useState(mockPerformanceGoals)

  const totalWeight = goals.reduce((acc, g) => acc + g.weight, 0)
  const avgProgress = goals.length > 0
    ? Math.round(goals.reduce((acc, g) => acc + g.progress * g.weight, 0) / totalWeight)
    : 0
  const avgSelfScore = goals.length > 0
    ? Math.round(goals.reduce((acc, g) => acc + (g.selfScore || 0) * g.weight / 100, 0))
    : 0

  const handleEditProgress = (goal: typeof mockPerformanceGoals[0]) => {
    console.log('[Performance] edit progress:', goal.id)
    Taro.showModal({
      title: '更新进展说明',
      editable: true,
      placeholderText: goal.actual || '请输入最新进展情况...',
      success: (res) => {
        if (res.confirm && res.content) {
          setGoals(prev => prev.map(g =>
            g.id === goal.id ? { ...g, actual: res.content as string } : g
          ))
          Taro.showToast({ title: '进展已更新', icon: 'success' })
        }
      }
    })
  }

  const handleUpdateProgress = (goal: typeof mockPerformanceGoals[0]) => {
    console.log('[Performance] update progress percentage:', goal.id)
    Taro.showActionSheet({
      itemList: ['25%', '50%', '75%', '90%', '100%'],
      success: (res) => {
        const newProgress = [25, 50, 75, 90, 100][res.tapIndex]
        setGoals(prev => prev.map(g =>
          g.id === goal.id ? { ...g, progress: newProgress } : g
        ))
        Taro.showToast({ title: `进度更新为${newProgress}%`, icon: 'success' })
      }
    })
  }

  const handleScore = (goal: typeof mockPerformanceGoals[0]) => {
    console.log('[Performance] self score:', goal.id)
    Taro.showModal({
      title: '自评分（0-100）',
      editable: true,
      placeholderText: `请输入自评分，当前：${goal.selfScore || ''}`,
      success: (res) => {
        if (res.confirm && res.content) {
          const score = parseInt(res.content)
          if (score >= 0 && score <= 100) {
            setGoals(prev => prev.map(g =>
              g.id === goal.id ? { ...g, selfScore: score } : g
            ))
            Taro.showToast({ title: '评分已保存', icon: 'success' })
          } else {
            Taro.showToast({ title: '请输入0-100之间的数字', icon: 'none' })
          }
        }
      }
    })
  }

  const handleSubmitReview = () => {
    console.log('[Performance] submit for review')
    Taro.showModal({
      title: '提交自评确认',
      content: `已完成 ${goals.filter(g => g.selfScore).length}/${goals.length} 项目标自评，综合得分约 ${avgSelfScore} 分。确定提交给主管评审吗？`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '已提交主管评审', icon: 'success' })
        }
      }
    })
  }

  return (
    <ScrollView scrollY style={{ height: '100vh' }}>
      <View className={styles.container}>
        <View className={styles.summaryCard}>
          <View className={styles.periodRow}>
            <Text className={styles.periodLabel}>📊 2024年中绩效（H1）</Text>
            <View className={classnames(styles.statusTag, styles.statusReviewing)}>
              自评中
            </View>
          </View>
          <View className={styles.statGrid}>
            <View className={styles.statItem}>
              <Text className={classnames(styles.statNum, styles.numBlue)}>{goals.length}</Text>
              <Text className={styles.statLabel}>目标数</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={classnames(styles.statNum, styles.numGreen)}>{avgProgress}%</Text>
              <Text className={styles.statLabel}>平均进度</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={classnames(styles.statNum, styles.numOrange)}>{avgSelfScore}</Text>
              <Text className={styles.statLabel}>自评分</Text>
            </View>
          </View>
        </View>

        <View className={styles.goalSection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>🎯 绩效目标清单</Text>
            <Text className={styles.totalWeight}>权重合计：{totalWeight}%</Text>
          </View>
          <View className={styles.goalList}>
            {goals.map(goal => (
              <View className={styles.goalCard} key={goal.id}>
                <View className={styles.goalHeader}>
                  <View className={styles.goalInfo}>
                    <View className={styles.categoryTag}>{goal.category}</View>
                    <Text className={styles.goalTitle}>{goal.title}</Text>
                  </View>
                  <View className={styles.weightBadge}>权重 {goal.weight}%</View>
                </View>

                <View className={styles.goalTarget}>
                  🎯 目标：{goal.target}
                </View>

                <View className={styles.progressSection}>
                  <View className={styles.progressHeader}>
                    <Text className={styles.progressLabel}>完成进度</Text>
                    <Text className={styles.progressValue}>{goal.progress}%</Text>
                  </View>
                  <View className={styles.progressBarWrap}>
                    <View className={styles.progressBar} style={{ width: `${goal.progress}%` }} />
                  </View>
                </View>

                {goal.actual && (
                  <View className={styles.actualDesc}>
                    📝 实际进展：{goal.actual}
                  </View>
                )}

                <View className={styles.scoreRow}>
                  <View className={styles.scoreCol}>
                    <Text className={styles.scoreLabel}>自评分</Text>
                    <Text className={classnames(styles.scoreNum, styles.selfScore)}>
                      {goal.selfScore ?? '--'}
                    </Text>
                  </View>
                  <View className={styles.scoreCol}>
                    <Text className={styles.scoreLabel}>主管评分</Text>
                    <Text className={classnames(styles.scoreNum, styles.leaderScore)}>
                      {goal.leaderScore ?? '--'}
                    </Text>
                  </View>
                </View>

                <View className={styles.actionRow}>
                  <View
                    className={classnames(styles.actionBtn, styles.btnOutline)}
                    onClick={() => handleUpdateProgress(goal)}
                  >
                    更新进度
                  </View>
                  <View
                    className={classnames(styles.actionBtn, styles.btnOutline)}
                    onClick={() => handleEditProgress(goal)}
                  >
                    填写说明
                  </View>
                  <View
                    className={classnames(styles.actionBtn, styles.btnPrimary)}
                    onClick={() => handleScore(goal)}
                  >
                    自评打分
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.summarySection}>
          <Text className={styles.summaryTitle}>📈 绩效汇总</Text>
          <View className={styles.summaryRow}>
            <Text className={styles.summaryLabel}>考核周期</Text>
            <Text className={styles.summaryValue}>2024年1月1日 - 2024年6月30日</Text>
          </View>
          <View className={styles.summaryRow}>
            <Text className={styles.summaryLabel}>目标总数</Text>
            <Text className={styles.summaryValue}>{goals.length} 项</Text>
          </View>
          <View className={styles.summaryRow}>
            <Text className={styles.summaryLabel}>权重合计</Text>
            <Text className={styles.summaryValue}>{totalWeight}%</Text>
          </View>
          <View className={styles.summaryRow}>
            <Text className={styles.summaryLabel}>加权平均进度</Text>
            <Text className={styles.summaryValue} style={{ color: '#165DFF' }}>{avgProgress}%</Text>
          </View>
          <View className={styles.summaryRow}>
            <Text className={styles.summaryLabel}>加权自评分</Text>
            <Text className={styles.summaryValue} style={{ color: '#00B42A' }}>{avgSelfScore} 分</Text>
          </View>
          <View className={styles.summaryRow}>
            <Text className={styles.summaryLabel}>自评截止</Text>
            <Text className={styles.summaryValue} style={{ color: '#F53F3F' }}>2024年6月20日</Text>
          </View>
          <View style={{ marginTop: '32rpx' }}>
            <View
              className={classnames(styles.actionBtn, styles.btnPrimary)}
              style={{ width: '100%', height: '96rpx', fontSize: '30rpx' }}
              onClick={handleSubmitReview}
            >
              ✅ 提交自评给主管评审
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default PerformancePage
