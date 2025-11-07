import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import gs from "@/styles/general.module.scss";
import s from "./AppPage.module.scss";

import Header from "../features/Header";


interface AppPageProps {
  children: React.ReactNode;
}

export default function AppPage({ children }: AppPageProps) {


  return (
    <div className={gs.mainWrapper}>
      <ToastContainer />
      <main className={s.mainContainer}>
        <div className={s.headerContainer}>
          <Header />

        </div>
        <div className={s.contentWrapper}>
          <div className={s.sideMenu}></div>
          {children}
        </div>
      </main>
    </div>
  );
}
