import s from './styles.module.scss'

const H4TitleBold = ({children}) => {
    return (
        <h2 className={s.h4Bold}>{children}</h2>
    )
}

export default H4TitleBold;
