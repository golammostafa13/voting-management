import envConfig from './env';
const whitelist: Set<string | undefined> = new Set(envConfig.CORS_ALLOWED_SITES?.split(','));

const isOriginAllowed = (origin: string | undefined): boolean => {
    return whitelist.has(origin?.toLowerCase());
};

const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (isOriginAllowed(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200,
    credentials: true
};

export default corsOptions;

