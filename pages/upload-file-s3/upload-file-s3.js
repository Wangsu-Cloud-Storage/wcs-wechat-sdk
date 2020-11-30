
Page({
  onShareAppMessage() {
    return {
      title: '上传文件-s3',
      path: 'pages/upload-file-s3/upload-file-s3'
    }
  },

  chooseImage() {
    const self = this
    
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success(res) {
        console.log('chooseImage success, temp path is', res.tempFilePaths[0])
        const imageSrc = res.tempFilePaths[0];
        wx.request({
          url: 'http://127.0.0.1:8888/upload/getS3UploadParams', // 获取上传参数
          method: 'POST',
          data: {
            fileName: imageSrc
          },
          header: {
            'content-type': 'application/json'
          },
          success (res) {
            console.log(res.data);
            let fileUrl = res.data.s3UploadUrl + '/' + res.data.key;
            wx.uploadFile({
              url:res.data.s3UploadUrl,
              filePath: imageSrc, // 小程序临时文件路径
              name: 'file',
              formData: {
                'key':res.data.key,
                'policy':res.data.policy,
                'AWSAccessKeyId':res.data.awsaccessKeyId,
                'signature':res.data.signature,
                'acl':res.data.acl
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
                  fileID: fileUrl,
                })
              },
              fail({errMsg}) {
                console.log('uploadImage fail, errMsg is', errMsg)
              }
            })
          },
          fail({errMsg}) {
            console.log('getS3UploadParams fail, errMsg is', errMsg)
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
