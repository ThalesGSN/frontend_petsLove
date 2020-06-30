import React, { useCallback, useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import c from 'classnames'
import { observer } from 'mobx-react'
import { useTranslation } from 'react-i18next'
import InputUploadImageStore from 'stores/InputUploadImageStore'
import { MdCancel, MdUpdate } from 'react-icons/md'
import { SERVER } from 'services/config'
import noImage from 'components/commons/GaleryImages/noImage.svg'
import styles from './inputUploadImage.scss'

const InputUploadImage = ({ oldImage, isEdit, inputUploadImageStore }) => {
  const [isImageNotFound, setIsImageNotFound] = useState(true)
  const { t } = useTranslation('createPet')
  const fileUpload = useRef()

  const onError = useCallback(() => {
    setIsImageNotFound(false)
  }, [])

  const handleChangeImage = useCallback(e => {
    inputUploadImageStore.setImage(e.target.files)

    const fileList = Array.from(e.target.files)

    const mappedFiles = fileList.map(file => ({
      ...file,
      preview: URL.createObjectURL(file),
      imageName: file,
    }))

    inputUploadImageStore.setNewsPreviewsImage(mappedFiles)
  })

  const removePreviewImage = useCallback(image => {
    inputUploadImageStore.removePreviosImage(image)
  }, [])

  const removeNewPreviewImage = useCallback(image => {
    inputUploadImageStore.removeNewPreviewsImage(image)
  }, [])

  const onClickFileUpload = useCallback(() => {
    fileUpload.current.click()
  }, [])

  useEffect(() => {
    if (oldImage.length > 0 && inputUploadImageStore.previewImage.length === 0) {
      inputUploadImageStore.setPreviewsImage(oldImage)
    }
  }, [oldImage])

  return (
    <div>
      <div className={styles.containerImagePreview}>
        {inputUploadImageStore.previewImage &&
          inputUploadImageStore.previewImage.map(image => {
            return (
              <div key={image.preview} className={styles.containerImage}>
                <img
                  alt="pets"
                  onError={onError}
                  className={styles.imagePreview}
                  src={image && isImageNotFound ? `${SERVER}/${image}` : noImage}
                />
                <div className={styles.middle}>
                  <div onClick={() => removePreviewImage(image)} className={styles.containerIcon}>
                    <MdCancel className={styles.iconImage} size={20} />
                  </div>
                </div>
              </div>
            )
          })}
        {inputUploadImageStore.newPreviewsImage &&
          inputUploadImageStore.newPreviewsImage.map(image => {
            return (
              <div key={image.preview} className={styles.containerImage}>
                <img className={styles.imagePreview} src={image.preview} alt="pets" />
                <div className={styles.middle}>
                  <div
                    onClick={() => removeNewPreviewImage(image)}
                    className={styles.containerIcon}
                  >
                    <MdCancel className={styles.iconImage} size={20} />
                  </div>
                </div>
              </div>
            )
          })}
      </div>
      {isEdit && (
        <div className={styles.colInputImage}>
          <input
            multiple
            type="file"
            ref={fileUpload}
            className={styles.inputFile}
            onChange={handleChangeImage}
            placeholder={t('placeholderImages')}
          />
          <label onClick={onClickFileUpload} className={c(styles.textInput, styles.btnTertiary)}>
            <MdUpdate className={styles.icon} size={15} />
            <span>{t('addFile')}</span>
          </label>
        </div>
      )}
    </div>
  )
}

InputUploadImage.propTypes = {
  isEdit: PropTypes.bool,
  oldImage: PropTypes.arrayOf([String]),
  inputUploadImageStore: PropTypes.instanceOf(InputUploadImageStore),
}

InputUploadImage.defaultProps = {
  oldImage: [],
  isEdit: false,
}

export default observer(InputUploadImage)
