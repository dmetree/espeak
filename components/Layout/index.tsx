import { useEffect } from "react";
import Header from "../features/Header";
import Sidebar from "../features/Sidebar";
import s from "./Layout.module.scss";
import { useLocalStorage } from "usehooks-ts";
import Footer from "@/components/features/Footer";

const Layout = (props: any) => {
    const [theme] = useLocalStorage("theme", "default");

    useEffect(() => {
        document.body.classList.remove('theme-default', 'theme-dark');
        document.body.classList.add(theme === 'default' ? 'theme-default' : theme);
    }, [theme]);

    return (
        <div className={s.app}>
            <Header />
            {/* <Sidebar /> */}
            <main className={s.content}>
                {props.children}
            </main>
            <Footer />
        </div>
    )
}

export default Layout;
