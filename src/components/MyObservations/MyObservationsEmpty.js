// @flow

import { useNavigation } from "@react-navigation/native";
import AddObsModal from "components/AddObsModal";
import {
  Body1, Body2, Button
} from "components/SharedComponents";
import Modal from "components/SharedComponents/Modal";
import { View } from "components/styledComponents";
import type { Node } from "react";
import React, { useState } from "react";
import useTranslation from "sharedHooks/useTranslation";

type Props = {
  isLoading: ?boolean
}

const MyObservationsEmpty = ( { isLoading }: Props ): Node => {
  const { t } = useTranslation( );
  const navigation = useNavigation( );
  const [showModal, setShowModal] = useState( false );

  if ( !isLoading ) {
    return (
      <>
        <Modal
          showModal={showModal}
          closeModal={( ) => setShowModal( false )}
          modal={<AddObsModal closeModal={( ) => setShowModal( false )} />}
        />
        <View className="mx-5">
          <Body1 className="mb-3 mt-10">
            {t( "Welcome-to-iNaturalist" )}
          </Body1>
          <Body2 className="mb-5">
            {t( "iNaturalist-is-a-community-of-naturalists" )}
          </Body2>
          <Body2 className="mb-5">
            {t( "Observations-created-on-iNaturalist" )}
          </Body2>
          <Button
            className="mb-2"
            text={t( "CREATE-YOUR-FIRST-OBSERVATION" )}
            level="focus"
            onPress={( ) => setShowModal( true )}
            accessibilityLabel={t( "Observe" )}
            accessibilityHint={t( "Opens-add-observation-modal" )}
          />
          <Body2 className="my-5">
            {t( "You-can-also-explore-existing-observations" )}
          </Body2>
          <Button
            className="mb-2"
            text={t( "EXPLORE-OBSERVATIONS" )}
            level="focus"
            onPress={( ) => navigation.navigate( "Explore" )}
            accessibilityLabel={t( "Explore" )}
            accessibilityHint={t( "Navigates-to-explore" )}
          />
        </View>
      </>
    );
  }
  return null;
};

export default MyObservationsEmpty;
