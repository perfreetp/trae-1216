import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import styles from './index.module.scss'
import SectionHeader from '@/components/SectionHeader'
import classnames from 'classnames'
import { mockSchedule, mockLeaveRecords, mockOvertimeBalance, mockAttendanceRecords } from '@/data/mockAttendance'

type TabType = 'schedule' | 'leave' | 'record'

const AttendancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('schedule')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [checkInTime, setCheckInTime] = useState<string | null>('08:55')
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useDidShow(() => {
    console.log('[Attendance] page show')
  })

  const formatTime = (d: Date) => {
    const h = String(d.getHours()).padStart(2, '0')
    const m = String(d.getMinutes()).padStart(2, '0')
    return `${h}:${m}`
  }
  const formatDate = (d: Date) => {
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${['周日','周一','周二','周三','周四','周五','周六'][d.getDay()]}`
  }

  const handlePunch = (type: 'checkin' | 'checkout') => {
    const now = formatTime(new Date())
    console.log(`[Attendance] punch ${type} at ${now}`)
    if (type === 'checkin') {
      setCheckInTime(now)
      Taro.showToast({ title: `上班打卡成功 ${now}`, icon: 'success' })
    } else {
      setCheckOutTime(now)
      Taro.showToast({ title: `下班打卡成功 ${now}`, icon: 'success' })
    }
  }

  const handleGoOutPunch = () => {
    console.log('[Attendance] go out punch')
    Taro.showModal({
      title: '外出打卡',
      content: '确定要提交外出打卡吗？将记录您的当前位置。',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '外出打卡已提交', icon: 'success' })
        }
      }
    })
  }

  const handleApplyLeave = () => {
    console.log('[Attendance] apply leave')
    const leaves = ['年假', '病假', '事假', '婚假', '产假', '丧假']
    Taro.showActionSheet({
      itemList: leaves,
      success: (res) => {
        Taro.showToast({ title: `申请${leaves[res.tapIndex]}`, icon: 'none' })
      }
    })
  }

  const todayStr = `${currentTime.getFullYear()}-${String(currentTime.getMonth()+1).padStart(2,'0')}-${String(currentTime.getDate()).padStart(2,'0')}`
  const todaySchedule = mockSchedule.find(s => s.date === todayStr)
  const weekdays = ['日','一','二','三','四','五','六']

  const statusText: Record<string, string> = {
    pending: '审批中',
    approved: '已通过',
    rejected: '已拒绝',
    normal: '正常',
    late: '迟到',
    early: '早退',
    absent: '缺勤'
  }

  const balanceItems = [
    { label: '年假剩余', value: mockOvertimeBalance.annualLeave, unit: '天' },
    { label: '调休剩余', value: mockOvertimeBalance.compensatoryLeave, unit: '天' },
    { label: '病假剩余', value: mockOvertimeBalance.sickLeave, unit: '天' },
    { label: '加班累计', value: mockOvertimeBalance.overtimeHours, unit: '小时' }
  ]

  return (
    <ScrollView scrollY style={{ height: '100vh' }}>
      <View className={styles.container}>
        <View className={styles.punchCard}>
          <Text className={styles.punchTitle}>
            {todaySchedule ? `今日排班：${todaySchedule.shiftName}` : '暂无排班'}
            {todaySchedule?.startTime && ` · ${todaySchedule.startTime}-${todaySchedule.endTime}`}
          </Text>
          <Text className={styles.currentTime}>{formatTime(currentTime)}</Text>
          <Text className={styles.currentDate}>{formatDate(currentTime)}</Text>

          <View className={styles.punchRow}>
            <View className={styles.punchCol}>
              <Text className={styles.punchLabel}>上班打卡</Text>
              <Text className={classnames(styles.punchValue, checkInTime && checkInTime > '09:00' && styles.punchValueLate)}>
                {checkInTime || '--:--'}
              </Text>
            </View>
            <View className={styles.punchCol}>
              <Text className={styles.punchLabel}>下班打卡</Text>
              <Text className={styles.punchValue}>{checkOutTime || '--:--'}</Text>
            </View>
          </View>

          <View className={styles.punchActions}>
            <View
              className={classnames(styles.punchBtn, styles.btnPrimary)}
              onClick={() => !checkInTime && handlePunch('checkin')}
            >
              {checkInTime ? '✓ 已打卡' : '上班打卡'}
            </View>
            <View
              className={classnames(styles.punchBtn, checkOutTime ? styles.btnSecondary : styles.btnPrimary)}
              onClick={() => !checkOutTime && handlePunch('checkout')}
            >
              {checkOutTime ? '✓ 已打卡' : '下班打卡'}
            </View>
          </View>

          <View style={{ marginTop: '24rpx' }}>
            <View
              className={classnames(styles.punchBtn, styles.btnSecondary)}
              onClick={handleGoOutPunch}
            >
              📍 外出打卡
            </View>
          </View>
        </View>

        <View className={styles.balanceSection}>
          <SectionHeader title='假期与加班余额' />
          <View className={styles.balanceGrid}>
            {balanceItems.map((item, idx) => (
              <View
                className={classnames(styles.balanceCard, styles['balanceCard' + idx])}
                key={item.label}
              >
                <Text className={styles.balanceLabel}>
                  {idx === 0 && '🏖️'}
                  {idx === 1 && '🔄'}
                  {idx === 2 && '🏥'}
                  {idx === 3 && '⏰'}
                  {item.label}
                </Text>
                <Text className={classnames(styles.balanceValue, styles['value' + idx])}>{item.value}</Text>
                <Text className={styles.balanceUnit}>单位：{item.unit}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.tabs}>
            {[
              { key: 'schedule' as TabType, label: '本月排班' },
              { key: 'leave' as TabType, label: '请假记录' },
              { key: 'record' as TabType, label: '考勤明细' }
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

          {activeTab === 'schedule' && (
            <View className={styles.scheduleWrap}>
              <View className={styles.scheduleHeader}>
                <Text className={styles.monthLabel}>
                  {currentTime.getFullYear()}年{currentTime.getMonth() + 1}月
                </Text>
              </View>
              <View className={styles.weekdayHeader}>
                {weekdays.map(w => <View className={styles.weekdayItem} key={w}>{w}</View>)}
              </View>
              <View className={styles.calendarGrid}>
                {Array.from({ length: new Date(currentTime.getFullYear(), currentTime.getMonth(), 1).getDay() }).map((_, i) => (
                  <View key={`empty-${i}`} />
                ))}
                {mockSchedule.map(day => {
                  const dayNum = parseInt(day.date.split('-')[2])
                  const isToday = day.date === todayStr
                  const shiftClass =
                    day.shift === 'rest' ? styles.dayRest :
                    day.shift === 'morning' ? styles.dayMorning :
                    day.shift === 'afternoon' ? styles.dayAfternoon :
                    day.shift === 'night' ? styles.dayNight : styles.dayNormal
                  return (
                    <View
                      className={classnames(styles.calendarDay, shiftClass, isToday && styles.dayToday)}
                      key={day.date}
                    >
                      <Text className={styles.dayNumber}>{dayNum}</Text>
                      <Text className={styles.dayShift}>{day.shiftName.slice(0,1)}</Text>
                    </View>
                  )
                })}
              </View>
              <View className={styles.scheduleLegend}>
                {[
                  { name: '正常班', cls: styles.dayNormal },
                  { name: '早班', cls: styles.dayMorning },
                  { name: '中班', cls: styles.dayAfternoon },
                  { name: '晚班', cls: styles.dayNight },
                  { name: '休息', cls: styles.dayRest }
                ].map(item => (
                  <View className={styles.legendItem} key={item.name}>
                    <View className={classnames(styles.legendDot, item.cls)} />
                    <Text>{item.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {activeTab === 'leave' && (
            <View className={styles.recordList}>
              {mockLeaveRecords.map(record => (
                <View className={styles.recordCard} key={record.id}>
                  <View className={styles.recordHeader}>
                    <Text className={styles.recordType}>
                      <Text className={styles.typeIcon}>
                        {record.type === 'annual' ? '🏖️' :
                         record.type === 'sick' ? '🏥' :
                         record.type === 'personal' ? '📝' : '📑'}
                      </Text>
                      {record.typeName} · {record.days}天
                    </Text>
                    <View className={classnames(styles.recordStatus, styles[`status${record.status.charAt(0).toUpperCase()}${record.status.slice(1)}`])}>
                      {statusText[record.status]}
                    </View>
                  </View>
                  <View className={styles.recordBody}>
                    <View className={styles.recordRow}>
                      <Text className={styles.recordLabel}>请假时间</Text>
                      <Text className={styles.recordValue}>{record.startDate} 至 {record.endDate}</Text>
                    </View>
                    <View className={styles.recordRow}>
                      <Text className={styles.recordLabel}>请假原因</Text>
                      <Text className={styles.recordValue}>{record.reason}</Text>
                    </View>
                    <View className={styles.recordRow}>
                      <Text className={styles.recordLabel}>申请时间</Text>
                      <Text className={styles.recordValue}>{record.applyDate}</Text>
                    </View>
                    <View className={styles.recordRow}>
                      <Text className={styles.recordLabel}>审批人</Text>
                      <Text className={styles.recordValue}>{record.approver}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'record' && (
            <View className={styles.recordList}>
              {mockAttendanceRecords.map(record => (
                <View className={styles.recordCard} key={record.id}>
                  <View className={styles.recordHeader}>
                    <Text className={styles.recordType}>
                      <Text className={styles.typeIcon}>
                        {record.type === 'checkin' ? '🏢' :
                         record.type === 'checkout' ? '🚪' :
                         record.type === '外出' ? '📍' : '🌙'}
                      </Text>
                      {record.date} · {record.type === 'checkin' ? '上班打卡' : record.type === 'checkout' ? '下班打卡' : record.type}
                    </Text>
                    <View className={classnames(styles.recordStatus, styles[`status${record.status.charAt(0).toUpperCase()}${record.status.slice(1)}`])}>
                      {statusText[record.status]}
                    </View>
                  </View>
                  <View className={styles.recordBody}>
                    <View className={styles.recordRow}>
                      <Text className={styles.recordLabel}>打卡时间</Text>
                      <Text className={styles.recordValue}>{record.time}</Text>
                    </View>
                    <View className={styles.recordRow}>
                      <Text className={styles.recordLabel}>打卡地点</Text>
                      <Text className={styles.recordValue}>{record.location}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      <View className={styles.fabButton} onClick={handleApplyLeave}>+</View>
    </ScrollView>
  )
}

export default AttendancePage
