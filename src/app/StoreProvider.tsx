"use client";
import { Provider } from "react-redux";
import store, { persistor } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";

export default function StoreProvider({
  children,
}: {
  count: number;
  children: React.ReactNode;
}) {
  // const storeRef = useRef<AppStore | null>(null)
  // if (!storeRef.current) {
  //   storeRef.current = makeStore()
  //   storeRef.current.dispatch(initializeCount(count))
  // }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
