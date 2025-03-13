import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { MyProvider } from "./providers/AppContextProvider.tsx";
import AntdProvider from "./providers/AntdProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <MyProvider>
      <AntdProvider>
        <App />
      </AntdProvider>
    </MyProvider>
  </BrowserRouter>
);
