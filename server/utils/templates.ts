export const otpTemplate = (otp: string) => {
    return `
        <div style="text-align: center; font-family: Arial, sans-serif;">
        <h1 style="color: #333;">Your OTP Code</h1>
        <p style="font-size: 20px; color: #555;">Your OTP code is:</p>
        <h2 style="font-size: 36px; color: #007BFF;">${otp}</h2>
        <p style="font-size: 16px; color: #777;">Please enter this code to verify your account.</p>
        </div>
    `;
}