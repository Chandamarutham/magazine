import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from "./FooterLinks.module.css";
import { Link } from 'react-router-dom';

export default function FooterLinks({ title, listOfLinks, menuChanger }) {
    return (
        <div className={styles.footerLinkColumn}>
            <h3 className={styles.columnTitle}>{title}</h3>
            <ul>
                {listOfLinks.map((item) => (
                    item.type === 'internal' ? (
                        <li key={item.name} className={styles.linkItem}>
                            <Link to={item.href} onClick={() => menuChanger && menuChanger(item.code)}>
                                {item.name}
                            </Link>
                        </li>
                    ) : (
                        <li key={item.name} className={styles.linkItem}>
                            <a href={item.code} target="_blank" rel="noopener noreferrer">
                                {item.name} <FontAwesomeIcon icon={item.icon} />
                            </a>
                        </li>
                    )
                ))}
            </ul>
        </div>
    );
}
