import axois from 'axios';

export default class Http {
    host = 'http://';

    get(uri, query, options) {
        return axois.get(`${this.host}/${uri}`, { params: query }).then(res => {
            return res.data;
        })
    }

    post(uri, query, options) {
        return axois.post(`${this.host}/${uri}`, query, { headers: { 'Content-Type': 'application/json' } }).then(res => {
            return res.data;
        })
    }
}