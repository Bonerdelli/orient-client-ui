export const downloadBinaryFile = (data: Blob, fileName?: string) => {
  const url = window.URL.createObjectURL(data)
  const a = document.createElement('a')
  document.body.appendChild(a)
  a.style.display = 'none'
  a.href = url
  if (fileName) {
    a.download = fileName
  }
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}
