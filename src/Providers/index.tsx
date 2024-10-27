"use client";
import { store } from "../store/redux";
import { FunctionComponent, PropsWithChildren } from "react";
import { Provider as ReduxProviderComponent } from "react-redux";

type IProvidersProps = PropsWithChildren<Record<string, unknown>>;

const AppProvider: FunctionComponent<IProvidersProps> = ({ children }) => {
  return (
    <ReduxProviderComponent store={store}>{children}</ReduxProviderComponent>
  );
};

export default AppProvider;
