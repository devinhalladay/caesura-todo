import React from "react";
import Modal from "react-modal";
import "tailwindcss/tailwind.css";
import "../assets/css/components/DatePicker/datepicker.scss";
import { BoardProvider } from "../contexts/Board";
import initAuth from "../lib/auth";

initAuth();

function MyApp({ Component, pageProps }) {
  const { tasks, ...actualPageProps } = pageProps;

  return (
    <div className="font-sans-serif">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,700;1,400&display=swap"
        rel="stylesheet"
      />
      <BoardProvider value={{ tasks: tasks }}>
        <Component {...actualPageProps} />
      </BoardProvider>
    </div>
  );
}

export default MyApp;
