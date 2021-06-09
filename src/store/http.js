import axois from 'axios';

export default class Http {
    host = 'http://180.76.154.189:5000';

    get(uri, query, options) {
        console.log(uri, query)
        axois.get(`${this.host}/${uri}`, { params: query })
        .then(res => {
            return res.data;
        })
    }

    post(uri, query, options) {
        return axois.post(`${this.host}/${uri}`, query, { headers: { 'Content-Type': 'application/json' } })
        .then(res => {
            return res.data;
        })
    }
}