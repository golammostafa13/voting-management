import jwt from "jsonwebtoken";

export const createAccessToken = (payload: object) =>
    jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "5m" });

export const createRefreshToken = (payload: object) =>
    jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "20m" });
