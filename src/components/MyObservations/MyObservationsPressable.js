// @flow

import { useNavigation } from "@react-navigation/native";
import type { Node } from "react";
import React from "react";
import { Pressable } from "react-native";
import useTranslation from "sharedHooks/useTranslation";

type Props = {
  observation: Object,
  children: any
}

const MyObservationsPressable = ( { observation, children }: Props ): Node => {
  const navigation = useNavigation( );
  const { t } = useTranslation( );
  const unsynced = !observation.wasSynced( );

  const navigateToObservation = ( ) => {
    const { uuid } = observation;
    if ( unsynced ) {
      navigation.navigate( "ObsEdit", { uuid } );
    } else {
      navigation.navigate( "ObsDetails", { uuid } );
    }
  };

  return (
    <Pressable
      onPress={navigateToObservation}
      accessibilityRole="link"
      accessibilityHint={unsynced
        ? t( "Navigate-to-observation-edit-screen" )
        : t( "Navigate-to-observation-details" )}
      accessibilityLabel={t( "Observation-Name", {
        // TODO: use the name that the user prefers (common or scientific)
        scientificName: observation.species_guess
      } )}
    >
      {children}
    </Pressable>
  );
};

export default MyObservationsPressable;
