import { RootState } from "../../rootReducer";

var store: any;

// should only be called by the server entry and client entry on startup
export function setStore(newStore: any) {
    store = newStore;
}

export function getReduxState(): RootState {
    return store.getState();
}

export function getDispatch() {
    return store.dispatch;
}