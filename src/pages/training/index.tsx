import React, { useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import SectionHeader from '@/components/SectionHeader'
import classnames from 'classnames'
import { mockTrainingCourses, mockExamItems, mockPolicyDocs } from '@/data/mockTraining'

type TabType = 'course' | 'exam' | 'policy'

const TrainingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('course')

  const completedCourses = mockTrainingCourses.filter(c => c.status === 'completed').length
  const totalCourses = mockTrainingCourses.length
  const overallProgress = totalCourses > 0
    ? Math.round(mockTrainingCourses.reduce((acc, c) => acc + c.progress, 0) / totalCourses)
    : 0
  const inProgressCourses = mockTrainingCourses.filter(c => c.status === 'in_progress').length

  const handleCourseClick = (course: typeof mockTrainingCourses[0]) => {
    console.log('[Training] course click:', course.id)
    Taro.showToast({ title: `打开：${course.title}`, icon: 'none' })
  }

  const handleEnroll = (course: typeof mockTrainingCourses[0]) => {
    console.log('[Training] enroll course:', course.id)
    if (course.enrollStatus === 'not_enrolled') {
      Taro.showModal({
        title: '报名确认',
        content: `确定要报名《${course.title}》吗？报名截止：${course.enrollDeadline}`,
        success: (res) => {
          if (res.confirm) {
            Taro.showToast({ title: '报名成功', icon: 'success' })
          }
        }
      })
    } else {
      Taro.showToast({ title: '继续学习', icon: 'none' })
    }
  }

  const handleExamClick = (exam: typeof mockExamItems[0]) => {
    console.log('[Training] exam click:', exam.id)
    if (exam.status === 'not_taken' || exam.status === 'in_progress') {
      Taro.showModal({
        title: '开始考试',
        content: `${exam.title}\n时长：${exam.duration}分钟\n总分：${exam.totalScore}分\n及格：${exam.passScore}分\n剩余次数：${exam.maxAttempts - exam.attemptCount}`,
        success: (res) => {
          if (res.confirm) {
            Taro.showToast({ title: '开始答题', icon: 'none' })
          }
        }
      })
    } else {
      Taro.showToast({ title: `考试${exam.status === 'passed' ? '通过' : '未通过'}`, icon: 'none' })
    }
  }

  const handlePolicyConfirm = (policy: typeof mockPolicyDocs[0]) => {
    console.log('[Training] policy confirm:', policy.id)
    if (!policy.isConfirmed) {
      Taro.showModal({
        title: '制度确认',
        content: `请认真阅读《${policy.title}》后确认。`,
        confirmText: '我已阅读并确认',
        success: (res) => {
          if (res.confirm) {
            Taro.showToast({ title: '确认成功', icon: 'success' })
          }
        }
      })
    } else {
      Taro.showToast({ title: '已确认', icon: 'none' })
    }
  }

  const getExamStatusInfo = (s: string) => ({
    not_taken: { text: '未考', cls: styles.badgeNotStart },
    in_progress: { text: '进行中', cls: styles.badgeProgress },
    passed: { text: '已通过', cls: styles.badgeDone },
    failed: { text: '未通过', cls: styles.badgeNotStart }
  }[s] || { text: s, cls: styles.badgeNotStart })

  return (
    <ScrollView scrollY style={{ height: '100vh' }}>
      <View className={styles.container}>
        <View className={styles.progressHeader}>
          <View className={styles.progressRow}>
            <View className={styles.progressInfo}>
              <Text className={styles.progressTitle}>年度学习总进度</Text>
              <Text className={styles.progressValue}>{overallProgress}%</Text>
            </View>
            <View className={styles.progressStats}>
              <View className={styles.statCol}>
                <Text className={styles.statNum}>{completedCourses}</Text>
                <Text className={styles.statLabel}>已完成</Text>
              </View>
              <View className={styles.statCol}>
                <Text className={styles.statNum}>{inProgressCourses}</Text>
                <Text className={styles.statLabel}>学习中</Text>
              </View>
            </View>
          </View>
          <View className={styles.progressBarWrap}>
            <View className={styles.progressBar} style={{ width: `${overallProgress}%` }} />
          </View>
          <Text className={styles.progressHint}>还需加油！共 {totalCourses} 门必修课程</Text>
        </View>

        <View className={styles.tabs}>
          {[
            { key: 'course' as TabType, label: '培训课程' },
            { key: 'exam' as TabType, label: '在线考试' },
            { key: 'policy' as TabType, label: '制度阅读' }
          ].map(tab => (
            <View
              className={classnames(styles.tab, activeTab === tab.key && styles.tabActive)}
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </View>
          ))}
        </View>

        {activeTab === 'course' && (
          <View className={styles.section}>
            <SectionHeader
              title='我的课程'
              subtitle={`共 ${totalCourses} 门`}
              actionText='全部课程'
            />
            <View className={styles.courseList}>
              {mockTrainingCourses.map(course => (
                <View
                  className={styles.courseCard}
                  key={course.id}
                  onClick={() => handleCourseClick(course)}
                >
                  <View className={styles.courseCover}>
                    <Image className={styles.coverImg} src={course.cover} mode='aspectFill' />
                    {course.status !== 'not_started' && (
                      <View className={styles.playIcon}>
                        <Text>{course.status === 'completed' ? '✓' : '▶'}</Text>
                      </View>
                    )}
                  </View>
                  <View className={styles.courseContent}>
                    <View className={styles.courseTop}>
                      <Text className={styles.courseTitle}>{course.title}</Text>
                      <View className={styles.courseMeta}>
                        <View className={styles.courseCategory}>{course.category}</View>
                        <Text className={styles.metaItem}>⏱ {course.duration}分钟</Text>
                      </View>
                    </View>
                    <View className={styles.courseBottom}>
                      <View className={styles.courseProgress}>
                        <View className={styles.miniProgress}>
                          <View className={styles.miniProgressBar} style={{ width: `${course.progress}%` }} />
                        </View>
                        <Text className={styles.progressText}>{course.progress}%</Text>
                      </View>
                      {course.enrollStatus === 'not_enrolled' ? (
                        <View
                          className={classnames(styles.courseBtn, styles.btnOutline)}
                          onClick={(e) => { e.stopPropagation(); handleEnroll(course) }}
                        >
                          立即报名
                        </View>
                      ) : course.status === 'completed' ? (
                        <View className={classnames(styles.courseBtn, styles.btnSuccess)}>
                          已完成
                        </View>
                      ) : (
                        <View
                          className={classnames(styles.courseBtn, styles.btnPrimary)}
                          onClick={(e) => { e.stopPropagation(); handleEnroll(course) }}
                        >
                          继续学习
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'exam' && (
          <View className={styles.section}>
            <SectionHeader
              title='考试任务'
              subtitle={`共 ${mockExamItems.length} 场`}
            />
            <View className={styles.examList}>
              {mockExamItems.map(exam => {
                const statusInfo = getExamStatusInfo(exam.status)
                return (
                  <View className={styles.examCard} key={exam.id}>
                    <View className={styles.examHeader}>
                      <Text className={styles.examTitle}>📋 {exam.title}</Text>
                      <View className={classnames(styles.statusBadge, statusInfo.cls)}>
                        {statusInfo.text}
                      </View>
                    </View>
                    <View className={styles.examBody}>
                      <View className={styles.examRow}>
                        <Text className={styles.examLabel}>📚 所属课程</Text>
                        <Text className={styles.examValue}>{exam.courseTitle}</Text>
                      </View>
                      <View className={styles.examRow}>
                        <Text className={styles.examLabel}>⏱ 考试时长</Text>
                        <Text className={styles.examValue}>{exam.duration} 分钟</Text>
                      </View>
                      <View className={styles.examRow}>
                        <Text className={styles.examLabel}>🎯 总分 / 及格</Text>
                        <Text className={styles.examValue}>{exam.totalScore} / {exam.passScore}</Text>
                      </View>
                      <View className={styles.examRow}>
                        <Text className={styles.examLabel}>⏳ 截止时间</Text>
                        <Text className={styles.examValue} style={{ color: exam.status === 'passed' ? '' : '#F53F3F' }}>
                          {exam.deadline}
                        </Text>
                      </View>
                      <View className={styles.examRow}>
                        <Text className={styles.examLabel}>📝 考试次数</Text>
                        <Text className={styles.examValue}>{exam.attemptCount} / {exam.maxAttempts}</Text>
                      </View>
                    </View>
                    <View className={styles.examFooter}>
                      {(exam.status === 'not_taken' || exam.status === 'in_progress') && (
                        <View
                          className={classnames(styles.courseBtn, styles.btnPrimary)}
                          onClick={() => handleExamClick(exam)}
                        >
                          {exam.status === 'in_progress' ? '继续答题' : '开始考试'}
                        </View>
                      )}
                    </View>
                  </View>
                )
              })}
            </View>
          </View>
        )}

        {activeTab === 'policy' && (
          <View className={styles.section}>
            <SectionHeader
              title='制度确认'
              subtitle={`未确认 ${mockPolicyDocs.filter(p=>!p.isConfirmed).length} 项`}
            />
            <View className={styles.policyList}>
              {mockPolicyDocs.map(policy => (
                <View className={styles.policyCard} key={policy.id}>
                  <View className={styles.policyHeader}>
                    <Text className={styles.policyTitle}>📖 {policy.title}</Text>
                    <View className={classnames(styles.confirmTag, policy.isConfirmed ? styles.tagConfirmed : styles.tagUnconfirmed)}>
                      {policy.isConfirmed ? '✓ 已确认' : '待确认'}
                    </View>
                  </View>
                  <View className={styles.policyMeta}>
                    <Text className={styles.metaItem2}>分类：{policy.category}</Text>
                    <Text className={styles.metaItem2}>版本：{policy.version}</Text>
                    <Text className={styles.metaItem2}>发布：{policy.publishDate}</Text>
                  </View>
                  <View className={styles.policyFooter}>
                    {!policy.isConfirmed && (
                      <Text className={styles.readHint}>⚠ 请于 {policy.confirmDeadline} 前完成确认</Text>
                    )}
                    <View style={{ flex: 1 }} />
                    <View
                      className={classnames(styles.courseBtn, policy.isConfirmed ? styles.btnSuccess : styles.btnPrimary)}
                      onClick={() => handlePolicyConfirm(policy)}
                    >
                      {policy.isConfirmed ? '查看文档' : '阅读并确认'}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default TrainingPage
