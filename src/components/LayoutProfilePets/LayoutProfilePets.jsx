import React from 'react'
import { observer } from 'mobx-react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import Title from 'components/commons/Title'
import ButtonsPet from 'containers/ProfilePets/ButtonsPet'
import ImageProfilePet from 'components/ImageProfilePet'
import InformationPet from 'components/InformationPet'
import GoogleMapsLocation from 'components/commons/GoogleMapsLocation'
import PetIdStore from 'stores/PetIdStore'
import TextCard from 'components/commons/TextCard'
import MedicalInformationDog from 'components/MedicalInformationDog'
import MedicalInformationCat from 'components/MedicalInformationCat'
import styles from './layoutProfilePets.scss'

const LayoutProfilePets = ({ store }) => {
  const { t } = useTranslation('profilePets')

  const { getName, getUserCreator } = store.pet

  console.log(store.pet.medicalInformationDog)
  return (
    <>
      <div className={styles.header}>
        <Title title={t('title', { name: getName })} />
        <ButtonsPet
          pet={store.pet}
          // email={userCreator.email}
          // phone={getUserCreatorPhone}
          userCreatorExist={getUserCreator}
        />
      </div>
      <div className={styles.colums}>
        <ImageProfilePet images={store.pet.images} />
        <GoogleMapsLocation
          isProfilePet
          location={store.pet.foundLocation.value}
          petLocation={store.pet.textAddress.value}
        />
      </div>
      <div className={styles.colums}>
        <InformationPet title={t('common:basicInformation')} pet={store.pet} />
        {store.pet.getCategory === 'dog' && (
          <MedicalInformationDog title={t('common:medicalInformation')} pet={store.pet} />
        )}
          {store.pet.category.value === 'cat' && (
            <MedicalInformationCat title={t('common:medicalInformation')} pet={store.pet} />
          )}
        {/*</div>*/}
        {/*<div className={styles.colums}>*/}
        {/*  <div>*/}
        {/*    <TextCard title={t('history')} text={store.pet.history.value} />*/}
        {/*  </div>*/}
        {/*  <div>*/}
        {/*    <TextCard title={t('Notes')} text={store.pet.notes.value} />*/}
        {/*  </div>*/}
      </div>
    </>
  )
}

LayoutProfilePets.propTypes = {
  store: PropTypes.instanceOf(PetIdStore).isRequired,
}

export default observer(LayoutProfilePets)
