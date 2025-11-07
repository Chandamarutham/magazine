import styles from './MobileMenu.module.css';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { topMenuItems } from './MenuData';

export default function MobileMenuDropDown({ handleItemClick ,  setIsMenuOpen ,  isMenuOpen }) {
    return (
        <>
            <div className={styles.mobileTopBar}>
                {topMenuItems.map((item) => (
                    (
                        item.show === 'always' &&
                        <a
                            key={item.name}
                            onClick={() => handleItemClick(item.code)}
                            className={styles.mobileNavItem}
                        >
                            {item.name}
                        </a>
                    )
                ))}
            </div>
            <button
                className={styles.mobileMenuButton}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
            >
                <FontAwesomeIcon icon={faBars} className={styles.menuIcon} />
            </button>
        </ >
    );
}