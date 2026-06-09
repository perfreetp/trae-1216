export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/profile/index',
    'pages/attendance/index',
    'pages/training/index',
    'pages/message/index',
    'pages/certificate/index',
    'pages/performance/index',
    'pages/contacts/index',
    'pages/feedback/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#165DFF',
    navigationBarTitleText: '员工自助',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F5F7FA'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#165DFF',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/attendance/index',
        text: '考勤'
      },
      {
        pagePath: 'pages/training/index',
        text: '培训'
      },
      {
        pagePath: 'pages/message/index',
        text: '消息'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的'
      }
    ]
  }
})
