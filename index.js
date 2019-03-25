let request = require('request-promise');
const Contact = require('./classes/user');
const Invoice = require('./classes/invoice');
const { GraphQLClient } = require('graphql-request')

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

  getOrganisations() {
    return new Promise((resolve, reject) => {
      let options = Object.assign({}, this.options, {
        uri: `${this.apiUrl}/apiv2/Organisations?includeAllOrganisations=true&page=1&pageSize=10`,
      });

      request(options).then((data) => {
        const result = JSON.parse(data);
        return resolve(result);
      }).catch((err) => {
        return reject(err);
      });
    })
  }

  getCutDownReferenceData() {
    return new Promise((resolve, reject) => {
      let options = Object.assign({}, this.options, {
        uri: `${this.apiUrl}/apiv2/Dashboard/getCutDownReferenceData?includeAccounts=true&includeBankAccounts=false&includeContacts=false&includeDashboard=false`,
      });

      request(options).then((data) => {
        const result = JSON.parse(data);
        return resolve(result);
      }).catch((err) => {
        return reject(err);
      });
    })
  }

  getAccounts() {
    return new Promise((resolve, reject) => {
      const endpoint = `${this.apiUrl}/apiv2/graphql`
      const headers = {
        headers: this.headers,
      }

      const graphQLClient = new GraphQLClient(endpoint, headers)

      const query = /* GraphQL */ `
        query Accounts($orgId: String) {
          accounts: accounts(orgId: $orgId) {
            accountID,
            code,
            name,
            status,
            taxType,
            class,
            enablePaymentsToAccount,
            showInExpenseClaims,
            hasAttachments,
            updatedDateUTC,
            bankAccountNumber,
            bankAccountType,
            currencyCode,
            systemAccount
          }
        }
      `

      const variables = {
        orgId: headers.headers.organisationid
      }

      graphQLClient.request(query, variables).then((data) => {
        return resolve(data);
      }).catch((err) => {
        return reject(err);
      })
    })
  }

  createContact(contactData, postAddress, phone) {
    return new Promise((resolve, reject) => {
      let contact = new Contact(contactData);
      contact.setPostAddress(postAddress);
      contact.setDefaultPhone(phone);

      let options = Object.assign({}, this.options, {
        uri: `${this.apiUrl}/apiv2/Contacts/saveContact`,
        method: 'POST',
        form: contact
      });

      request(options).then((data) => {
        const result = JSON.parse(data);

        return resolve(result);
      }).catch((err) => {
        return reject(err);
      });
    })
  }

  getNextInvoiceNumber() {
    return new Promise((resolve, reject) => {
      let options = Object.assign({}, this.options, {
        uri: `${this.apiUrl}/apiv2/Invoices/getNextInvoiceNumber`,
      });

      request(options).then((data) => {
        const result = JSON.parse(data);
        return resolve(result);
      }).catch((err) => {
        return reject(err);
      });
    })
  }

  getInvoiceEmail(invoiceId, defaultTemplate = true) {
    return new Promise(async (resolve, reject) => {
      const defaultData = await this.getCutDownReferenceData();
      const emailTemplate = defaultData.emailTemplates.find((x) => { return x.type === 'EMAILTYPE/INVOICE' && x.defaultTemplate === defaultTemplate});

      let options = Object.assign({}, this.options, {
        uri: `${this.apiUrl}/apiv2/Invoices/getInvoiceEmail?emailTemplateID=${emailTemplate.id}&invoiceID=${invoiceId}`,
      });

      request(options).then((data) => {
        const result = JSON.parse(data);
        return resolve(result);
      }).catch((err) => {
        return reject(err);
      });
    })
  }

  sendInvoice(email) {
    return new Promise(async (resolve, reject) => {
      const defaultData = await this.getCutDownReferenceData();
      const emailTemplate = defaultData.emailTemplates.find((x) => { return x.type === 'EMAILTYPE/INVOICE'});

      email.cc = true;
      email.includePDF = true;
      email.includeFiles = true;
      email.emailTemplateId = emailTemplate.id;
      email.x2x = false;

      delete email.canXero2Xero;
      delete email.id;

      let options = Object.assign({}, this.options, {
        uri: `${this.apiUrl}/apiv2/Invoices/sendInvoice`,
        method: 'POST',
        form: email
      });

      request(options).then((data) => {
        const result = JSON.parse(data);

        return resolve(result);
      }).catch((err) => {
        return reject(err);
      });
    })
  }

  createInvoice(invoiceData, lineItems) {
    return new Promise(async (resolve, reject) => {
      const invoiceNumber = await this.getNextInvoiceNumber();
      const defaultData = await this.getCutDownReferenceData();

      const invoice = new Invoice(invoiceNumber.invoiceNumber, defaultData, invoiceData);

      lineItems.forEach((lineItem) => {
        invoice.addLineItem(lineItem)
      })

      let options = Object.assign({}, this.options, {
        uri: `${this.apiUrl}/apiv2/Invoices/saveInvoiceAsApproved`,
        method: 'POST',
        form: invoice.invoice
      });

      request(options).then((data) => {
        const result = JSON.parse(data);

        return resolve(result);
      }).catch((err) => {
        return reject(err);
      });
    })
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

  getDashboard() {
    return new Promise((resolve, reject) => {
      let options = Object.assign({}, this.options, {
        uri: `${this.apiUrl}/apiv2/Dashboard/getDashboard`,
      });

      request(options).then((data) => {
        const result = JSON.parse(data);
        return resolve(result);
      }).catch((err) => {
        return reject(err);
      });
    })
  }

  getContactByEmail(emailAddress) {
    return new Promise((resolve, reject) => {
      this.getContacts().then((data) => {
        var object = data.contacts.find((object) => {
          return object.emailAddress && object.emailAddress.toLowerCase() === emailAddress.toLowerCase()
        })

        return resolve(object);
      })
    })
  }

  getContacts() {
    return new Promise((resolve, reject) => {
      let options = Object.assign({}, this.options, {
        uri: `${this.apiUrl}/apiv2/contacts/contactsforofflinesync?pageSize=3000`,
      });

      request(options).then((data) => {
        const result = JSON.parse(data);
        return resolve(result);
      }).catch((err) => {
        return reject(err);
      });
    })
  }

  getStatementLines(bankAccountId) {
    return new Promise((resolve, reject) => {
      if(!bankAccountId) {
        return reject('you need to set a bank account id');
      }

      let options = Object.assign({}, this.options, {
        uri: `${this.apiUrl}/apiv2/Bank/getStatementLines`,
        qs: {
          bankaccountID: bankAccountId,
          limit: 500,
          page: 1,
          start: 0,
          status: 'reconsiled'
        }
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