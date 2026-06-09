import React, { useState } from 'react'
import { View, Text, Image, ScrollView, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import classnames from 'classnames'
import { mockDepartments, mockUserInfo } from '@/data/mockUser'
import type { Department, ContactPerson } from '@/types'

const ContactsPage: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set(['D001', 'D001-1']))
  const [activeTab, setActiveTab] = useState('all')

  const toggleDept = (id: string) => {
    const next = new Set(expandedDepts)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setExpandedDepts(next)
  }

  const handleCall = (person: ContactPerson) => {
    console.log('[Contacts] call:', person.id)
    Taro.showModal({
      title: `拨打电话`,
      content: `确定要拨打 ${person.name} 的电话吗？\n${person.phone}`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: `正在呼叫 ${person.name}`, icon: 'none' })
        }
      }
    })
  }

  const handleMsg = (person: ContactPerson) => {
    console.log('[Contacts] msg:', person.id)
    Taro.showToast({ title: `打开与 ${person.name} 的对话`, icon: 'none' })
  }

  const handleMail = (person: ContactPerson) => {
    console.log('[Contacts] mail:', person.id)
    Taro.showToast({ title: `发送邮件至 ${person.email}`, icon: 'none' })
  }

  const renderMember = (person: ContactPerson) => {
    if (searchKeyword) {
      const kw = searchKeyword.toLowerCase()
      if (!person.name.toLowerCase().includes(kw) &&
          !person.position.toLowerCase().includes(kw) &&
          !person.department.toLowerCase().includes(kw)) {
        return null
      }
    }
    return (
      <View className={styles.memberItem} key={person.id}>
        <Image className={styles.avatar} src={person.avatar} mode='aspectFill' />
        <View className={styles.memberInfo}>
          <Text className={styles.memberName}>{person.name}</Text>
          <Text className={styles.memberPosition}>{person.position} · {person.department}</Text>
        </View>
        <View className={styles.actionBtns}>
          <View className={classnames(styles.actionBtn, styles.btnCall)} onClick={() => handleCall(person)}>
            📞
          </View>
          <View className={classnames(styles.actionBtn, styles.btnMsg)} onClick={() => handleMsg(person)}>
            💬
          </View>
          <View className={classnames(styles.actionBtn, styles.btnMail)} onClick={() => handleMail(person)}>
            📧
          </View>
        </View>
      </View>
    )
  }

  const renderDept = (dept: Department, level: number = 0) => {
    const isExpanded = expandedDepts.has(dept.id)
    const deptIcons = ['🏢', '💻', '👥', '💰', '📊', '🛒']

    return (
      <View className={styles.deptCard} key={dept.id} style={{ marginLeft: level * 16 }}>
        <View className={styles.deptHeader} onClick={() => toggleDept(dept.id)}>
          <View className={styles.deptInfo}>
            <View className={styles.deptIcon}>{deptIcons[level % deptIcons.length]}</View>
            <Text className={styles.deptName}>{dept.name}</Text>
          </View>
          <Text className={styles.deptCount}>{dept.memberCount}人</Text>
          <Text className={classnames(styles.expandIcon, isExpanded && styles.expanded)}>›</Text>
        </View>

        {isExpanded && dept.children && dept.children.length > 0 && (
          <View className={styles.subDeptList}>
            {dept.children.map(child => (
              <View
                className={styles.subDeptItem}
                key={child.id}
                onClick={() => toggleDept(child.id)}
              >
                <Text className={styles.subDeptName}>📁 {child.name}</Text>
                <View style={{ display: 'flex', alignItems: 'center', gap: '12rpx' }}>
                  <Text className={styles.subDeptCount}>{child.memberCount}人</Text>
                  <Text
                    className={classnames(styles.expandIcon, expandedDepts.has(child.id) && styles.expanded)}
                  >›</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {isExpanded && dept.children && dept.children.length > 0 && dept.children.map(child =>
          expandedDepts.has(child.id) ? (
            <View key={child.id + '-wrapper'} style={{ paddingLeft: '32rpx', paddingRight: '32rpx' }}>
              {child.members.length > 0 && (
                <View className={styles.memberList}>
                  {child.members.map(person => renderMember(person))}
                </View>
              )}
            </View>
          ) : null
        )}

        {isExpanded && !dept.children && dept.members.length > 0 && (
          <View className={styles.memberList}>
            {dept.members.map(person => renderMember(person))}
          </View>
        )}
      </View>
    )
  }

  return (
    <ScrollView scrollY style={{ height: '100vh' }}>
      <View className={styles.container}>
        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder='搜索姓名、职位、部门...'
            placeholderStyle='color: #86909C'
            value={searchKeyword}
            onInput={(e) => setSearchKeyword(e.detail.value)}
          />
        </View>

        <View className={styles.tabs}>
          {[
            { key: 'all', label: '全部组织' },
            { key: 'dept', label: '我的部门' },
            { key: 'me', label: '我本人' },
            { key: 'star', label: '常用联系人' }
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

        {activeTab === 'me' && (
          <View style={{ background: '#fff', borderRadius: '16rpx', padding: '32rpx', boxShadow: '0 2rpx 12rpx rgba(0,0,0,0.08)', marginBottom: '24rpx' }}>
            {renderMember({ ...mockUserInfo, position: mockUserInfo.position, department: mockUserInfo.department, avatar: mockUserInfo.avatar } as ContactPerson)}
          </View>
        )}

        <View className={styles.departmentList}>
          {mockDepartments.map(dept => renderDept(dept))}
        </View>
      </View>
    </ScrollView>
  )
}

export default ContactsPage
