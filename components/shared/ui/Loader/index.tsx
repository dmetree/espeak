// @ts-nocheck
import { RotatingLines } from "react-loader-spinner";
import s from "./loader.module.scss";

export default function Loading() {
    return (
        <div className={s.loader}>
            <RotatingLines
                visible={true}
                height="96"
                width="96"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </div>
    );
}
