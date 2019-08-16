/**
 * 常用工具类
 * @date        2019-05-14
 * @author cnvp
 * @anotherdate 2019-05-14T11:40:17+0800
 * @param       {object}                 win windows对象
 * @param       {object}                 doc 文档对象
 */
(function(win, doc) {
  // 格式化时间
  var obj = function() {}
  obj.prototype = {
    // 时间格式化
    formatTime(time, param) {
      const date = new Date(time)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      const minute = date.getMinutes()
      const second = date.getSeconds()
      if (param === 'y-m-d') {
        return [year, month, day].map(this.addZero).join('-')
      }
      return [year, month, day].map(this.addZero).join('/') + ' ' + [hour, minute, second].map(this.addZero).join(':')
    },
    // 数组循环
    map: function(arr, fn) {
      let res = []
      for (var i = 0; i < arr.length; ++i) {
        res.push(fn(arr[i], i))
      }
      return res
    },
    // 正则表达式
    regx: function(str, type) {
      if (type === 'phone') { // 电话
        return /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/.test(str)
      }
    },
    /**
     * 判断是否在数组中
     * @date        2019-06-20
     * @author cnvp
     * @anotherdate 2019-06-20T16:32:32+0800
     * @param       {array}                 arr   [数组]
     * @param       {string}                 value [判断条件]
     * @param       {string}                 attr  [数组中的某个属性]
     * @returns      {object}                       [isInArray=true，value在数组中,位置为index]
     */
    inArray: function(arr, value, attr) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i][attr] === value) {
          return {
            isInArray: true,
            index: i
          }
        }
      }
      return {
        isInArray: false
      }
    },
    // 去掉两边空格
    trim: function(str) {
      return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
    },
    formatOjbect: function(obj) {
      var str = []
      for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
          str.push(encodeURIComponent(p) + '=' + obj[p])
        }
      }
      return str.join('&')
    },
    // 时间转化为今天时间点
    formatTimeToday: function(dateVal) {
      var oDate = new Date()
      var msgDate = new Date(dateVal)

      function tow(n) {
        return n >= 0 && n < 10 ? '0' + n : '' + n
      }
      var iday = new Date(oDate.getFullYear() + '/' + tow(oDate.getMonth() + 1) +
          '/' + tow(oDate.getDate())).getTime() - new Date(msgDate.getFullYear() +
          '/' + tow(msgDate.getMonth() + 1) + '/' + tow(msgDate.getDate()))
        .getTime()
      iday = iday / 1000 / 60 / 60 / 24

      if (iday < 1) {
        return '今天 ' + msgDate.getHours() + ':' + msgDate.getMinutes()
      }
      if (iday < 2) {
        return '昨天 ' + msgDate.getHours() + ':' + msgDate.getMinutes()
      }
      var res = msgDate.getFullYear() + '/' + tow(msgDate.getMonth() + 1) + '/' + tow(msgDate.getDate()) +
        ' ' + tow(msgDate.getHours()) + ':' + tow(msgDate.getMinutes())
      return res
    },
    // 前面补0
    addZero: function(number) {
      if (number < 10) {
        return '0' + number
      }
      return number
    },
    // 随机名
    random_string: function(len) {
      len = len || 32
      var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
      var maxPos = chars.length
      var pwd = ''
      for (var i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos))
      }
      return pwd
    },
    // 根据路径判断文件类型
    formatFileType: function(url) {
      console.log(url)
      var imgExt = new Array('.png', '.jpg', '.jpeg', '.bmp', '.gif') // 图片文件的后缀名
      var docExt = new Array('.doc', '.docx') // word文件的后缀名
      var xlsExt = new Array('.xls', '.xlsx') // excel文件的后缀名
      var pptExt = new Array('.ppt') // ppt文件的后缀名
      var videoExt = new Array('.mp4', '.rmvb', '.flv') // 视频文件的后缀名
      var audioExt = new Array('.mp3') // 音频文件的后缀名
      var ext = this.extension(url)
      if (this.contain(imgExt, ext)) {
        return 1 // 图片
      } else if (this.contain(docExt, ext)) {
        return 2 // 文档
      } else if (this.contain(xlsExt, ext)) {
        return 3 // 表格
      } else if (this.contain(pptExt, ext)) {
        return 4 // ppt
      } else if (this.contain(videoExt, ext)) {
        return 5 // 视频
      } else if (this.contain(audioExt, ext)) {
        return 6 // 音频
      } else {
        return 0 // 未知
      }
    },
    // 获取文件名后缀名
    extension: function(url) {
      var ext = null
      var name = url.toString().toLowerCase()
      var i = name.lastIndexOf('.')
      if (i > -1) {
        ext = name.substring(i)
      }
      return ext
    },
    // 判断Array中是否包含某个值
    contain: function(arr, value) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === value)
          return true
      }
      return false
    },
    // 判断是否为某个类型
    typeMatch: function(type, filename) {
      var ext = filename.extension()
      if (this.contain(type, ext)) {
        return true
      }
      return false
    },
    // 日期格式化
    formatDate: function(date) {
      date = new Date(date)
      var month = date.getMonth() + 1 // 获取当前月份
      var da = date.getDate() // 获取当前日
      var day = date.getDay() // 获取当前星期几
      if (da < 10) {
        da = '0' + da
      }
      if (month < 10) {
        month = '0' + month
      }
      if (day === 1) {
        var week = '周一'
      } else if (day === 2) {
        week = '周二'
      } else if (day === 3) {
        week = '周三'
      } else if (day === 4) {
        week = '周四'
      } else if (day === 5) {
        week = '周五'
      } else if (day === 6) {
        week = '周六'
      } else if (day === 7) {
        week = '周日'
      }
      var timer = month + '-' + da + ' ' + week
      return timer
    },
    // 去除毫秒
    deleteMin: function(time) {
      return time.substring(0, time.length - 3)
    }
  }
  win['cnvp'] = new obj()
})(window, document)
