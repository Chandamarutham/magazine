import React, { useState } from 'react';
import { useFormDataSubmitter } from './formDataSubmitter.jsx';

/**
 * Example component demonstrating how to use formDataSubmitter
 * This can be used as a template for creating forms that submit to the AWS API Gateway
 */
function ExampleErrorReportForm() {
  const [formData, setFormData] = useState({
    errorType: '',
    description: '',
    userEmail: '',
    pageUrl: window.location.href,
    timestamp: ''
  });

  const { submitData, isSubmitting, lastResult, clearResult } = useFormDataSubmitter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any previous results
    clearResult();

    // Add timestamp
    const dataToSubmit = {
      ...formData,
      timestamp: new Date().toISOString()
    };

    const result = await submitData(dataToSubmit);

    if (result.success) {
      // Reset form on success
      setFormData({
        errorType: '',
        description: '',
        userEmail: '',
        pageUrl: window.location.href,
        timestamp: ''
      });

      alert('Error report submitted successfully!');
    }
  };

  return (
    <div className="error-report-form">
      <h2>Error Report Form</h2>
      <p>This form demonstrates the formDataSubmitter component</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="errorType">Error Type:</label>
          <select
            id="errorType"
            name="errorType"
            value={formData.errorType}
            onChange={handleInputChange}
            required
          >
            <option value="">Select error type</option>
            <option value="ui-bug">UI Bug</option>
            <option value="performance">Performance Issue</option>
            <option value="functionality">Functionality Error</option>
            <option value="content">Content Error</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            placeholder="Please describe the error in detail..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="userEmail">Email (optional):</label>
          <input
            type="email"
            id="userEmail"
            name="userEmail"
            value={formData.userEmail}
            onChange={handleInputChange}
            placeholder="your-email@example.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="pageUrl">Page URL:</label>
          <input
            type="url"
            id="pageUrl"
            name="pageUrl"
            value={formData.pageUrl}
            onChange={handleInputChange}
            readOnly
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !formData.errorType || !formData.description}
          className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Error Report'}
        </button>
      </form>

      {/* Display submission results */}
      {lastResult && (
        <div className={`result-message ${lastResult.success ? 'success' : 'error'}`}>
          {lastResult.success ? (
            <p>✅ Error report submitted successfully!</p>
          ) : (
            <div>
              <p>❌ Failed to submit error report:</p>
              <p><strong>Error:</strong> {lastResult.error}</p>
              <details>
                <summary>Technical Details</summary>
                <pre>{JSON.stringify(lastResult.details, null, 2)}</pre>
              </details>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .error-report-form {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #f9f9f9;
        }

        .form-group {
          margin-bottom: 20px;
        }

        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          color: #333;
        }

        input, select, textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
          box-sizing: border-box;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #007cba;
          box-shadow: 0 0 5px rgba(0, 124, 186, 0.3);
        }

        .submit-button {
          background-color: #007cba;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .submit-button:hover:not(:disabled) {
          background-color: #005a87;
        }

        .submit-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .submit-button.submitting {
          background-color: #ffa500;
        }

        .result-message {
          margin-top: 20px;
          padding: 15px;
          border-radius: 4px;
        }

        .result-message.success {
          background-color: #d4edda;
          border: 1px solid #c3e6cb;
          color: #155724;
        }

        .result-message.error {
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
        }

        details {
          margin-top: 10px;
        }

        summary {
          cursor: pointer;
          font-weight: bold;
        }

        pre {
          background-color: #f8f9fa;
          padding: 10px;
          border-radius: 4px;
          overflow-x: auto;
          margin-top: 10px;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}

export default ExampleErrorReportForm;