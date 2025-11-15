import styles from './MobileMenuDropDown.module.css';
import { topMenuItems } from "./MenuData";
import { Link } from 'react-router-dom';

export default function MobileMenuDropDown({ setIsMenuOpen }) {
    const isAuthenticated = typeof window !== 'undefined' && sessionStorage.getItem('isAdmin') === 'true';

    const itemsToShow = topMenuItems
        .filter(item => (
            // for authenticated users show 'admin-large-only', otherwise 'large-only'
            isAuthenticated ? item.show === 'admin-large-only' : item.show === 'large-only'
        ));

    return (
        <div className={styles.mobileMenuDropdown}>
            {itemsToShow.map((item) => (
                <Link
                    key={item.name}
                    to={item.href || '#'}
                    onClick={() => setIsMenuOpen && setIsMenuOpen(false)}
                    className={styles.mobileNavItem}
                >
                    {item.name}
                </Link>
            ))}
        </div>
    );
}
