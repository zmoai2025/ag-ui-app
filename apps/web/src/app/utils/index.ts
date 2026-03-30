export const selectLocalFile = (option?: {
  accept?: string | undefined
  multiple?: boolean | undefined
}) =>
  new Promise<FileList>((resolve, reject) => {
    const inputEl = document.createElement('input')
    inputEl.type = 'file'
    inputEl.accept = option?.accept ?? 'image/*'
    inputEl.multiple = option?.multiple ?? false

    inputEl.addEventListener('change', ev => {
      const { files } = ev.target as HTMLInputElement

      if (files && files.length) {
        resolve(files)
      } else {
        reject('no file selected')
      }

      inputEl.remove()
    })

    inputEl.addEventListener('cancel', ev => {
      reject('select cancelled by user')
      inputEl.remove()
    })

    inputEl.click()
  })
