// @flow

import classnames from "classnames";
import { Text, View } from "components/styledComponents";
import { t } from "i18next";
import type { Node } from "react";
import React from "react";
import { TouchableOpacity } from "react-native";

type Tab = {
  id: string,
  text: string,
  testID?: string,
  onPress: ( any ) => void
}

type Props = {
  tabs: Tab[],
  activeId: string,
}

const DEFAULT_TABS = [];
const Tabs = ( { tabs = DEFAULT_TABS, activeId }: Props ): Node => (
  <View
    className="bg-white flex flex-row"
    accessibilityRole="tablist"
  >
    {
      tabs.map( ( {
        id, text, onPress, testID
      } ) => {
        const active = activeId === id;

        return (
          <View key={id} className="flex-1">
            <TouchableOpacity
              onPress={( ...args ) => {
                if ( !active ) {
                  onPress( ...args );
                }
              }}
              testID={testID || `${id}-tab`}
              accessibilityRole="tab"
              accessibilityLabel={text}
              accessibilityHint={t( "Switch-to-tab", { tab: text } )}
              accessibilityState={{
                selected: active,
                expanded: active
              }}
            >
              <Text
                className={classnames( "text-xl self-center py-2", {
                  "text-focus": active,
                  "text-grayText": !active
                } )}
              >
                {text}
              </Text>
              <View className={classnames( "h-1 rounded-t-lg", {
                "bg-inatGreen": active,
                "bg-white": !active
              } )}
              />
            </TouchableOpacity>
          </View>
        );
      } )
      }
  </View>
);

export default Tabs;
