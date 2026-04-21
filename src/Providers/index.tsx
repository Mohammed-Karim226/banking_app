"use client";
import { store } from "../store/redux";
import { PropsWithChildren } from "react";
import { Provider as ReduxProviderComponent } from "react-redux";

const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <ReduxProviderComponent store={store}>{children}</ReduxProviderComponent>
  );
};

export default AppProvider;
