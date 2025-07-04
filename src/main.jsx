import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import { BrowserRouter } from 'react-router-dom';
import { Provider } from "react-redux";
import { store } from "./store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter> {/* Wrap your App with BrowserRouter */}
      <Provider store={store}> {/* Wrap your App with Provider */}
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
)
