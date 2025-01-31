// @flow

import { useNavigation, useRoute } from "@react-navigation/native";
import classnames from "classnames";
import { Body2, Button } from "components/SharedComponents";
import { View } from "components/styledComponents";
import { t } from "i18next";
import type { Node } from "react";
import React, { useState } from "react";
import { Checkbox, useTheme } from "react-native-paper";

import {
  registerUser
} from "./AuthenticationService";
import Error from "./Error";

const LicensePhotosForm = ( ): Node => {
  const initialCheckboxState = {
    first: {
      text: t( "Yes-license-my-photos" ),
      checked: true,
      links: [t( "Learn-More" )]
    },
    second: {
      text: t( "I-consent-to-allow-iNaturalist-to-store" ),
      checked: false,
      links: [t( "Learn-More" )]
    },
    third: {
      text: t( "I-consent-to-allow-my-personal-information" ),
      checked: false,
      links: [t( "Learn-More" )]
    },
    fourth: {
      text: t( "I-agree-to-the-Terms-of-Use" ),
      checked: false,
      links: [t( "Terms-of-Use" ), t( "Privacy-Policy" ), t( "Community-Guidelines" )]
    },
    fifth: {
      text: t( "Agree-to-all-of-the-above" ),
      checked: false
    }
  };

  const { params } = useRoute( );
  const { user } = params;
  const navigation = useNavigation( );
  const theme = useTheme( );
  const [checkboxes, setCheckboxes] = useState( initialCheckboxState );
  const [error, setError] = useState( null );

  const register = async ( ) => {
    user.pi_consent = true;
    user.data_transfer_consent = true;
    if ( checkboxes.first.checked === true ) {
      user.preferred_observation_license = "CC-BY-NC";
      user.preferred_photo_license = "CC-BY-NC";
      user.preferred_sound_license = "CC-BY-NC";
    }
    const registrationError = await registerUser( user );
    if ( registrationError ) {
      setError( registrationError );
    } else {
      navigation.navigate( "SignUpConfirmation" );
    }
  };

  const checkboxRow = row => {
    const { links, text, checked } = checkboxes[row];

    return (
      <View
        className={classnames( "flex-row mb-3", {
          "mt-10 mb-0": row === "fifth"
        } )}
        key={row}
      >
        <Checkbox.Android
          color={theme.colors.secondary}
          status={checked === true
            ? "checked"
            : "unchecked"}
          label={text}
          onPress={( ) => {
            const updatedCheckboxes = checkboxes;
            if ( row === "fifth" ) {
              updatedCheckboxes.first.checked = true;
              updatedCheckboxes.second.checked = true;
              updatedCheckboxes.third.checked = true;
              updatedCheckboxes.fourth.checked = true;
              updatedCheckboxes.fifth.checked = true;
            } else {
              if ( updatedCheckboxes[row].checked === true ) {
                updatedCheckboxes.fifth.checked = false;
              }
              updatedCheckboxes[row].checked = !checked;
            }

            setCheckboxes( { ...updatedCheckboxes } );
          }}
        />
        <View className="mt-2 flex-1">
          <Body2 className="flex-wrap color-white">{text}</Body2>
          {links && links.map( link => (
            <Body2 className="color-white underline font-bold mt-[9px]" key={link}>
              {link}
            </Body2>
          ) )}
        </View>
      </View>
    );
  };

  return (
    <View className="px-3 mt-[9px] justify-end">
      {Object.keys( checkboxes ).map( row => checkboxRow( row ) )}
      {error && <Error error={error} />}
      <Button
        level="focus"
        text={t( "CREATE-AN-ACCOUNT" )}
        onPress={register}
        className="mt-[30px]"
        disabled={
          !checkboxes.second.checked || !checkboxes.third.checked || !checkboxes.fourth.checked
        }
        testID="LicensePhotos.signupButton"
      />
    </View>
  );
};

export default LicensePhotosForm;
