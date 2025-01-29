export const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const isOtpValid = (otpCreationTime: Date, expiresIn: number = 10) => {
    const currentTime = new Date();
    const diffMinutes = (currentTime.getTime() - otpCreationTime.getTime()) / 1000 / 60;
    return diffMinutes <= expiresIn;
};
