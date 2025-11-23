import { useState, useEffect } from 'react';
import { PostFormData } from '../../lib/PostFormData';
import styles from './QueryForm.module.css';

const relative_url = "/query";


export default function QueryForm({ getValidCredentials }) {
    const [formData, setFormData] = useState({
        query_topic: '',
        question_asked: '',
        name_of_person: '',
        name_of_city: '',
        email_or_phone: '',
    }); // Form field value
    const [errors, setErrors] = useState({}); // Validation errors & Field-specific errors
    const [isSubmitting, setIsSubmitting] = useState(false); // Submission state
    const [showSuccess, setShowSuccess] = useState(false); // Success message visibility for the form submission
    const [successMessage, setSuccessMessage] = useState(""); // Success message content for the form submission
    const [showError, setShowError] = useState(false); // Error message visibility for the form submission
    const [errorMessage, setErrorMessage] = useState(""); // Error message content for the form submission

    /* Effect Section */ 
    // Nothing in this form

    /* Helpers Section */
    const resetFormFields = () => {
        setFormData({
            query_topic: '',
            question_asked: '',
            name_of_person: '',
            name_of_city: '',
            email_or_phone: '',
        });
    }

    // Reset controlling states
    const resetControllingStates = () => {
        setErrors({});
        setShowSuccess(false);
        setSuccessMessage("");
        setShowError(false);
        setErrorMessage("");
        setIsSubmitting(false);
    };

    // Validation of form fields
    const validateForm = () => {
        const newErrors = {};

        if (!formData.query_topic.trim()) {
            newErrors.query_topic = 'Topic is required';
        }
        if (!formData.question_asked.trim()) {
            newErrors.question_asked = 'Query is required';
        } else if (formData.question_asked.length > 1000) {
            newErrors.question_asked = 'Query must be 1000 characters or less';
        }

        if (!formData.name_of_person.trim()) {
            newErrors.name_of_person = 'Your name is required';
        }

        if (!formData.name_of_city.trim()) {
            newErrors.name_of_city = 'Your city is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handling changes in input - nothing spectacular in this form
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

    // Handling form reset when the Clear Form button is clicked
    const handleReset = (e) => {
        e.preventDefault();
        resetFormFields();
        resetControllingStates();
    };

    // Submitting form data
    const handleSubmit = async (e) => {
        e.preventDefault();

        resetControllingStates();
        setIsSubmitting(true);

        // Validate form before submission
        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await PostFormData(
                relative_url,
                formData,
                getValidCredentials
            );
            if (!response.ok) {
                setShowError(true);
                setErrorMessage("Failed to submit query. Try again later.");
                setTimeout(() => setShowError(false), 5000);
            } else {
                resetFormFields();
                setShowSuccess(true);
                setSuccessMessage("Thank you for your question!");
                setTimeout(() => setShowSuccess(false), 5000);
            }
        } catch (error) {
            setShowError(true);
            setErrorMessage("Failed to submit query. Try again later.");
            setTimeout(() => setShowError(false), 5000);
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className={styles.container}>
            <div className={styles.formBox}>
                <h2 className={styles.formTamilTitle}>ஶ்ரீவைஷ்ணவம் பற்றிய கேள்விகள்</h2>
                <p className={styles.formSubtitle}>Ask any questions / doubts you have about Srivaishnavism. We will take those questions to scholars, get their responses and may publish them in the magazine with your name & city</p>
                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Query Topic Field */}
                    <div className={styles.formGroup}>
                        <label htmlFor="query_topic" className={styles.label}>
                            Topic *
                        </label>
                        <input
                            type="text"
                            id="query_topic"
                            name="query_topic"
                            value={formData.query_topic}
                            onChange={handleInputChange}
                            placeholder="Title for your query"
                            className={`${styles.input} ${errors.query_topic ? styles.inputError : ''}`}
                        />
                        {errors.query_topic && <span className={styles.error}>{errors.query_topic}</span>}
                    </div>

                    {/* Question Asked Field */}
                    <div className={styles.formGroup}>
                        <label htmlFor='question_asked' className={styles.label}>
                            Question *
                        </label>
                        <textarea
                            id='question_asked'
                            name='question_asked'
                            value={formData.question_asked}
                            onChange={handleInputChange}
                            placeholder="Please enter the  question (maximum 1000 characters)"
                            rows="8"
                            maxLength={1000}
                            className={`${styles.textarea} ${errors.question_asked ? styles.inputError : ''}`}
                        />
                        <div className={styles.charCount}>
                            {formData.question_asked.length}/1000 characters
                        </div>
                        {errors.question_asked && <span className={styles.error}>{errors.question_asked}</span>}
                    </div>

                    {/* Name of Person Field */}
                    <div className={styles.formGroup}>
                        <label htmlFor="name_of_person" className={styles.label}>
                            Your Name *
                        </label>
                        <input
                            type="text"
                            id="name_of_person"
                            name="name_of_person"
                            value={formData.name_of_person}
                            onChange={handleInputChange}
                            placeholder="Enter your name"
                            className={`${styles.input} ${errors.name_of_person ? styles.inputError : ''}`}
                        />
                        {errors.name_of_person && <span className={styles.error}>{errors.name_of_person}</span>}
                    </div>

                    {/* Name of City Field */}
                    <div className={styles.formGroup}>
                        <label htmlFor="name_of_city" className={styles.label}>
                            Your City *
                        </label>
                        <input
                            type="text"
                            id="name_of_city"
                            name="name_of_city"
                            value={formData.name_of_city}
                            onChange={handleInputChange}
                            placeholder="Enter the name of your city"
                            className={`${styles.input} ${errors.name_of_city ? styles.inputError : ''}`}
                        />
                        {errors.name_of_city && <span className={styles.error}>{errors.name_of_city}</span>}
                    </div>

                    {/* Email or Phone Field */}
                    <div className={styles.formGroup}>
                        <label htmlFor="email_or_phone" className={styles.label}>
                            Email or Phone
                        </label>
                        <input
                            type="text"
                            id="email_or_phone"
                            name="email_or_phone"
                            value={formData.email_or_phone}
                            onChange={handleInputChange}
                            placeholder="Optional information to reach you; we won't spam you"
                            className={`${styles.input} ${errors.email_or_phone ? styles.inputError : ''}`}
                        />
                        {errors.email_or_phone && <span className={styles.error}>{errors.email_or_phone}</span>}
                    </div>
                    {/* ------------ */}
                    {/* Form Buttons */}
                    {/* ------------ */}
                    <div className={styles.buttonGroup}>
                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={`${styles.submitButton} ${isSubmitting ? styles.buttonDisabled : ''}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Sending...' : 'Submit'}
                        </button>

                        {/* Clear Button */}
                        <button
                            type="button"
                            className={`${styles.clearButton} ${isSubmitting ? styles.buttonDisabled : ''}`}
                            onClick={handleReset}
                            disabled={isSubmitting}
                        >
                            Clear Form
                        </button>
                    </div>
                    {showSuccess && <div className={styles.successMessage}><p>{successMessage}</p></div>}
                    {showError && <div className={styles.errorMessage}><p>{errorMessage}</p></div>}
                </form>
            </div>
        </div>
    );
}