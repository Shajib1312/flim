import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "./index.css";
import ToggleColorMode from './utils/ToggleColorMode';
import { Provider } from "react-redux";
import store from "./app/store";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <ToggleColorMode >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ToggleColorMode>
  </Provider>
);
