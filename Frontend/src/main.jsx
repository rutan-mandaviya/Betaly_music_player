import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { store } from "./store/store.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <ToastContainer
        position="bottom-right"
        autoClose={2000} // thoda jaldi close ho
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false} // left-to-right
        pauseOnFocusLoss
        closeButton={false}
        draggable
        pauseOnHover
        toastClassName="rounded-md shadow-sm bg-white text-black"
        bodyClassName="text-xl px-2 py-1"
        style={{
          fontSize: "1rem",
          minWidth: "150px",
          maxWidth: "250px",
          minHeight: "30px", // chhota height
          display: "flex",
          alignItems: "center",
        }}
      />
    </BrowserRouter>
  </Provider>
);
