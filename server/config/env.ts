import dotenv from 'dotenv';

dotenv.config();

const {
    SERVER_PORT,
    NODE_ENV,
    FRONTEND_URL,
    GOOGLE_MAIL_APP_EMAIL,
    GOOGLE_MAIL_APP_PASSWORD,
    CORS_ALLOWED_SITES,
} = process.env;

const envConfig = {
    SERVER_PORT,
    NODE_ENV,
    FRONTEND_URL,
    GOOGLE_MAIL_APP_EMAIL,
    GOOGLE_MAIL_APP_PASSWORD,
    CORS_ALLOWED_SITES,
}
export default envConfig;
