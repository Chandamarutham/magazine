import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from "./FooterLinks.module.css";



export default function FooterLinks({ title, listOfLinks, menuChanger }) {
    return (
        <div className={styles.footerLinkColumn}>
            <h3 className={styles.columnTitle}>{title}</h3>
            <ul>
                {listOfLinks.map((item) => (
                    item.type === 'internal' ? 
                    (
                        <li key={item.name} className={styles.linkItem}>
                            <a onClick={() => menuChanger(item.code)}>
                                {item.name}
                            </a>
                        </li>
                    ) : 
                    (
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
