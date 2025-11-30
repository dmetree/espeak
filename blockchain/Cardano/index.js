import dynamic from "next/dynamic"

export * as Wallet from "./Wallet"
export const Validators = dynamic(() => import("./Validators"), { ssr: false })
export const TxBuilder = dynamic(() => import("./TxBuilder"), { ssr: false })