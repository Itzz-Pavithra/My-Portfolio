/* 
   ==========================================================================
   PAVITHRA J - EMAIL SERVICE MODULE (EMAILJS INTEGRATION)
   ==========================================================================
*/

const EmailService = (() => {
    // EmailJS credentials - Secure configuration placeholders
    // User should replace these placeholders with actual values from the EmailJS dashboard.
    const CONFIG = {
        PUBLIC_KEY: 'Od62V0iLp_CAnonhr',
        SERVICE_ID: 'service_aj12jal',
        TEMPLATE_ID: 'template_ex1i7dm'
    };

    /**
     * Initializes EmailJS SDK if a valid Public Key is configured.
     */
    const init = () => {
        if (isConfigured()) {
            emailjs.init(CONFIG.PUBLIC_KEY);
            console.log('EmailJS initialized successfully.');
        } else {
            console.warn('EmailJS: Config placeholders are not set. Running in simulation mode.');
        }
    };

    /**
     * Validates form fields on the client-side.
     * @param {string} name 
     * @param {string} email 
     * @param {string} subject 
     * @param {string} message 
     * @returns {Object} { isValid: boolean, errorMsg: string }
     */
    const validateFields = (name, email, subject, message) => {
        if (!name || name.trim() === '') {
            return { isValid: false, errorMsg: 'Please enter your name.' };
        }
        if (!email || email.trim() === '' || !isValidEmail(email)) {
            return { isValid: false, errorMsg: 'Please enter a valid email address.' };
        }
        if (!subject || subject.trim() === '') {
            return { isValid: false, errorMsg: 'Please enter a subject.' };
        }
        if (!message || message.trim() === '') {
            return { isValid: false, errorMsg: 'Please write your message.' };
        }
        return { isValid: true, errorMsg: '' };
    };

    /**
     * Checks if email address is in valid format.
     * @param {string} email 
     * @returns {boolean}
     */
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    /**
     * Checks if actual credentials have been provided instead of placeholders.
     * @returns {boolean}
     */
    const isConfigured = () => {
        return (
            CONFIG.PUBLIC_KEY && CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' &&
            CONFIG.SERVICE_ID && CONFIG.SERVICE_ID !== 'YOUR_SERVICE_ID' &&
            CONFIG.TEMPLATE_ID && CONFIG.TEMPLATE_ID !== 'YOUR_TEMPLATE_ID'
        );
    };

    /**
     * Sends the contact form message asynchronously using EmailJS.
     * Integrates anti-spam validation check.
     * @param {Object} formData 
     * @returns {Promise<any>}
     */
    const send = async (formData) => {
        const { name, email, subject, message } = formData;

        // Perform validation
        const validation = validateFields(name, email, subject, message);
        if (!validation.isValid) {
            throw new Error(validation.errorMsg);
        }

        const submissionDate = new Date().toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            dateStyle: 'full',
            timeStyle: 'medium'
        });

        // Parameters sent to EmailJS template variables
        const templateParams = {
            from_name: name.trim(),
            from_email: email.trim(),
            subject: subject.trim(),
            message: message.trim(),
            submission_date: submissionDate,
            to_email: 'pavithra.workss@gmail.com'
        };

        // Fallback simulation mode if placeholders are not configured
        if (!isConfigured()) {
            console.log('Simulating email sending with parameters:', templateParams);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Simulate random anti-spam fail or success
                    if (name.toLowerCase().includes('spam-test')) {
                        reject(new Error('Anti-spam validation failed. Please try again.'));
                    } else {
                        resolve({ status: 200, text: 'Simulation Success' });
                    }
                }, 1500);
            });
        }

        // Production direct call
        try {
            return await emailjs.send(CONFIG.SERVICE_ID, CONFIG.TEMPLATE_ID, templateParams);
        } catch (error) {
            console.error('EmailJS SDK Error:', error);
            throw new Error(error.message || 'Failed to transmit message through EmailJS API.');
        }
    };

    return {
        init,
        send
    };
})();

// Auto initialize on script load
EmailService.init();
