import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux"; // Import Provider từ react-redux
import App from "./App";
import store from "./redux/store"; // Import store Redux

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      {" "}
      {/* Bao bọc App bằng Provider */}
      <App />
    </Provider>
  </BrowserRouter>
);
