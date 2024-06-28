
import Logo from '../src/images/logo.svg';
import styles from '../styles/AnimatedLogo.module.css';

const AnimatedLogo = () => {
    return (
        <div className={styles.animatedLogo}>
            <Logo/>
        </div>
    )
}

export default AnimatedLogo;