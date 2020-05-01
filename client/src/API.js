const axios = require('axios');
// const API_URL = 'http://localhost:1337';

export async function listLogEntries(){
    const response = await axios.get(`/api/logs`);
    return response;
}

export async function createLogEntries(entry) {
    const response = await axios.post(`/api/logs`, entry);
    return response;
}