import styles from '../styles/UpcomingEvents.module.css';

export default function UpcomingEvents() {
    const events = [
        { date: '07-11-2025', description: 'ஶ்ரீதாயார் திருக்கல்யான உற்சவம்' },
        { date: '14-11-2025', description: 'கடைவெள்ளி உற்சவம்' },
        { date: '15-11-2025 (உத்திரம்)', description: 'ஶ்ரீ அம்ருதபலவல்லி தாயார் உற்சவம்' },
        { date: '17-11-2025', description: 'ஶ்ரீ தாயார் திருமலைக்கு எழுந்தருளவும் வனபோஜன உற்சவம்' },
        { date: '25-11-2025', description: 'திருமங்கை மன்னன் உற்சவ ஆரம்பம்' },
        { date: '02-12-2025', description: 'கைசிக துவாதசி புரானப் படனம்; கடிகாசல ஹனுமத் ஜெயந்தி' },
        { date: '04-12-2025', description: 'திருமங்கை மன்னன் வருஷ சாற்றுமுறை' },
        { date: '05-12-2025', description: 'திருக்கார்த்திகை தீபம்' },
        { date: '13-12-2025 (உத்திரம்)', description: 'ஶ்ரீ அம்ருதபலவல்லி தாயார் உற்சவம்' },
        { date: '20-12-2025', description: 'பகல்பத்து உற்சவ ஆரம்பம்' },
        { date: '29-12-2025', description: 'பகல்பத்து உற்சவ சாற்றுமுறை; நாச்சியார் திருக்கோலம்' },
        { date: '30-12-2025', description: 'முக்கோடி ஏகாதசி, பரமபதவாசல் சேவை, காலை கருட சேவை, ராப்பத்து உற்சவ ஆரம்பம்' },
        { date: '31-12-2025', description: 'முக்கோடி துவாதசி, கண்ணன் தீர்த்தவாரி' },
        { date: '08-01-2026', description: 'ராப்பத்து உற்சவ சாற்றுமுறை, ஶ்ரீ நம்மாழ்வார் திருவடி தொழல்' },
        { date: '12-01-2026', description: 'ஶ்ரீ ஆண்டாள் நீராட்ட உற்சவாரம்பம்' },
        { date: '14-01-2026', description: 'போகிப் பண்டிகை, ஆண்டாள் சகுனம் பார்த்தல்' },
        { date: '15-01-2026', description: 'ஶ்ரீ ஆண்டாள் திருக்கல்யாண உற்சவம்' },
    ];

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>திருக்கடிகை திவ்யதேச விசேஷ உற்சவங்கள்</h2>
            <table className={styles.table}>
                <thead className={styles.tableHeader}>
                    <tr className={styles.headerRow}>
                        <th className={styles.headerCell}>நாள்</th>
                        <th className={styles.headerCell}>உற்சவ விவரம்</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((event, index) => (
                        <tr className={styles.tableRow} key={index}>
                            <td className={styles.tableCell}>{event.date}</td>
                            <td className={styles.tableCell}>{event.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

