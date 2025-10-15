import styles from '../styles/Banner.module.css';
import SidePanel from './SidePanel';
import MainPanel from './MainPanel';
import Mudaliyandan from '/images/Mudaliyandan.jpg';
import Mahacharyar from '/images/Mahacharyar.png';


export default function Banner() {
    return (
        <div className={styles.banner}>
            <SidePanel image={Mudaliyandan} caption='முதலியாண்டான்' />
            <MainPanel />
            <SidePanel image={Mahacharyar} caption='மஹாச்சாரியர்' />
        </div>
    );
}
