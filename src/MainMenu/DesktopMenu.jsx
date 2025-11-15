import styles from './DesktopMenu.module.css';
import { topMenuItems } from './MenuData';
import { Link } from 'react-router-dom';


export default function DesktopMenu() {
    // simple client-side flag (sessionStorage) controls Manage visibility in dummy mode
    const isAuthenticated = typeof window !== 'undefined' && sessionStorage.getItem('isAdmin') === 'true';

    // never-show items (like the Admin microsite) must not appear in the desktop menu
    const visibleTopMenu = topMenuItems.filter(item => item.show !== 'never');

    const itemsToShow = visibleTopMenu.filter(item => (
        isAuthenticated ? String(item.show).includes('admin') : !String(item.show).includes('admin')
    ));

    return (
        <div className={styles.desktopMenu}>
            {itemsToShow.map((item) => (
                <Link
                    key={item.name}
                    to={item.href || '#'}
                    className={styles.navItem}
                >
                    {item.name}
                </Link>
            ))}
        </div>
    );
}