import styles from './MainMenu.module.css';
import { useState } from 'react';
import DesktopMenu from './DesktopMenu';
import MobileMenu from './MobileMenu';
import MobileMenuDropDown from './MobileMenuDropDown';

export default function MainMenu({ menuChanger }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleItemClick = (itemCode) => {
    menuChanger(itemCode);
    setIsMenuOpen(false);
  };

  return (
    <nav className={styles.mainMenu}>
      <div className={styles.menuItemContainer}>
        <DesktopMenu handleItemClick={handleItemClick} />
        <MobileMenu handleItemClick={handleItemClick} setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} />
        {isMenuOpen && <MobileMenuDropDown handleItemClick={handleItemClick} />}
      </div>
    </nav>
  );
}
