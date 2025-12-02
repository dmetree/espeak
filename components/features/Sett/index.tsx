"use client";

import React, { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { X, Sun, Moon } from "lucide-react";
import styles from "./SettingsModal.module.scss";
import LocaleSwitcher from "@/components/features/LocaleSwitcher";

interface SettingsModalProps {
    onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
    const [theme, setTheme] = useLocalStorage("theme", "theme-default");

    useEffect(() => {
        if (typeof document !== "undefined") {
            document.body.classList.remove("theme-default", "theme-dark");
            document.body.classList.add(theme);
        }
    }, [theme]);

    const handleSetTheme = (value: string) => {
        setTheme(value);
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>Settings</h2>
                    <X className={styles.closeIcon} size={20} onClick={onClose} />
                </div>

                {/* Theme Section */}
                <section className={styles.section}>
                    <h4>Theme</h4>
                    <div className={styles.toggleGroup}>
                        <button
                            className={`${styles.toggle} ${theme === "theme-default" ? styles.active : ""
                                }`}
                            onClick={() => handleSetTheme("theme-default")}
                        >
                            <Sun size={16} /> Light
                        </button>

                        <button
                            className={`${styles.toggle} ${theme === "theme-dark" ? styles.active : ""
                                }`}
                            onClick={() => handleSetTheme("theme-dark")}
                        >
                            <Moon size={16} /> Dark
                        </button>
                    </div>
                </section>

                {/* Language Section */}
                <LocaleSwitcher />

                {/* Timezone */}
                <section className={styles.section}>
                    <h4>Timezone</h4>
                    <div className={styles.toggleGroup}>
                        <button className={`${styles.toggle} ${styles.active}`}>
                            Local timezone
                        </button>
                        <button className={styles.toggle}>UTC Timezone</button>
                    </div>
                </section>
            </div>
        </div>
    );
}
