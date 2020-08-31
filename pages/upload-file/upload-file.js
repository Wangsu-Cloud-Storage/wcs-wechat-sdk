
Page({
  onShareAppMessage() {
    return {
      title: '上传文件',
      path: 'pages/upload-file/upload-file'
    }
  },

  chooseImage() {
    const self = this
    // wcs 文件上传
    const wscUploadUrl = "https://xxx.wcsapi.com/file/upload";
     
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success(res) {
        console.log('chooseImage success, temp path is', res.tempFilePaths[0])
        const imageSrc = res.tempFilePaths[0];

        wx.uploadFile({
          url:wscUploadUrl,
          filePath: imageSrc, // 小程序临时文件路径
          name: 'file',
          formData: {
            'token':'wcs-token' // 调用后台接口获取token
          },
          success: res => {
            console.log('uploadImage res is:', res)

            if(res.statusCode != 200){
              console.log('uploadImage fail, message is:', res.data)
              wx.showToast({
                title: '上传失败',
                icon: 'fail',
                duration: 1000
              })
              return;
            }

            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 1000
            })

            self.setData({
              imageSrc,
              fileID: res.fileID,
            })
          },
          fail({errMsg}) {
            console.log('uploadImage fail, errMsg is', errMsg)
          }
        })
      },

      fail: res => {
        wx.showToast({
          icon: 'none',
          title: '上传失败',
        })
        console.log('uploadImage fail, errMsg is', res.errMsg)
      }
    })
  },
  onUnload() {
    if(this.data.fileID) {
      wx.cloud.deleteFile({
        fileList: [this.data.fileID]
      })
    }
  }
})
