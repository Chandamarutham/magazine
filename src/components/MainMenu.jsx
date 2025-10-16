import React, { useState } from 'react';
import styles from '../styles/MainMenu.module.css';

function MainMenu() {
  const [activeItem, setActiveItem] = useState('Home');

  const menuItems = [
    { name: 'Home', href: '#home' },
    { name: 'Read', href: '#read' },
    { name: 'Listen', href: '#listen' },
    { name: 'Resources', href: '#resources' },
    { name: 'Subscribe', href: '#subscribe' }
  ];

  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
  };

  return (
    <nav className={styles.mainMenu}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="flex space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => handleItemClick(item.name)}
                className={`
                  px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                  ${
                    activeItem === item.name
                      ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }
                `}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default MainMenu;