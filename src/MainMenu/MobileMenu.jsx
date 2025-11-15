import styles from './MobileMenu.module.css';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { topMenuItems } from './MenuData';
import { Link } from 'react-router-dom';

export default function MobileMenuDropDown({ setIsMenuOpen, isMenuOpen }) {
    const isAuthenticated = typeof window !== 'undefined' && sessionStorage.getItem('isAdmin') === 'true';

    return (
        <>
            <div className={styles.mobileTopBar}>
                {topMenuItems
                    .filter(item => (
                        // show 'admin-always' for authenticated users, otherwise 'always'
                        isAuthenticated ? item.show === 'admin-always' : item.show === 'always'
                    ))
                    .map((item) => (
                        <Link
                            key={item.name}
                            to={item.href || '#'}
                            onClick={() => {
                                setIsMenuOpen(false);
                            }}
                            className={styles.mobileNavItem}
                        >
                            {item.name}
                        </Link>
                    ))}
            </div>
            <button
                className={styles.mobileMenuButton}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
            >
                <FontAwesomeIcon icon={faBars} className={styles.menuIcon} />
            </button>
        </>
    );
}