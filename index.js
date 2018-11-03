let request = require('request-promise');

class XeroApi {
  constructor(username, password) {
    this.username = username;
    this.password = password;

    this.apiUrl = 'https://touch.xero.com';
    this.projectApi = 'https://projects-mobile.xero.com';

    this._headers = {
      'user-agent': 'Projects/255 CFNetwork/974.2.1 Darwin/18.0.0',
      'x-xero-version': 'XT 1.6.3(255) iOS'
    }

    this._defaultOpts = {
      method: 'GET'
    }
  }

  set headers(headers) {
    this._headers = Object.assign({}, this.headers, headers);
  }

  get headers() {
    return this._headers
  }

  set projectId(projectId) {
    this._projectId = projectId
  }

  get projectId() {
    return this._projectId
  }

  get options() {
    return Object.assign({ headers: this._headers }, this._defaultOpts)
  }

  authenticate() {
    let options = Object.assign({}, this.options, {
      uri: `${this.apiUrl}/apiv2/loginDevicev2`,
      method: 'POST',
      form: {
        'device': 'iPhone8,1',
        'appVersion': '1.6.3(255)',
        'platform': 'iOS',
        'platformVersion': '12.0.1',
        'userName': this.username,
        'password': this.password
      }
    });

    return request(options).then((data) => {
      const result = JSON.parse(data);
      this.headers = {
        'x-xero-sessionid': result.user.sessionID
      }

      return result;
    });
  }
 
  getProjects() {
    let options = Object.assign({}, this.options, {
      uri: `${this.projectApi}/api/projects`,
    });

    return request(options).then((data) => {
      const result = JSON.parse(data);
      return result;
    });
  }

  getProjectExpenses(projectId) {
    return new Promise((resolve, reject) => {
      if(!projectId) {
        return reject('you need to set a project id');
      }

      let options = Object.assign({}, this.options, {
        uri: `${this.projectApi}/api/projects/${projectId}/expenses?includeSummary=true`,
      });

      request(options).then((data) => {
        const result = JSON.parse(data);
        return resolve(result);
      }).catch((err) => {
        return reject(err);
      });
    })
  }

  async getAllInvoices() {
    let list = [];
    let version = '';
    let i = 0;

    do {
      const data = await new Promise((resolve, reject) => {
        let options = Object.assign({}, this.options, {
          uri: `${this.apiUrl}/apiv2/SourceDocuments/GetAll`,
          qs: {
            direction: 'forward',
            excludeNewExpenses: 'false',
            includeVoidDeleted: 'true',
            pagesize: '200',
            type: 'INVOICETYPE/ACCPAY',
            version: version
          }
        });

        request(options).then((data) => {
          const result = JSON.parse(data);

          if(result.invoices.length === 200) {
            version = result.maxTimestampForPage;
          } else {
            i++;
          }

          return resolve(result.invoices);
        }).catch((err) => {
          return reject(err);
        });
      })

      list = list.concat(data);
    } while (i < 1);

    return list;
  }
}

module.exports = XeroApi