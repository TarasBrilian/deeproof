import Mailjet from 'node-mailjet';

// Lazy-initialized Mailjet client
let mailjetClient = null;

/**
 * Get or initialize Mailjet client
 * Uses lazy initialization to ensure env variables are loaded
 */
function getMailjetClient() {
    if (!mailjetClient) {
        mailjetClient = Mailjet.apiConnect(
            process.env.MAILJET_API_KEY,
            process.env.MAILJET_SECRET_KEY
        );
    }
    return mailjetClient;
}

/**
 * Send magic link verification email
 * @param {string} email - Recipient email address
 * @param {string} magicLinkUrl - Magic link URL
 * @returns {Promise<Object>} - Mailjet response
 */
export async function sendMagicLinkEmail(email, magicLinkUrl) {
    const mailjet = getMailjetClient();

    const request = await mailjet
        .post('send', { version: 'v3.1' })
        .request({
            Messages: [
                {
                    From: {
                        Email: process.env.MAILJET_FROM_EMAIL,
                        Name: process.env.MAILJET_FROM_NAME
                    },
                    To: [{ Email: email }],
                    Subject: 'Verify your email - Deeproof Protocol',
                    HTMLPart: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                            <h2 style="color: #D97706;">Deeproof Protocol</h2>
                            <p>Click the button below to verify your email and complete your identity binding:</p>
                            <a href="${magicLinkUrl}" style="display: inline-block; background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">Verify Email</a>
                            <p style="color: #666; font-size: 14px;">This link expires in 15 minutes.</p>
                            <p style="color: #666; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                            <p style="color: #999; font-size: 11px;">Deeproof Protocol - Deep Verification, Zero Disclosure.</p>
                        </div>
                    `,
                    TextPart: `Verify your email for Deeproof Protocol: ${magicLinkUrl}\n\nThis link expires in 15 minutes.`
                }
            ]
        });

    console.log('Magic link email sent:', request.body);
    return request;
}

