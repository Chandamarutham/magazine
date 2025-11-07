import styles from './DesktopMenu.module.css';
import { topMenuItems } from './MenuData';


export default function DesktopMenu({handleItemClick}) {
    return (
        <div className={styles.desktopMenu}>
            {topMenuItems.map((item) => (
                <a
                    key={item.name}
                    onClick={() => handleItemClick(item.code)}
                    className={styles.navItem}
                >
                    {item.name}
                </a>
            ))}
        </div>
    );
}