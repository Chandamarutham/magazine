import styles from './MobileMenuDropDown.module.css';
import { topMenuItems } from "./MenuData";

export default function MobileMenuDropDown({ handleItemClick }) {
    return (
        <div className={styles.mobileMenuDropdown}>
            {topMenuItems.map((item) => (
                (
                    item.show === 'large-only' &&
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
    );
}
