import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import c from 'classnames'
import { GoogleApiWrapper } from 'google-maps-react'
import { observer } from 'mobx-react'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import Label from 'components/commons/Label'
import ViewValue from 'components/commons/ViewValue'
import styles from './googleAutocomplete.scss'

const GoogleAutocomplete = observer(
  ({
    name,
    value,
    isEdit,
    label,
    placeholder,
    inputStoreError,
    handleChangeAddress,
    handleChangeTextAddress,
    handleChangeAddressComponents,
  }) => {
    const { t } = useTranslation()
    const [address, setAddress] = useState('')
    // eslint-disable-next-line no-shadow
    const handleChange = useCallback(address => {
      setAddress(address)
    }, [])

    const configAddress = async addressSelected => {
      if (handleChangeTextAddress) {
        handleChangeTextAddress(addressSelected)
      }
      const results = await geocodeByAddress(addressSelected)
      const latLng = await getLatLng(results[0])

      if (handleChangeAddress) {
        handleChangeAddress(latLng)
      }
      if (handleChangeAddressComponents) {
        handleChangeAddressComponents(results[0])
      }
    }

    return (
      <>
        <PlacesAutocomplete value={address} onChange={handleChange} onSelect={configAddress}>
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
            return (
              <div>
                {isEdit === false ? (
                  <ViewValue placeholder={placeholder} value={value} />
                ) : (
                  <>
                    {label && <Label text={label} />}
                    <input
                      name={name}
                      className={c(
                        styles.input,
                        inputStoreError ? inputStoreError.error && styles.isError : ''
                      )}
                      {...getInputProps({
                        placeholder,
                      })}
                    />
                  </>
                )}
                <div className={styles.dropdown}>
                  {loading && <div className={styles.text}>{t('common:loading')}</div>}
                  {suggestions.map(suggestion => {
                    const className = suggestion.active
                      ? 'suggestion-item--active'
                      : 'suggestion-item'
                    // inline style for demonstration purpose
                    const style = suggestion.active
                      ? {
                          backgroundColor: 'rgba(146, 154, 230, 0.30)',
                          cursor: 'pointer',
                          padding: '10px',
                        }
                      : {
                          backgroundColor: 'rgb(255, 255, 255)',
                          cursor: 'pointer',
                          padding: '10px',
                        }
                    return (
                      <div
                        {...getSuggestionItemProps(suggestion, {
                          className,
                          style,
                        })}
                      >
                        <span>{suggestion.description}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          }}
        </PlacesAutocomplete>
        {inputStoreError && (
          <div className={styles.errorMessage}>{inputStoreError.errorMessage}</div>
        )}
      </>
    )
  }
)

GoogleAutocomplete.propTypes = {
  isEdit: PropTypes.bool,
  value: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  handleChangeAddress: PropTypes.func,
  handleChangeTextAddress: PropTypes.func,
  handleChangeAddressComponents: PropTypes.func,
  inputStoreError: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.bool, PropTypes.string])),
}

GoogleAutocomplete.defaultProps = {
  label: '',
  value: '',
  isEdit: false,
  placeholder: '',
  inputStoreError: null,
  handleChangeAddress: null,
  handleChangeTextAddress: null,
  handleChangeAddressComponents: null,
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCG4to6zaiKQpUhXTPRnYWXcoJ8RxU5nps',
})(GoogleAutocomplete)
