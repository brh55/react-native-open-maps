import * as ReactNative from "react-native";

jest.doMock("react-native", () => {
  // Extend ReactNative
  return Object.setPrototypeOf(
    {
      // Redefine an export, like a component
      Linking: "Button",
      Platform: {
        ...ReactNative.Platform,
        OS: "ios",
        Version: 123,
        isTesting: true,
        select: objs => objs["ios"]
      },
    },
    ReactNative
  );
});