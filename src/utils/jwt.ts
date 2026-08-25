// utils/jwt.ts
export interface DecodedToken {
    guidId: string;
    name: string;
    email: string;
    role: string;
    exp: number;
}

export function decodeToken(token: string): DecodedToken | null {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));

        const role =
            payload.role ||
            payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        const guidId =
            payload.guidId ||
            payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        const email =
            payload.email ||
            payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
        const name =
            payload.name ||
            payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/name"];

        if (!role || !guidId) return null;

        return { guidId, name, email, role: role.toLowerCase(), exp: payload.exp };
    } catch {
        return null;
    }
}

export function isTokenExpired(decoded: DecodedToken): boolean {
    return Date.now() >= decoded.exp * 1000;
}