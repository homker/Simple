export default class BaseStore {
    constructor(baseUrl, method, body) {
        this.baseUrl = baseUrl;
        this.method = 'get';
        this.body = body;
    }

    setUrl(url) {
        this.url = url;
    }

    setMethod(method) {
        this.method = method;
    }

    setBody(body) {
        this.body = body;
    }

    checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return response;
        } else {
            var err = new Error(response.statusText);
            err.response = response;
            throw err;
        }
    }

    parse2Json(response) {
        return response.json();
    }

    getFetch(url, method, body) {
        var postObj = method === 'get' ? {} : {
            method: 'post',
            'header': {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        };
        return fetch(url, Object.assign({}, postObj, {
            credentials: 'include' //跨域支持
        }))
            .then(this.checkStatus)
            .then(this.parse2Json);
    }

    get() {
        return this.getFetch(this.url, this.method, this.body);
    }

}
