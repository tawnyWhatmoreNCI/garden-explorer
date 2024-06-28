
import styles from '../styles/StatementPoints.module.css';

const StatementPoints = () => (
<div className={`${styles.row} ${styles.animatedBorder}`}>
    <h2 className="secondaryFont">🧭 Explore</h2>
    <div className={styles.divider}></div>
    <h2 className="secondaryFont">🌿 Collect</h2>
    <div className={styles.divider}></div>
    <h2 className="secondaryFont">📖 Learn</h2>
</div>)

export default StatementPoints;