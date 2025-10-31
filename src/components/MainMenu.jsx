import styles from '../styles/MainMenu.module.css';

function MainMenu({ menuChanger }) {

  const menuItems = [
    { name: 'Home', href: '#home' , code: 1},
    { name: 'Read', href: '#read' , code: 2},
    { name: 'Listen', href: '#listen' , code: 3},
    { name: 'Ask', href: '#ask' , code: 4},
    { name: 'Subscribe', href: '#subscribe' , code: 5}
  ];

  const handleItemClick = (itemCode) => {
    menuChanger(itemCode);
  };

  return (
    <nav className={styles.mainMenu}>
        <div className={styles.menuItemContainer}>
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => handleItemClick(item.code)}
                className={styles.navItem}
              >
                {item.name}
              </a>
            ))}
          </div>
    </nav>
  );
}

export default MainMenu;