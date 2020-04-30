const axios = require('axios');
const API_URL = 'http://localhost:1337';

export async function listLogEntries(){
    const response = await axios.get(`${API_URL}/api/logs`);
    return response;
}

export async function createLogEntries(entry) {
    const response = await axios.post(`${API_URL}/api/logs`, entry);
    return response;
}