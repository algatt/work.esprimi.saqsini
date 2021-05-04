export default function convertBinaryDataToImage(imageData, imageType) {
  return new Promise((resolve, reject) => {
    try {
      const blob = new Blob([imageData], {
        type: imageType,
      })
      let image = {}
      const reader = new FileReader()

      reader.readAsDataURL(blob)
      reader.onloadend = function () {
        image = reader.result
        resolve(image)
      }
    } catch (error) {
      reject(error)
    }
  })
}
