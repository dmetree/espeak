import React, { useState } from "react";
import s from "./faq.module.scss";

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setOpenIndex(prev => (prev === index ? null : index));
    };

    const faqs = [
        {
            question: "What is a smart contract?",
            answer:
                "A smart contract is a self-executing agreement stored on a blockchain. It automatically enforces the terms once conditions are met.",
        },
        {
            question: "Can I get a refund after booking a session?",
            answer:
                "Yes. You can get a full refund (minus fees) before the expert accepts. After that, a partial refund is possible depending on timing.",
        },
    ];

    return (
        <div className={s.faqWrapper}>
            <h2 className={s.title}>Frequently Asked Questions</h2>
            {faqs.map((item, index) => (
                <div key={index} className={s.faqItem}>
                    <button className={s.question} onClick={() => toggle(index)}>
                        {item.question}
                        <span className={s.arrow}>{openIndex === index ? "▲" : "▼"}</span>
                    </button>
                    {openIndex === index && <div className={s.answer}>{item.answer}</div>}
                </div>
            ))}
        </div>
    );
};

export default FAQSection;
