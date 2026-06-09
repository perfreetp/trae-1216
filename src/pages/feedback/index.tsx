import React, { useState } from 'react'
import { View, Text, ScrollView, Input, Textarea, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import classnames from 'classnames'
import { mockFeedbackRecords } from '@/data/mockPerformance'
import type { FeedbackRecord } from '@/types'

const CATEGORIES = [
  { key: '薪资福利', icon: '💰', label: '薪资福利' },
  { key: '考勤请假', icon: '📅', label: '考勤请假' },
  { key: '培训发展', icon: '🎓', label: '培训发展' },
  { key: '绩效管理', icon: '📊', label: '绩效管理' },
  { key: '系统问题', icon: '💻', label: '系统问题' },
  { key: '其他建议', icon: '💡', label: '其他建议' }
]

const MAX_CONTENT = 500
const MAX_IMGS = 6

const FeedbackPage: React.FC = () => {
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [contactPhone, setContactPhone] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [records, setRecords] = useState<FeedbackRecord[]>(mockFeedbackRecords)

  const handleUploadImg = () => {
    if (images.length >= MAX_IMGS) {
      Taro.showToast({ title: `最多上传${MAX_IMGS}张`, icon: 'none' })
      return
    }
    Taro.chooseImage({
      count: MAX_IMGS - images.length,
      success: (res) => {
        const newImgs = res.tempFilePaths.slice(0, MAX_IMGS - images.length)
        setImages([...images, ...newImgs])
      },
      fail: (err) => {
        console.error('[Feedback] chooseImage error:', err)
      }
    })
  }

  const handleRemoveImg = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx))
  }

  const handleSubmit = () => {
    if (!category) {
      Taro.showToast({ title: '请选择问题类型', icon: 'none' })
      return
    }
    if (!content.trim()) {
      Taro.showToast({ title: '请输入问题描述', icon: 'none' })
      return
    }
    if (content.length < 10) {
      Taro.showToast({ title: '问题描述至少10个字', icon: 'none' })
      return
    }
    console.log('[Feedback] submit:', { category, content, images, contactPhone, contactEmail })

    const newRecord: FeedbackRecord = {
      id: `FB${Date.now()}`,
      category,
      content: content.trim(),
      images: [...images],
      createDate: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
      status: 'submitted'
    }
    setRecords([newRecord, ...records])
    setCategory('')
    setContent('')
    setImages([])
    setContactPhone('')
    setContactEmail('')
    Taro.showToast({ title: '提交成功', icon: 'success' })
  }

  const statusMap: Record<string, { text: string; cls: string }> = {
    submitted: { text: '已提交', cls: styles.statusSubmitted },
    processing: { text: '处理中', cls: styles.statusProcessing },
    replied: { text: '已回复', cls: styles.statusReplied },
    closed: { text: '已关闭', cls: styles.statusClosed }
  }

  return (
    <ScrollView scrollY style={{ height: '100vh' }}>
      <View className={styles.container}>
        <View className={styles.formCard}>
          <View className={styles.formGroup}>
            <Text className={styles.label}>
              问题类型
              <Text className={styles.required}>*</Text>
            </Text>
            <View className={styles.categoryGrid}>
              {CATEGORIES.map(cat => (
                <View
                  className={classnames(styles.categoryItem, category === cat.key && styles.categoryActive)}
                  key={cat.key}
                  onClick={() => setCategory(cat.key)}
                >
                  <Text className={styles.categoryIcon}>{cat.icon}</Text>
                  {cat.label}
                </View>
              ))}
            </View>
          </View>

          <View className={styles.formGroup}>
            <Text className={styles.label}>
              问题描述
              <Text className={styles.required}>*</Text>
            </Text>
            <View className={styles.textareaWrap}>
              <Textarea
                className={styles.textarea}
                placeholder='请详细描述您遇到的问题或建议（至少10个字）...'
                placeholderStyle='color: #86909C'
                value={content}
                maxlength={MAX_CONTENT}
                onInput={(e) => setContent(e.detail.value)}
              />
            </View>
            <View className={styles.counter}>{content.length}/{MAX_CONTENT}</View>
          </View>

          <View className={styles.formGroup}>
            <Text className={styles.label}>上传图片（可选，最多{MAX_IMGS}张）</Text>
            <View className={styles.imgUploadList}>
              {images.map((img, idx) => (
                <View className={styles.imgItem} key={idx}>
                  <Image className={styles.uploadImg} src={img} mode='aspectFill' />
                  <View className={styles.removeBtn} onClick={() => handleRemoveImg(idx)}>×</View>
                </View>
              ))}
              {images.length < MAX_IMGS && (
                <View
                  className={classnames(styles.imgItem, styles.addBtn)}
                  onClick={handleUploadImg}
                >
                  +
                </View>
              )}
            </View>
          </View>

          <View className={styles.formGroup}>
            <Text className={styles.label}>联系方式（选填，便于我们联系您）</Text>
            <View className={styles.contactRow}>
              <View className={styles.contactItem}>
                <Text className={styles.contactLabel}>📱 手机号</Text>
                <Input
                  className={styles.contactInput}
                  type='number'
                  placeholder='请输入手机号'
                  placeholderStyle='color: #86909C'
                  value={contactPhone}
                  onInput={(e) => setContactPhone(e.detail.value)}
                />
              </View>
              <View className={styles.contactItem}>
                <Text className={styles.contactLabel}>📧 邮箱</Text>
                <Input
                  className={styles.contactInput}
                  type='text'
                  placeholder='请输入邮箱'
                  placeholderStyle='color: #86909C'
                  value={contactEmail}
                  onInput={(e) => setContactEmail(e.detail.value)}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={{ marginBottom: '32rpx' }}>
          <View className={styles.submitBtn} onClick={handleSubmit}>
            📤 提交反馈
          </View>
        </View>

        <View className={styles.historySection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>
              📝 历史反馈
              <View className={styles.countBadge}>{records.length}</View>
            </Text>
          </View>
          <View className={styles.historyList}>
            {records.map(rec => {
              const statusInfo = statusMap[rec.status]
              const cat = CATEGORIES.find(c => c.key === rec.category)
              return (
                <View className={styles.historyCard} key={rec.id}>
                  <View className={styles.historyHeader}>
                    <View className={styles.historyCat}>
                      <View className={styles.catBadge}>
                        {cat ? `${cat.icon} ${cat.label}` : rec.category}
                      </View>
                    </View>
                    <View className={classnames(styles.statusBadge, statusInfo.cls)}>
                      {statusInfo.text}
                    </View>
                  </View>
                  <Text className={styles.historyDate}>提交时间：{rec.createDate}</Text>
                  <Text className={styles.historyContent}>{rec.content}</Text>
                  {rec.images && rec.images.length > 0 && (
                    <View className={styles.historyImgs}>
                      {rec.images.map((img, i) => (
                        <Image key={i} className={styles.historyImg} src={img} mode='aspectFill' />
                      ))}
                    </View>
                  )}
                  {rec.reply && (
                    <View className={styles.replyBox}>
                      <Text className={styles.replyLabel}>💬 HR回复</Text>
                      <Text className={styles.replyContent}>{rec.reply}</Text>
                      <Text className={styles.replyDate}>{rec.replyDate}</Text>
                    </View>
                  )}
                </View>
              )
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default FeedbackPage