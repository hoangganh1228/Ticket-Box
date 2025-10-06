/**
 * Client-side Redux provider wrapper for Next.js.
 *
 * - Marked with `"use client"` because Redux store hydration and `redux-persist`
 *   depend on browser storage (localStorage/sessionStorage).
 * - Wraps the application with Redux `Provider` to make the store available
 *   throughout the component tree.
 * - Uses `PersistGate` from `redux-persist` to delay rendering of children
 *   until the persisted state has been rehydrated.
 *
 * Usage:
 * ```tsx
 * <ReduxProvider>
 *   <App />
 * </ReduxProvider>
 * ```
 */
'use client';

import React, {ReactNode} from "react";
import {Provider} from "react-redux";
import {store, persistor} from "@/src/redux/store/store";
import {PersistGate} from "redux-persist/integration/react";

export function ReduxProvider({children}: { children: ReactNode }) {
    return <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            {children}
        </PersistGate>
    </Provider>
}
