import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Input, Textarea } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import styles from './index.module.scss'
import SectionHeader from '@/components/SectionHeader'
import classnames from 'classnames'
import { mockSchedule, mockLeaveRecords, mockOvertimeBalance, mockAttendanceRecords } from '@/data/mockAttendance'

type TabType = 'schedule' | 'leave' | 'record'
type LeaveTypeKey = 'annual' | 'sick' | 'personal' | 'marriage' | 'maternity' | 'bereavement'

const LEAVE_OPTIONS: { key: LeaveTypeKey; name: string; icon: string; unit: 'annualLeave' | 'sickLeave' | 'compensatoryLeave' | null }[] = [
  { key: 'annual', name: '年假', icon: '🏖️', unit: 'annualLeave' },
  { key: 'sick', name: '病假', icon: '🏥', unit: 'sickLeave' },
  { key: 'personal', name: '事假', icon: '📝', unit: 'compensatoryLeave' },
  { key: 'marriage', name: '婚假', icon: '💒', unit: null },
  { key: 'maternity', name: '产假', icon: '👶', unit: null },
  { key: 'bereavement', name: '丧假', icon: '🕊️', unit: null }
]

const AttendancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('schedule')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [checkInTime, setCheckInTime] = useState<string | null>('08:55')
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null)
  const [leaveRecords, setLeaveRecords] = useState(mockLeaveRecords)
  const [attendanceRecords, setAttendanceRecords] = useState(mockAttendanceRecords)
  const [overtimeBalance, setOvertimeBalance] = useState(mockOvertimeBalance)

  const [leaveModalVisible, setLeaveModalVisible] = useState(false)
  const [leaveForm, setLeaveForm] = useState({ type: 'annual' as LeaveTypeKey, startDate: '', endDate: '', days: 1, reason: '' })
  const [leaveStep, setLeaveStep] = useState<'type' | 'detail'>('type')

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
    Taro.showModal({
      title: '外出打卡',
      content: '确定要提交外出打卡吗？将记录您的当前位置。',
      success: (res) => {
        if (res.confirm) {
          const now = new Date()
          const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`
          const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
          const newRecord = {
            id: `A${Date.now()}`,
            date: dateStr,
            type: '外出' as const,
            time: timeStr,
            location: '外出打卡（已记录GPS位置）',
            status: 'normal' as const
          }
          setAttendanceRecords([newRecord, ...attendanceRecords])
          setActiveTab('record')
          Taro.showToast({ title: `外出打卡成功 ${timeStr}`, icon: 'success' })
        }
      }
    })
  }

  const handleApplyLeave = () => {
    const today = new Date()
    const dateStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
    setLeaveForm({ type: 'annual', startDate: dateStr, endDate: dateStr, days: 1, reason: '' })
    setLeaveStep('type')
    setLeaveModalVisible(true)
  }

  const calcLeaveDays = (start: string, end: string) => {
    if (!start || !end) return 1
    const s = new Date(start).getTime()
    const e = new Date(end).getTime()
    if (e < s) return 1
    return Math.max(1, Math.round((e - s) / 86400000) + 1)
  }

  const handleLeaveTypeSelect = (key: LeaveTypeKey) => {
    setLeaveForm({ ...leaveForm, type: key })
    setLeaveStep('detail')
  }

  const handleSubmitLeave = () => {
    const { type, startDate, endDate, reason } = leaveForm
    if (!startDate || !endDate) { Taro.showToast({ title: '请选择日期', icon: 'none' }); return }
    if (!reason.trim() || reason.length < 5) { Taro.showToast({ title: '请假原因至少5个字', icon: 'none' }); return }
    const days = calcLeaveDays(startDate, endDate)
    const option = LEAVE_OPTIONS.find(o => o.key === type)!
    const today = new Date()
    const applyDate = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
    const newLeave = {
      id: `L${Date.now()}`,
      type,
      typeName: option.name,
      startDate,
      endDate,
      days,
      reason: reason.trim(),
      status: 'pending' as const,
      applyDate,
      approver: '周敏（HR总监）'
    }
    setLeaveRecords([newLeave, ...leaveRecords])
    if (option.unit) {
      setOvertimeBalance({ ...overtimeBalance, [option.unit]: Math.max(0, overtimeBalance[option.unit] - days) })
    }
    setLeaveModalVisible(false)
    setActiveTab('leave')
    Taro.showToast({ title: `${option.name}申请已提交`, icon: 'success' })
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
    { label: '年假剩余', value: overtimeBalance.annualLeave, unit: '天' },
    { label: '调休剩余', value: overtimeBalance.compensatoryLeave, unit: '天' },
    { label: '病假剩余', value: overtimeBalance.sickLeave, unit: '天' },
    { label: '加班累计', value: overtimeBalance.overtimeHours, unit: '小时' }
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
              {leaveRecords.map(record => (
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
              {attendanceRecords.map(record => (
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

      {leaveModalVisible && (
          <View className={styles.modalMask} onClick={() => setLeaveModalVisible(false)}>
            <View className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
              <View className={styles.modalHeader}>
                <Text className={styles.modalTitle}>
                  {leaveStep === 'type' ? '选择请假类型' : '填写请假信息'}
                </Text>
                <Text className={styles.modalClose} onClick={() => setLeaveModalVisible(false)}>×</Text>
              </View>
              <View className={styles.modalBody}>
                {leaveStep === 'type' ? (
                  <View className={styles.leaveTypeGrid}>
                    {LEAVE_OPTIONS.map(opt => (
                      <View
                        className={classnames(styles.leaveTypeItem, leaveForm.type === opt.key && styles.leaveTypeActive)}
                        key={opt.key}
                        onClick={() => handleLeaveTypeSelect(opt.key)}
                      >
                        <Text className={styles.leaveTypeIcon}>{opt.icon}</Text>
                        <Text className={styles.leaveTypeName}>{opt.name}</Text>
                        {opt.unit && (
                          <Text className={styles.leaveTypeBalance}>
                            剩 {overtimeBalance[opt.unit]} 天
                          </Text>
                        )}
                      </View>
                    ))}
                  </View>
                ) : (
                  <>
                    <View className={styles.formItem}>
                      <Text className={styles.formLabel}>🏖️ 请假类型</Text>
                      <View className={styles.formValueRow}>
                        <Text>{LEAVE_OPTIONS.find(o => o.key === leaveForm.type)?.name}</Text>
                        <Text className={styles.formChangeLink} onClick={() => setLeaveStep('type')}>更改</Text>
                      </View>
                    </View>
                    <View className={styles.formItem}>
                      <Text className={styles.formLabel}>📅 开始日期</Text>
                      <Input
                        className={styles.formInput}
                        type='text'
                        placeholder='请输入 如：2024-06-15'
                        placeholderStyle='color:#86909C'
                        value={leaveForm.startDate}
                        onInput={(e) => setLeaveForm({ ...leaveForm, startDate: e.detail.value, days: calcLeaveDays(e.detail.value, leaveForm.endDate) })}
                      />
                    </View>
                    <View className={styles.formItem}>
                      <Text className={styles.formLabel}>📅 结束日期</Text>
                      <Input
                        className={styles.formInput}
                        type='text'
                        placeholder='请输入 如：2024-06-16'
                        placeholderStyle='color:#86909C'
                        value={leaveForm.endDate}
                        onInput={(e) => setLeaveForm({ ...leaveForm, endDate: e.detail.value, days: calcLeaveDays(leaveForm.startDate, e.detail.value) })}
                      />
                    </View>
                    <View className={styles.formItem}>
                      <Text className={styles.formLabel}>⏰ 请假天数</Text>
                      <Text className={styles.formValueBig}>{calcLeaveDays(leaveForm.startDate, leaveForm.endDate)} 天</Text>
                    </View>
                    <View className={styles.formItem}>
                      <Text className={styles.formLabel}>📝 请假原因</Text>
                      <Textarea
                        className={styles.formTextarea}
                        placeholder='请输入请假原因（至少5个字）...'
                        placeholderStyle='color:#86909C'
                        value={leaveForm.reason}
                        maxlength={200}
                        onInput={(e) => setLeaveForm({ ...leaveForm, reason: e.detail.value })}
                      />
                    </View>
                  </>
                )}
              </View>
              <View className={styles.modalFooter}>
                <View className={styles.modalCancel} onClick={() => setLeaveModalVisible(false)}>取消</View>
                {leaveStep === 'detail' && (
                  <View className={styles.modalConfirm} onClick={handleSubmitLeave}>提交申请</View>
                )}
              </View>
            </View>
          </View>
      )}
    </ScrollView>
  )
}

export default AttendancePage
