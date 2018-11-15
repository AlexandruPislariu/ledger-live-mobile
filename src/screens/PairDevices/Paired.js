// @flow

import React, { PureComponent } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { withNavigation } from "react-navigation";
import { Trans } from "react-i18next";

import colors from "../../colors";
import LText from "../../components/LText";
import Button from "../../components/Button";
import PairingSuccess from "../../icons/PairingSuccess";
import DeviceItemSummary from "../../components/DeviceItemSummary";

class Paired extends PureComponent<{
  deviceId: string,
  deviceName: string,
  onContinue: () => *,
  navigation: *,
}> {
  onEdit = () => {
    const { deviceId, deviceName, navigation } = this.props;
    navigation.navigate("EditDeviceName", {
      deviceId,
      deviceName,
    });
  };

  render() {
    const { deviceId, onContinue } = this.props;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.root}>
          <PairingSuccess />
          <LText secondary semiBold style={styles.title}>
            <Trans i18nKey="PairDevices.Paired.title" />
          </LText>
          <LText style={styles.description}>
            <Trans i18nKey="PairDevices.Paired.desc">
              {"You can now use your Nano X on you Ledger Live mobile App to "}
              <LText semiBold>send & receive funds</LText>
              {". You can also mange your device on the "}
              <LText semiBold>Manager</LText>
              {" section"}
            </Trans>
          </LText>
          <View style={styles.fullContainer}>
            <DeviceItemSummary
              deviceId={deviceId}
              genuine
              onEdit={this.onEdit}
            />
          </View>
          <View style={[styles.fullContainer, styles.buttonContainer]}>
            <Button
              type="primary"
              title={<Trans i18nKey="PairDevices.Paired.action" />}
              onPress={onContinue}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 38,
  },
  fullContainer: {
    width: "100%",
  },
  buttonContainer: {
    marginTop: "auto",
  },
  title: {
    marginTop: 24,
    fontSize: 18,
    color: colors.darkBlue,
  },
  description: {
    marginTop: 8,
    marginBottom: 40,
    textAlign: "center",
    fontSize: 14,
    paddingHorizontal: 40,
    color: colors.grey,
  },
});

export default withNavigation(Paired);
