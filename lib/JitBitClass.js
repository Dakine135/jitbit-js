const http = require('node:http');

function dateToString(date) {
  const day = date.getDate().toString().padStart(2, 0);
  const month = (date.getMonth() + 1).toString().padStart(2, 0);
  const year = date.getFullYear().toString().padStart(4, 0);
  return `${year}-${month}-${day}`;
}

/**
 * @description Class wrapper for jitbit rest api
 *  JITBIT Documentation
    https://www.jitbit.com/docs/api/
 * @date November 15 2024 11:11 am -0500
 * @class jitBit
 */
class jitBit {
  /**
   * Creates an instance of jitBit.
   * @date November 15 2024 11:11 am -0500
   * @param {Object} params
   * @param {String} params.baseUrl Usually something like http://{DOMAIN}/helpdesk/api
   * @param {String} params.username username for authentication (optional if token is provided)
   * @param {String} params.password password for authentication (optional if token is provided)
   * @param {String} params.token token for authentication (optional if username/password is provided) (You can get your token by visiting /User/Token/ page in the helpdesk app)
   * @memberof jitBit
   */
  constructor({ baseUrl, username, password, token, isTest = false }) {
    this.baseUrl = baseUrl;
    this.username = username;
    this.password = password;
    this.token = token;
    this.isTest = isTest;
  }

  /**
   * @description Internal private function to do the actual network call and response handling
   * @date November 13 2024 12:11 pm -0500
   * @param {Object} params{ endpoint, method, params }
   * @return {*}
   * @private
   */
  async #makeRequest({ endpoint, method, params, encoding = null, postData }) {
    if (this.isTest) {
      console.log('Is in Test Mode, no network requests. Not sure how to test create jitbit api test environment');
      return null;
    }
    const url = this.baseUrl + endpoint;

    Object.entries(params).forEach(([key, value]) => {
      if (value instanceof Date) params[key] = dateToString(value);
    });

    let Authorization;
    if (this.username && this.password) Authorization = 'Basic ' + btoa(this.username + ':' + this.password);
    if (this.token) Authorization = `Bearer ${this.token}`;
    if (!Authorization) new Error('Missing Authorization, token or username/password combo');

    const headers = {
      Authorization,
      crossDomain: true,
    };

