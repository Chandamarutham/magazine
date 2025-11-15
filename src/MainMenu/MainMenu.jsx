import styles from './MainMenu.module.css';

import { useState } from 'react';

import DesktopMenu from './DesktopMenu';
import MobileMenu from './MobileMenu';
import MobileMenuDropDown from './MobileMenuDropDown';

export default function MainMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <nav className={styles.mainMenu}>
      <div className={styles.menuItemContainer}>
        <DesktopMenu />
        <MobileMenu setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} />
        {isMenuOpen && <MobileMenuDropDown setIsMenuOpen={setIsMenuOpen} />}
      </div>
    </nav>
  );
}
