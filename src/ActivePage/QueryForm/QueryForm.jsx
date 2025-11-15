import { useState } from 'react';
import { SubmitForm } from '../../lib/SubmitForm';
import styles from './QueryForm.module.css';

const apiEndpoint = 'https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/production/query'

export default function QueryForm() {
    const [formData, setFormData] = useState(
        {
            query: '',
            name: '',
            city: '',
            email_or_phone: '',
        }
    )

    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return; // Do not submit if validation fails!
        }
        try {
            const response = await SubmitForm(formData, apiEndpoint);
            if (response.ok) {
                setShowSuccess(true);  // If you want the success message to show
                resetForm();           // Optionally clear the form here on success
            }
        } catch (err) {
            console.error('Form submission error:', err);
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.query.trim()) {
            newErrors.query = 'Your query is required';
        } else if (formData.query.length > 250) {
            newErrors.query = 'Query must be 250 characters or less';
        }

        if (!formData.name.trim()) {
            newErrors.name = 'Your name is required';
        }

        if (!formData.city.trim()) {
            newErrors.city = 'Your city is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            query: '',
            name: '',
            city: '',
            email_or_phone: ''
        });
    };

    const handleReset = () => {
        resetForm();
        setErrors({});
        setShowSuccess(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <h1 className={styles.title}>ஶ்ரீவைஷ்ணவம் பற்றிய கேள்விகள்</h1>
                <p className={styles.subtitle}>
                    Ask any question you may have about Shrivaishnavam here.
                </p>

                {showSuccess && (
                    <div className={styles.successMessage}>
                        <p>Thank you for contacting us! If your question is selected we will publish it in the magazine with answer from experts.</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="query" className={styles.label}>
                            Your Message *
                        </label>
                        <textarea
                            id="query"
                            name="query"
                            value={formData.query}
                            onChange={handleInputChange}
                            placeholder="Please share your question, feedback, or message with us (maximum 250 characters)"
                            rows="5"
                            maxLength="250"
                            className={`${styles.textarea} ${errors.query ? styles.inputError : ''}`}
                        />
                        <div className={styles.charCount}>
                            {formData.query.length}/250 characters
                        </div>
                        {errors.query && <span className={styles.error}>{errors.query}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="name" className={styles.label}>
                            Your Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                        />
                        {errors.name && <span className={styles.error}>{errors.name}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="city" className={styles.label}>
                            Your City *
                        </label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="Enter your city"
                            className={`${styles.input} ${errors.city ? styles.inputError : ''}`}
                        />
                        {errors.city && <span className={styles.error}>{errors.city}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email_or_phone" className={styles.label}>
                            Contact Information (Optional)
                        </label>
                        <input
                            type="text"
                            id="email_or_phone"
                            name="email_or_phone"
                            value={formData.email_or_phone}
                            onChange={handleInputChange}
                            placeholder="Email address or phone number"
                            className={styles.input}
                        />
                        <p className={styles.optionalNote}>
                            Providing your contact information is optional but helps us respond to your message
                        </p>
                    </div>

                    <div className={styles.buttonGroup}>
                        <button
                            type="submit"
                            className={styles.submitButton}
                        >
                            Submit
                        </button>

                        <button
                            type="button"
                            onClick={handleReset}
                            className={styles.resetButton}
                        >
                            Clear Form
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}