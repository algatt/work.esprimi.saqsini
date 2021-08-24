export function convertBinaryDataToImage(imageData, imageType) {
  return new Promise((resolve, reject) => {
    try {
      const blob = new Blob([imageData], {
        type: imageType,
      })
      let image = {}
      const reader = new FileReader()

      reader.readAsDataURL(blob)
      reader.onloadend = function (e) {
        image = reader.result
        resolve(image)
      }
    } catch (error) {
      reject(error)
    }
  })
}

export function resizeImage(image, MAX_WIDTH = 640, MAX_HEIGHT = 640) {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader()

      reader.readAsDataURL(image)

      reader.onloadend = async (e) => {
        const img = new Image()
        img.src = e.target.result

        const canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        await ctx.drawImage(img, 0, 0)

        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height
          height = MAX_HEIGHT
        }

        canvas.width = width
        canvas.height = height
        ctx = canvas.getContext('2d')
        await ctx.drawImage(img, 0, 0, width, height)

        resolve(canvas.toDataURL(image.type))
      }
    } catch (error) {
      reject(error)
    }
  })
}
