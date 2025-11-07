import styles from './StaffPage.module.css';

export default function StaffPage() {
  return (
    <div className={styles.container}>
      <b>சண்டமாருதம்</b> பத்திரிகை தற்போது Sri KKC Periyappangar Swamy Trust (Regd) என்ற அமைப்பின் மூலம் நிர்வகிக்கப்பட்டு வெளியிடப்படுகிறது.
      <br /><br />
      இந்த பத்திரிகைக்கு நம் திருமாளிகையின் வர்த்தமான ஸ்வாமி ஶ்ரீ உ.வே. லோயில் கந்தாடை சண்டமாருதம் தொட்டையாச்சார் (யோக ந்ருஸிம்ஹன்) ஸ்வாமி கீழ்கண்ட குழுவினை நியமித்துள்ளார்.
      <br /><br />
      <b>குழுவினர் விபரம்</b>
      <ol className={styles.list}>
        <li className={styles.listitem}>ஶ்ரீ உ.வே. கோயில் கந்தாடை சண்டமாருதம் <span className={styles.redText}>பரத் ஶ்ரீநிவாஸன் ஸ்வாமி</span> - கௌரவ தலைவர்</li>
        <li className={styles.listitem}>ஶ்ரீ உ.வே. மதுரை பேராசிரியர் <span className={styles.redText}>முனைவர் இரா. அரங்கராஜன் ஸ்வாமி</span> - கௌரவ ஆலோசகர்</li>
        <li className={styles.listitem}>ஶ்ரீ உ.வே. ஶ்ரீவில்லிபுத்தூர் <span className={styles.redText}>நாராயணன் ஸ்வாமி (நாவலர்)</span> - கௌரவ ஆசிரியர்</li>
        <li className={styles.listitem}>ஶ்ரீமதி <span className={styles.redText}>பூமா கிருஷ்ணன்</span> - எடிட்டர்</li>
        <li className={styles.listitem}>ஶ்ரீமதி <span className={styles.redText}>பாமா சுரேஷ்</span> - குழுவினர்</li>
        <li className={styles.listitem}>ஶ்ரீ <span className={styles.redText}>சம்பத்குமார்</span> - குழுவினர்</li>
        <li className={styles.listitem}>ஶ்ரீ <span className={styles.redText}>டி.எஸ். பாலாஜி</span> - குழுவினர்</li>
        <li className={styles.listitem}>ஶ்ரீ உ.வே. திருச்சேரை <span className={styles.redText}>நாராயணன் ஸ்வாமி</span> - குழுவினர்</li>
        <li className={styles.listitem}>ஶ்ரீ <span className={styles.redText}>எஸ்.பத்மநாபன்</span> - குழுவினர்</li>
      </ol>

    </div>
  );
}
