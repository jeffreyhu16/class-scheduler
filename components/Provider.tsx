"use client";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { UserProvider } from "@auth0/nextjs-auth0/client";

const StoreProvider = ({ children }: { children: JSX.Element }) => {
  return (
    <UserProvider>
      <Provider store={store}>{children}</Provider>
    </UserProvider>
  );
};

export default StoreProvider;
