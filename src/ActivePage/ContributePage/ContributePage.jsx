import styles from './ContributePage.module.css';

export default function ContributePage() {
    return (
        <div>
            <p className={styles.paragraph}>
                இந்த பத்திரிகை இலவசமாக விரும்பிய வாசகர்களிடம் சென்று அடைய வேண்டும் என்பது நோக்கம். இதற்கு உதவும் வகையில், விளம்பரங்கள் மற்றும் நன்கொடைகள் மூலம் நிதி திரட்ட உத்தேசம்.<br /><br />
                உங்களுக்கு இந்த பத்திரிகையை ஆதரிக்க விருப்பமிருந்தால், உங்களுக்கு தெரிந்த விளம்பரதாரர்களை எங்களுக்கு அறிமுகப்படுத்த கேட்டுக்கொள்கிறோம். இந்த வெப்ஸைட்டின் கீழ்ப்பகுதியில் உள்ள "Advertise" என்ற பக்கத்தின் மூலமோ, editor@kkcp.chandamarutham.org என்ற மின்னஞ்சல் முகவரி மூலமாகவோ தொடர்பு கொள்ளலாம்.<br /><br />
                உங்கள் உதவிக்கு நன்றி!<br /><br />
            </p>
            <span className={styles.heading}>அறக்கட்டளையின் வங்கி விவரங்கள்:</span><br />
            <table className={styles.table}>
                <tbody>
                    <tr>
                        <td className={styles.firstColumn}>கணக்கு பெயர்</td>
                        <td className={styles.dataColumn}>Sri KKC Periyappangar Swamy Trust</td>
                        </tr>
                    <tr>
                        <td className={styles.firstColumn}>வங்கி </td>
                        <td className={styles.dataColumn}>ICICI Bank</td>
                    </tr>
                    <tr>
                        <td className={styles.firstColumn}>கிளை </td>
                        <td className={styles.dataColumn}>Nandanam Branch, Chennai - 600 035</td>
                    </tr>
                    <tr>
                        <td className={styles.firstColumn}>கணக்கு எண் </td>
                        <td className={styles.dataColumn}>234701000444</td>
                    </tr>
                    <tr>
                        <td className={styles.firstColumn}>கணக்கு வகை </td>
                        <td className={styles.dataColumn}>Savings Account</td>
                    </tr>
                    <tr>
                        <td className={styles.firstColumn}>IFSC குறியீடு </td>
                        <td className={styles.dataColumn}>ICIC0002347</td>
                    </tr>
                </tbody>

            </table>
        </div>
    );
}