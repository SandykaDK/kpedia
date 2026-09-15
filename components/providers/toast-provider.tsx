"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function ToastProvider() {
  return (
    <ToastContainer
      autoClose={3000}
      closeOnClick
      hideProgressBar={false}
      pauseOnHover
      position="top-right"
      theme="dark"
    />
  );
}
