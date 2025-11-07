import styles from './Header.module.css';
import Banner from './Banner';
import MagazineTitle from './MagazineTitle';

export default function Header() {
    return (
        <header className={styles.header}>
            <Banner />
            <MagazineTitle />
        </header>
    );
}
