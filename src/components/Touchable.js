/* @flow */

import React, { Component } from "react";
import { TouchableOpacity } from "react-native";

const defaultHitSlop = {
  // default & can be overrided by rest
  top: 16,
  left: 16,
  right: 16,
  bottom: 16,
};

export default class Touchable extends Component<
  {
    // when on press returns a promise,
    // the button will toggle in a pending state and
    // will wait the promise to complete before enabling the button again
    // it also displays a spinner if it takes more than WAIT_TIME_BEFORE_SPINNER
    onPress: ?() => ?Promise<any>,
    children: *,
  },
  {
    pending: boolean,
  },
> {
  state = {
    pending: false,
  };

  onPress = async () => {
    const { onPress } = this.props;
    if (!onPress) return;
    try {
      const res = onPress();
      if (res && res.then) {
        // it's a promise, we will use pending/spinnerOn state
        this.setState({ pending: true });
        await res;
      }
    } finally {
      this.setState(({ pending }) => (pending ? { pending: false } : null));
    }
  };

  render() {
    const { onPress, children, ...rest } = this.props;
    const { pending } = this.state;
    const disabled = !onPress || pending;
    return (
      <TouchableOpacity
        onPress={this.onPress}
        disabled={disabled}
        hitSlop={defaultHitSlop}
        {...rest}
      >
        {children}
      </TouchableOpacity>
    );
  }
}
