// @flow

import { useNavigation } from "@react-navigation/native";
import {
  Button, StickyToolbar
} from "components/SharedComponents";
import { ObsEditContext } from "providers/contexts";
import type { Node } from "react";
import React, {
  useContext
} from "react";
import useTranslation from "sharedHooks/useTranslation";

type Props = {
  keysToUpdate: Object,
  goBackOnSave: boolean
};

const Footer = ( { keysToUpdate, goBackOnSave }: Props ): Node => {
  const navigation = useNavigation( );
  const { t } = useTranslation( );
  const {
    updateObservationKeys
  } = useContext( ObsEditContext );

  return (
    <StickyToolbar>
      <Button
        className="px-[25px]"
        onPress={( ) => {
          updateObservationKeys( keysToUpdate );
          if ( goBackOnSave ) {
            navigation.goBack( );
          }
        }}
        testID="LocationPicker.saveButton"
        text={t( "SAVE-LOCATION" )}
        level="neutral"
      />
    </StickyToolbar>
  );
};

export default Footer;
