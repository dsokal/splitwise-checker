import url from 'url';

import config from '../config';

export default class Client {
  constructor(apiToken) {
    this.apiToken = apiToken;
  }

  async get(path) {
    return this._request('GET', path);
  }

  async post(path, body) {
    const bodyJSON = JSON.stringify(body);
    return this._request('POST', path, { body: bodyJSON });
  }

  async _request(method, path, extraOptions = {}) {
    const absoluteUrl = this._formatUrl(path);
    const res = await fetch(absoluteUrl, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(this.apiToken && { Authorization: `Bearer ${this.apiToken}` }),
      },
      ...extraOptions,
    });
    return res.json();
  }

  _formatUrl(path) {
    return url.resolve(config.api.baseUrl, path);
  }
}
