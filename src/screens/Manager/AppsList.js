/* @flow */
import React, { Component } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { translate } from "react-i18next";
import type { NavigationScreenProp } from "react-navigation";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import type { DeviceInfo, ApplicationVersion } from "../../types/manager";
import manager from "../../logic/manager";
import FilteredSearchBar from "../../components/FilteredSearchBar";
import LText from "../../components/LText";

import AppsListPending from "./AppsListPending";
import AppsListError from "./AppsListError";
import AppRow from "./AppRow";
import AppAction from "./AppAction";

const actionKey = action => `${action.app.id}_${action.type}`;

class ManagerAppsList extends Component<
  {
    navigation: NavigationScreenProp<{
      params: {
        deviceId: string,
        meta: {
          deviceInfo: DeviceInfo,
        },
      },
    }>,
    isDevMode: boolean,
  },
  {
    apps: ApplicationVersion[],
    pending: boolean,
    error: ?Error,
    action: ?{ type: "install" | "uninstall", app: ApplicationVersion },
  },
> {
  static navigationOptions = {
    title: "App catalog",
  };

  state = {
    apps: [],
    pending: true,
    error: null,
    action: null,
  };

  unmount = false;

  componentDidMount() {
    this.fetchAppList();
  }

  componentWillUnmount() {
    this.unmount = true;
  }

  fetchAppList = async () => {
    this.setState(old => {
      if (old.pending) return null;
      return { pending: true, error: null };
    });
    try {
      const { navigation, isDevMode } = this.props;
      const { deviceInfo } = navigation.getParam("meta");

      const apps = await manager.getAppsList(deviceInfo, isDevMode);

      if (this.unmount) return;
      this.setState({
        error: null,
        pending: false,
        apps,
      });
    } catch (error) {
      if (this.unmount) return;
      this.setState({
        pending: false,
        error,
      });
    }
  };

  onActionClose = () => {
    this.setState({ action: null });
  };

  onInstall = (app: ApplicationVersion) => {
    this.setState({
      action: { type: "install", app },
    });
  };

  onUninstall = (app: ApplicationVersion) => {
    this.setState({
      action: { type: "uninstall", app },
    });
  };

  renderRow = ({ item }: { item: ApplicationVersion }) => (
    <AppRow
      app={item}
      onInstall={this.onInstall}
      onUninstall={this.onUninstall}
    />
  );

  renderList = items => (
    <FlatList
      data={items}
      renderItem={this.renderRow}
      keyExtractor={this.keyExtractor}
      showsVerticalScrollIndicator={false}
      keyboardDismissMode="on-drag"
      contentContainerStyle={styles.listContainer}
    />
  );

  renderEmptySearch = () => (
    <View>
      <LText>No apps found</LText>
    </View>
  );

  keyExtractor = (d: ApplicationVersion) => String(d.id);

  render() {
    const { navigation } = this.props;
    const { apps, pending, error, action } = this.state;
    const { deviceInfo } = navigation.getParam("meta");
    const deviceId = navigation.getParam("deviceId");
    return (
      <View style={styles.root}>
        {pending ? (
          <AppsListPending />
        ) : error ? (
          <AppsListError error={error} onRetry={this.fetchAppList} />
        ) : (
          <FilteredSearchBar
            list={apps}
            renderList={this.renderList}
            renderEmptySearch={this.renderEmptySearch}
            inputWrapperStyle={styles.inputWrapper}
          />
        )}
        {action ? (
          <AppAction
            key={actionKey(action)}
            action={action}
            onClose={this.onActionClose}
            deviceId={deviceId}
            targetId={deviceInfo.targetId}
          />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 16,
  },
  inputWrapper: {
    marginTop: 8,
  },
  listContainer: {
    paddingTop: 16,
    marginBottom: 16,
  },
});

export default translate()(
  connect(
    createStructuredSelector({
      isDevMode: () => false, // TODO need a selector here
    }),
  )(ManagerAppsList),
);
