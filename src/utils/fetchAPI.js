export const fetchAPI = async (url, method, body = null) => {
    const sideBody = {
        method: method,
        headers: { "Content-Type": "application/json" }
    };
    
    if (body) sideBody.body = JSON.stringify(body);

    const response = await fetch(url, sideBody);

    if (!response.ok) {
        console.error("API Error Status:", response.status);
        return false;
    }

    const rawData = await response.text();

    if (!rawData) return true;

    try {
        return JSON.parse(rawData);
    } catch (e) {
        return rawData;
    }
};