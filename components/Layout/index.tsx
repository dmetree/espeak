import { useEffect } from "react";
import Header from "../features/Header";
import Sidebar from "../features/Sidebar";
import s from "./Layout.module.scss";
import { useLocalStorage } from "usehooks-ts";


const Layout = (props: any) => {

    const [theme] = useLocalStorage("theme", "default");

    useEffect(() => {
        document.body.setAttribute("data-theme", theme);
    }, [theme]);

    return (
        <div className={s.app}>
            <div className={`${s.bg}`} data-theme={theme}></div>
            <Header />
            <Sidebar />
            {props.children}
            {/* <Footer /> */}
        </div>
    )
}

export default Layout;
