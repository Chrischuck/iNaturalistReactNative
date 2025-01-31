// @flow

import { Body4 } from "components/SharedComponents";
import { t } from "i18next";
import type { Node } from "react";
import React from "react";

type Props = {
  observation: Object
}

// lifted from web:
// https://github.com/inaturalist/inaturalist/blob/768b9263931ebeea229bbc47d8442ca6b0377d45/app/webpack/shared/components/observation_attribution.jsx
const Attribution = ( { observation }: Props ): Node => {
  const { user } = observation;
  const licenseCode = observation.license_code;
  const copyrightAttribution = user
    ? ( user.name || user.login )
    : t( "unknown" );

  const renderRestrictions = ( ) => {
    switch ( licenseCode ) {
      case "cc0":
        return t( "no-rights-reserved-cc0" );
      case "cc-by":
        return t( "attribution-cc-by" );
      case "cc-by-sa":
        return t( "attribution-cc-by-sa" );
      case "cc-by-nc":
        return t( "attribution-cc-by-nc" );
      case "cc-by-nd":
        return t( "attribution-cc-by-nd" );
      case "cc-by-nc-sa":
        return t( "attribution-cc-by-nc-sa" );
      case "cc-by-nc-nd":
        return t( "attribution-cc-by-nc-nd" );
      default:
        return t( "all-rights-reserved" );
    }
  };

  return (
    <Body4>
      {t( "Observation-Attribution", {
        attribution: copyrightAttribution,
        restrictions: renderRestrictions( )
      } )}
    </Body4>
  );
};

export default Attribution;
