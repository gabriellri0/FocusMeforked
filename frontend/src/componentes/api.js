const isLocalhost = window. location. hostname == "localhost";

export const baseURL = isLocalhost
? "http://localhost:8000/" // Localhost
: "https://focusmeforked-production.up.railway.app";