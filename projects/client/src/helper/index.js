export const checkEmail = (email) => {
    let domain = /\.(com|id|co.id|org|gov|ac.id|my.id|xyz|tv)/;
    if (email.includes('@') && email.match(domain)) {
        return true;
    } else {
        return false;
    }
};

// export const API_URL = "http://localhost:2000";
export const API_URL = "http://localhost:8000";