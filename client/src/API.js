const axios = require('axios');
// const API_URL = 'http://localhost:1337';
const API_URI = 'http://localhost:5000';

export async function listLogEntries(){
    const response = await axios.get(`${API_URI}/api/logs`);
    return response;
}

export async function createLogEntries(entry) {
    const response = await axios.post(`${API_URI}/api/logs`, entry);
    return response;
}