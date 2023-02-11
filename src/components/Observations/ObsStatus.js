// @flow

import classnames from "classnames";
import checkCamelAndSnakeCase from "components/ObsDetails/helpers/checkCamelAndSnakeCase";
import { ActivityCount, QualityGradeStatus } from "components/SharedComponents";
import { View } from "components/styledComponents";
import type { Node } from "react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";
import Observation from "realmModels/Observation";

type Props = {
  observation: typeof Observation,
  layout?: "horizontal" | "vertical",
  color?: string,
  margin?: string,
};
/* eslint-disable react-native/no-inline-styles */
const ObsStatus = ({
  observation,
  color,
  margin: wrapperMargin,
  layout = "vertical",
}: Props): Node => {
  const { t } = useTranslation( );
  const theme = useTheme( );
  const qualityGrade = checkCamelAndSnakeCase(observation, "qualityGrade");
  const margin = layout === "vertical" ? "mb-1" : "mr-1";
  const flexDirection = layout === "vertical" ? "flex-column" : "flex-row";
  const iconColor = color || theme.colors.primary;
  const numIdents = observation.identifications?.length || 0;
  const numComments = observation.comments?.length || 0;

  return (
    <View className={classnames("flex", flexDirection, wrapperMargin)}>
      <ActivityCount
        margin={margin}
        count={numIdents}
        color={iconColor}
        accessibilityLabel={t("x-identifications", { count: numIdents })}
        testID="ActivityCount.identificationCount"
      />
      <ActivityCount
        margin={margin}
        count={observation.comments?.length}
        color={iconColor}
        accessibilityLabel={t("x-comments", { count: numComments })}
        testID="ActivityCount.commentCount"
      />
      <QualityGradeStatus qualityGrade={qualityGrade} color={iconColor} />
    </View>
  );
};

export default ObsStatus;