    return new Promise((resolve, reject) => {
      const request = http.request(url, { method, headers }, (response) => {
        if (encoding) response.setEncoding(encoding);
        const chunks = [];
        response.on('data', (chunk) => {
          chunks.push(chunk);
        });
        response.on('end', () => {
          const body = Buffer.concat(chunks);
          try {
            const bodyParsed = JSON.parse(body);
            resolve(bodyParsed);
          } catch (error) {
            resolve(body);
          }
        });
      });

      request.on('error', (error) => {
        console.error(`problem with request: ${error.message}`);
        reject(error);
      });

      if (method == 'POST' && postData) request.write(postData);
      request.end();
    });
  }
  /**
   * @description Get Tickets
   * @date November 13 2024 11:11 am -0500
   * @param {Object} params={}
   * @param {string} params.mode - (optional) Allows you to choose, which tickets to show: all (default) shows all tickets, including closed, unanswered shows new or updated by customer or for tech tickets, unclosed all active tickets, handledbyme shows tickets assigned to the user
   * @param {int[]} params.categoryId - (optional) Filter by a category, you can pass an array like this: ?categoryId=1&categoryId=2
   * @param {int} params.sectionId - (optional) Filter by a section
   * @param {int[]} params.statusId - (optional) Filter by status(es), you can pass an array like this: ?statusId=1&statusId=2
   * @param {int} params.fromUserId - (optional) Filter by a ticket creator
   * @param {int} params.fromCompanyId - (optional) Filter by a company
   * @param {int} params.handledByUserID - (optional) Filter by a ticket performer
   * @param {string} params.tagName - (optional) Filter by ticket a tag
   * @param {string} params.dateFrom - (optional) Filter by creation date (date format should be YYYY-MM-DD, for example 2016-11-24)
   * @param {string} params.dateTo - (optional) Filter by creation date (date format should be YYYY-MM-DD, for example 2016-11-24)
   * @param {string} params.updatedFrom - (optional) Filter by "last updated" date (date format should be YYYY-MM-DD, for example 2016-11-24)
   * @param {string} params.updatedTo - (optional) Filter by "last updated" date (date format should be YYYY-MM-DD, for example 2016-11-24)
   * @param {int} params.dueInDays - (optional) Filter by "due in X days"
   * @param {bool} params.includeCustomFields - (optional) Add custom field values to the output
   * @param {bool} params.subscribedOnly - (optional) Only return tickets you are subscribed to
   * @param {int} params.count - (optional) How many tickets to return. Default: 10. Max: 300.
   * @param {int} params.offset - (optional) Use this to create paging. For example "offset=20&count=20" will return the next 20 tickets after the first 20. Default: 0.
   * @return {Array}
   */
  async getTickets(params = {}) {
    const endpoint = '/tickets';
    const method = 'GET';

    return await this.#makeRequest({ endpoint, method, params });
  }

  /**
   * @description get details of one specific ticket by ID
   * @date November 13 2024 12:11 pm -0500
   * @param {Object} params
   * @param {int} params.id - Ticket id
   * @param {int} params.ticketId - (Alias) Ticket id
   * @param {int} params.issueId - (Alias) Ticket id
   * @param {int} params.IssueID - (Alias) Ticket id
   * @param {int} params.TicketID - (Alias) Ticket id
   * @return {*}
   */
  async getTicket(params = {}) {
    const endpoint = '/ticket';
    const method = 'GET';

    if (params.id == null) params.id = params.ticketId;
    if (params.id == null) params.id = params.TicketID;
    if (params.id == null) params.id = params.issueId;
    if (params.id == null) params.id = params.IssueID;
    if (params.id == null) throw new Error('Missing ticket id');

    return await this.#makeRequest({ endpoint, method, params });
  }

  /**
   * @description Allows you to download an individual file attachment
   * @date November 13 2024 12:11 pm -0500
   * @param {Object} params
   * @param {int} params.id - File attachment ID
   * @param {int} params.AttachmentID - (Alias) File attachment ID
   * @param {int} params.attachmentId - (Alias) File attachment ID
   * @param {int} params.fileId - (Alias) File attachment ID
   * @param {int} params.FileID - (Alias) File attachment ID
   * @return {Buffer} The requested file attachment as a file Buffer.
   */
  async getAttachment(params = {}) {
    const endpoint = '/attachment';
    const method = 'GET';

    if (params.id == null) params.id = params.fileId;
    if (params.id == null) params.id = params.FileID;
    if (params.id == null) params.id = params.AttachmentID;
    if (params.id == null) params.id = params.attachmentId;
    if (params.id == null) throw new Error('Missing file/attachment id');

    //Look at the "Content-Type" header for the file type. You can find the file name in the "Content-disposition" header.
    return await this.#makeRequest({ endpoint, method, params });
  }

  /**
   * @description create a ticket
   * @date November 13 2024 12:11 pm -0500
   * @param {Object} params
   * @param {int} params.categoryId - Category ID
   * @param {string} params.body - Ticket body
   * @param {string} params.subject - Ticket subject
   * @param {int} params.priorityId - Ticket priority. Values: <li>-1 – Low</li><li>0 – Normal</li><li>1 – High</li><li>2 – Critical</li>
   * @param {int} params.userId (optional) - User-ID to create a ticket "on-behalf" of this user (requires technician permissions)
   * @param {string} params.tags (optional) - A string of tags separated by comma. Example: tags=tag1,tag2,tag3
   * @param {int} params.origin (optional) - Where the ticket came from, i.e. sets the "via" field for the ticket. Can be one of: 0 (WebApp), 1 (Email), 2 (Widget), 3 (API), 4 (Scheduler), 5 (MobileApp), 6 (Phone), 7 (LiveChat), 8 (InPerson)
   * @param {int} params.assignedToUserId (optional) - User-ID to assign the ticket to (optional, requires technician permissions)
   * @param {string} params.customFields (optional) - A JSON-string that contains custom field values for the ticket. Format { "ID1" : "value", "ID2" : "value" } where "ID" is the custom field's ID-number.
   * @param {bool} params.suppressConfirmation (optional) - Skip sending user confirmation email (useful when creating a ticket on behalf)
   * @return {*}
   */
  async createTicket(params = {}) {
    const endpoint = '/ticket';
    const method = 'POST';

    return await this.#makeRequest({ endpoint, method, params });
  }

  /**
   * @description update one or more tickets
   * @date November 13 2024 12:11 pm -0500
   * @param {Object} params
   * @param {int} params.id - Ticket ID
   * @param {int} params.categoryId - (optional) Ticket category
   * @param {int} params.priority - (optional) Ticket priority. Values: -1 Low, 0 Normal, 1 High, 2 Critical
   * @param {DateTime} params.date - (optional) Ticket creation date
   * @param {int} params.userId - (optional) Ticket submitter's user ID
   * @param {DateTime} params.dueDate - (optional) Due date
   * @param {int} params.assignedUserId - (optional) Assigned technician's ID. Set to 0 (zero) to remove the currently assigned user.
   * @param {int} params.timeSpentInSeconds - (optional) Time spent on the ticket
   * @param {int} params.statusId - (optional) Ticket status ID. "Closed" id 3, "New" is 1, "In process" is 2. Check your custom status IDs in the admin area
   * @param {string} params.tags - (optional) A comma-separated list of tags to apply to the ticket. Like tags=tag1,tag2,tag3. All existing tags will be removed
   * @param {string} params.subject - (optional) Ticket subject
   * @param {string} params.body - (optional) Ticket body
   * @return {*}
   */
  async updateTicket(params = {}) {
    const endpoint = '/UpdateTicket';
    const method = 'POST';

    return await this.#makeRequest({ endpoint, method, params });
  }
}

module.exports = jitBit;
