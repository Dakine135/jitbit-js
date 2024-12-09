const http = require('node:http');
const url = require('node:url');

function dateToString(date) {
  const day = date.getDate().toString().padStart(2, 0);
  const month = (date.getMonth() + 1).toString().padStart(2, 0);
  const year = date.getFullYear().toString().padStart(4, 0);
  return `${year}-${month}-${day}`;
}

function asyncTimeout(ms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @description Class wrapper for jitbit rest api
 *  JITBIT Documentation
    https://www.jitbit.com/docs/api/
 * @date November 15 2024 11:11 am -0500
 * @class jitBit
 * @static ticketOrigins - Origin types
 * @static ticketPriorities - Priority types
 * @static ticketStatuses - Status types
 */
class jitBit {
  /**
   * @description Id/Value associated with Origin when creating a ticket
   * @date December 09 2024 14:12 pm -0500
   * @static
   * @memberof jitBit
   */
  static ticketOrigins = {
    WebApp: 0,
    Email: 1,
    Widget: 2,
    API: 3,
    Scheduler: 4,
    MobileApp: 5,
    Phone: 6,
    LiveChat: 7,
    InPerson: 8,
  };
  /**
   * @description Ticket Priority Levels and their ids
   * @date December 09 2024 14:12 pm -0500
   * @static
   * @memberof jitBit
   */
  static ticketPriorities = {
    Low: -1,
    Normal: 0,
    High: 1,
    Critical: 2,
  };
  /**
   * @description jitbit built-in ticket Statuses and their ids (look at url for id of custom Status types)
   * @date December 09 2024 14:12 pm -0500
   * @static
   * @memberof jitBit
   */
  static ticketStatuses = {
    New: 1,
    InProgress: 2,
    Closed: 3,
  };
  #baseUrl = null;
  #username = null;
  #password = null;
  #token = null;
  #isTest = false;
  #categoriesById = {};
  #categoriesByName = {};
  #categoriesBySectionId = {};
  #categoriesBySectionName = {};
  #cache = {};
  #cacheInterval = null;

  /**
   * Creates an instance of jitBit.
   * @date November 15 2024 11:11 am -0500
   * @param {Object} params
   * @param {String} params.baseUrl Usually something like http://{DOMAIN}/helpdesk/api
   * @param {String} params.username username for authentication (optional if token is provided)
   * @param {String} params.password password for authentication (optional if token is provided)
   * @param {String} params.token token for authentication (optional if username/password is provided) (You can get your token by visiting /User/Token/ page in the helpdesk app)
   * @param {Boolean} params.isTest disables network calls
   * @param {Number} params.cacheTimeToLive how long to cache results for in milliseconds (default 30,000)
   * @param {Number} params.cacheIntervalRate how often to check cache expiration in milliseconds (default 2000)
   * @param {Boolean} params.disableCaching Disabled Caching
   * @alias jitBit
   * @memberof jitBit
   */
  constructor({ baseUrl, username, password, token, isTest = false, cacheTimeToLive = 5000, cacheIntervalRate = 2000, disableCaching = false }) {
    this.#baseUrl = baseUrl;
    this.#username = username;
    this.#password = password;
    this.#token = token;
    this.#isTest = isTest;
    this.cacheTimeToLive = cacheTimeToLive;
    this.cacheIntervalRate = cacheIntervalRate;
    this.disableCaching = disableCaching;
  }

  /**
   * @description Internal private function to do the actual network call and response handling
   * @date November 13 2024 12:11 pm -0500
   * @param {Object} params
   * @param {String} params.endpoint URL endpoint after baseURL
   * @param {String} params.method GET, POST, ect
   * @param {Object} params.params Object for url params
   * @param {String} params.encoding Node Default
   * @param {*} params.postData Body of request when posting
   * @param {Boolean} params.ignoreCache will disable Caching for this request
   * @return {Object} {statusCode, statusMessage, responseHeaders, data, error}
   * @private
   */
  async #makeRequest({ endpoint, method, params = {}, encoding = null, postData, ignoreCache = false, retryTimeout = 500 }) {
    Object.entries(params).forEach(([key, value]) => {
      if (value instanceof Date) params[key] = dateToString(value);
    });

    const fullUrl = url.format({
      pathname: this.#baseUrl + endpoint,
      query: params,
    });

    if (!this.disableCaching && !ignoreCache && method === 'GET' && fullUrl in this.#cache) return this.#cache[fullUrl].data;

    let Authorization;
    if (this.#username && this.#password) Authorization = 'Basic ' + btoa(this.#username + ':' + this.#password);
    if (this.#token) Authorization = `Bearer ${this.#token}`;
    if (!Authorization) new Error('Missing Authorization, token or username/password combo');

    const headers = {
      Authorization,
      crossDomain: true,
    };

    if (this.#isTest) {
      console.log('Is in Test Mode, no network requests. Not sure how to create jitbit api test environment');
      return null;
    }

    const resultPromise = new Promise((resolve, reject) => {
      let statusCode,
        statusMessage,
        responseHeaders = null;
      const request = http.request(fullUrl, { method, headers }, (response) => {
        statusCode = response.statusCode;
        statusMessage = response.statusMessage;
        responseHeaders = response.headers;
        if (encoding) response.setEncoding(encoding);
        const chunks = [];
        response.on('data', (chunk) => {
          chunks.push(chunk);
        });
        response.on('end', () => {
          const body = Buffer.concat(chunks);
          try {
            const bodyParsed = JSON.parse(body);
            resolve({ statusCode, statusMessage, responseHeaders, data: bodyParsed });
          } catch (error) {
            resolve({ statusCode, statusMessage, responseHeaders, data: body });
          }
        });
      });

      request.on('error', (error) => {
        console.error(`problem with request: ${error.message}`);
        reject({ statusCode, statusMessage, responseHeaders, error });
      });

      if (method == 'POST' && postData) request.write(postData);
      request.end();
    });

    let results;
    await resultPromise.then((result) => {
      results = result;
      if (!this.disableCaching && method === 'GET' && !result.error && results.statusCode != 429) {
        this.#cache[fullUrl] = { data: result, ttl: this.cacheTimeToLive };
        if (!this.#cacheInterval) this.#cacheInterval = setInterval(this.#checkCache.bind(this), this.cacheIntervalRate);
      }
    });
    if (results && results.statusCode == 429) {
      if (retryTimeout > 30000) throw new Error('Too many retries, giving up');
      await asyncTimeout(retryTimeout);
      return this.#makeRequest({ endpoint, method, params, encoding, postData, ignoreCache, retryTimeout: retryTimeout * 2 });
    }
    return results;
  }

  #checkCache() {
    if (Object.keys(this.#cache).length == 0) {
      clearInterval(this.#cacheInterval);
      this.#cacheInterval = null;
      return;
    }
    for (const [key, { ttl }] of Object.entries(this.#cache)) {
      if (ttl > 0) this.#cache[key].ttl -= this.cacheIntervalRate;
      else delete this.#cache[key];
    }
  }

  /**
   * @description Get Tickets
   * @date November 13 2024 11:11 am -0500
   * @param {Object} params={}
   * @param {string} params.mode - (optional) Allows you to choose, which tickets to show: all (default) shows all tickets, including closed, unanswered shows new or updated by customer or for tech tickets, unclosed all active tickets, handledbyme shows tickets assigned to the user
   * @param {int[]} params.categoryId - (optional) Filter by a category, int or an Array of ints
   * @param {int} params.sectionId - (optional) Filter by a section
   * @param {int[]} params.statusId - (optional) Filter by statusID(s), int or an Array of ints. "New" is 1, "In process" is 2 "Closed" is 3. Check your custom status IDs in the admin area
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
   * @param {Boolean} params.fullDetails - (optional) Will call "getTicket" for each record returned, so you'll get full ticket details instead of just a summary. This will slow down the API call significantly.
   * @param {Boolean} ignoreCache - Ignore Cache
   * @return {Object[]} An Array of Ticket Objects, example below:
   * @example
      [
        {
        "IssueID": 382,
        "TicketID": 382,
        "Priority": 0,
        "StatusID": 1,
        "IssueDate": "2024-05-05T17:25:31.127Z",
        "Subject": "Test ticket",
        "Status": "In progress",
        "UpdatedByUser": false,
        "UpdatedByPerformer": false,
        "CategoryID": 21,
        "UserName": "admin",
        "Technician": null,
        "FirstName": "",
        "LastName": "",
        "DueDate": null,
        "TechFirstName": null,
        "TechLastName": null,
        "LastUpdated": "2024-05-06T10:24:13.873Z",
        "UpdatedForTechView": false,
        "UserID": 20,
        "CompanyID": null,
        "CompanyName": null,
        "AssignedToUserID": 1,
        "ResolvedDate": null,
        "SectionID": null,
        "Category": "test",
        "Origin": "WebApp",
        "Email": "admin@admin.lvm",
        "HasChildren": false,
        "LastUpdatedByUserID": 1,
        "LastUpdatedUsername": "",
        "StartDate": "2024-05-06T10:24:13.887Z"
        },
        //...more tickets
      ]
   */
  async getTickets(params = {}, ignoreCache = false) {
    const endpoint = '/tickets';
    const method = 'GET';

    const result = await this.#makeRequest({ endpoint, method, params, ignoreCache });
    if (result && result.error) throw new Error(error.message);
    if (result && result.statusCode == 200 && Array.isArray(result.data)) {
      if (params.fullDetails) {
        result.data = result.data.map(async ({ IssueID }) => {
          return await this.getTicket({ IssueID });
        });
        result.data = await Promise.all(result.data);
      }
      //No idea why, but there seems to be a discrepancy in jitbit API to use TicketID and IssueID interchangeably
      result.data = result.data.map((ticket) => {
        if (!ticket.IssueID) ticket.IssueID = ticket.TicketID;
        if (!ticket.TicketID) ticket.TicketID = ticket.IssueID;
        return ticket;
      });
      return result.data;
    } else return null;
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
   * @param {Boolean} ignoreCache - Ignore Cache
   * @return {Object}
   * @example
      {
        "Attachments": [
            {
                "FileName": "icon.png",
                "FileData": null,
                "FileID": 1740828,
                "CommentID": 12722431,
                "CommentDate": "2020-02-28T04:48:00Z",
                "FileHash": null,
                "FileSize": 0,
                "IssueID": 2431395,
                "UserID": 43499,
                "GoogleDriveUrl": null, //cloud URL (google, dropbox, onedrive etc)
                "ForTechsOnly": false,
                "Url": "https://support.jitbit.com/helpdesk/File/Get?id=1740828"
            }
        ],
        "Tags": [
            {
                "TagID": 14502,
                "Name": "tag1",
                "TagCount": 0
            }
        ],
        "Status": "In progress",
        "OnBehalfUserName": null,
        "SubmitterUserInfo": {
            "UserID": 43499,
            //more user info properties
        },
        "CategoryName": "General issues",
        "AssigneeUserInfo": {
            "UserID": 43499,
            //more user info properties
        },
        "TicketID": 2431395,
        "IssueID": 2431395,
        "UserID": 43499,
        "AssignedToUserID": 43499,
        "IssueDate": "2020-02-28T04:48:00Z",
        "Subject": "test",
        "Body": "test ticket",
        "Priority": 0,
        "StatusID": 2,
        "CategoryID": 7277,
        "DueDate": null,
        "ResolvedDate": null,
        "StartDate": "2020-02-28T04:48:00Z",
        "TimeSpentInSeconds": 143,
        "UpdatedByUser": false,
        "UpdatedByPerformer": true,
        "UpdatedForTechView": false,
        "IsCurrentUserTechInThisCategory": false,
        "IsCurrentCategoryForTechsOnly": false,
        "SubmittedByCurrentUser": true,
        "IsInKb": false,
        "Stats": null
      }
   */
  async getTicket(params = {}, ignoreCache = false) {
    const endpoint = '/ticket';
    const method = 'GET';

    if (params.id == null) params.id = params.ticketId;
    if (params.id == null) params.id = params.TicketID;
    if (params.id == null) params.id = params.issueId;
    if (params.id == null) params.id = params.IssueID;
    if (params.id == null) throw new Error('Missing ticket id');

    const result = await this.#makeRequest({ endpoint, method, params, ignoreCache });
    if (result && result.error) throw new Error(error.message);
    if (result && result.statusCode == 200) return result.data;
    else return null;
  }
  /**
   * @description delete ticket by ID
   * @date December 09 2024 11:11 pm -0500
   * @param {Object} params
   * @param {int} params.id - Ticket id
   * @param {int} params.ticketId - (Alias) Ticket id
   * @param {int} params.issueId - (Alias) Ticket id
   * @param {int} params.IssueID - (Alias) Ticket id
   * @param {int} params.TicketID - (Alias) Ticket id
   */
  async deleteTicket(params = {}) {
    const endpoint = '/deleteTicket';
    const method = 'POST';

    if (params.id == null) params.id = params.ticketId;
    if (params.id == null) params.id = params.TicketID;
    if (params.id == null) params.id = params.issueId;
    if (params.id == null) params.id = params.IssueID;
    if (params.id == null) throw new Error('Missing ticket id');

    const result = await this.#makeRequest({ endpoint, method, params });
    if (result && result.error) throw new Error(error.message);
    if (result && result.statusCode == 200) return result.data;
    else return null;
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
    const result = await this.#makeRequest({ endpoint, method, params });
    if (result && result.error) throw new Error(error.message);
    if (result && result.statusCode == 200) return result.data;
    else return null;
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
   * @param {int} params.userUsername (optional) - User-Username to create a ticket "on-behalf" of this user (requires technician permissions)
   * @param {int} params.userEmail (optional) - User-Email to create a ticket "on-behalf" of this user (requires technician permissions)
   * @param {string[]} params.tags (optional) - An Array of tags as strings
   * @param {int} params.origin (optional) - Where the ticket came from, i.e. sets the "via" field for the ticket. Can be one of: 0 (WebApp), 1 (Email), 2 (Widget), 3 (API), 4 (Scheduler), 5 (MobileApp), 6 (Phone), 7 (LiveChat), 8 (InPerson)
   * @param {int} params.assignedToUserId (optional) - User-ID to assign the ticket to (optional, requires technician permissions)
   * @param {int} params.assignedToUserUsername (optional) - User-Username to assign the ticket to (optional, requires technician permissions)
   * @param {int} params.assignedToUserEmail (optional) - User-Email to assign the ticket to (optional, requires technician permissions)
   * @param {Object} params.customFields (optional) - An object that contains custom field values for the ticket. Format { "ID1" : "value", "ID2" : "value" } where "ID" is the custom field's ID-number.
   * @param {bool} params.suppressConfirmation (optional) - Skip sending user confirmation email (useful when creating a ticket on behalf)
   * @param {bool} params.dryRun (optional) - looks up user and checks params, but does not create a ticket (no ticket id returned)
   * @return {int} returns the ticket ID if successful, otherwise null
   */
  async createTicket(params = {}) {
    const endpoint = '/ticket';
    const method = 'POST';

    let user, assignedToUser;
    if (params.userId || params.userUsername || params.userEmail) {
      user = await this.getUser({ userId: params.userId, username: params.userUsername, email: params.userEmail });
      if (!user) throw new Error(`No User Found for ${params.userId ?? params.userUsername ?? params.userEmail}`);
    }
    if (params.assignedToUserId || params.assignedToUserUsername || params.assignedToUserEmail) {
      assignedToUser = await this.getUser({
        userId: params.assignedToUserId,
        username: params.assignedToUserUsername,
        email: params.assignedToUserEmail,
      });
      if (!assignedToUser) throw new Error(`No User Found for ${params.userId ?? params.userUsername ?? params.userEmail}`);
    }

    if (params.tags && Array.isArray(params.tags)) params.tags = 'tags=' + params.tags.join(',');

    if (params.customFields && typeof params.customFields == 'object') params.customFields = JSON.stringify(params.customFields);

    if (user) params.userId = user.UserID;
    if (assignedToUser) params.assignedToUserId = assignedToUser.UserID;

    if (!params.dryRun) {
      const result = await this.#makeRequest({ endpoint, method, params });
      if (result && result.error) throw new Error(error.message);
      if (result && result.statusCode == 200) return result.data;
    }
    return null;
  }

  /**
   * @description lookup User, first result by userId, username, or email
   * @date December 04 2024 12:11 pm -0500
   * @param {Object} params
   * @param {int} params.userId (optional) - User-ID
   * @param {String} params.username (optional) - User's username
   * @param {String} params.email (optional) - User's email address
   * @return {Object} returns User Details
   * @example
   * {
      "UserID": 43499,
      "Username": "Max",
      "Password": null,
      "Email": "max@test",
      "FirstName": "Max",
      "LastName": "",
      "Notes": "test",
      "Location": "",
      "Phone": "+16463977708",
      "Department": null,
      "CompanyName": "Jitbit Software",
      "IPAddress": "213.229.75.25",
      "HostName": "213.229.75.25",
      "Lang": "en-US",
      "UserAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36",
      "AvatarURL": null,
      "Signature": "Cheers,\r\nMax",
      "Greeting": "Hi #FirstName#",
      "CompanyId": 451,
      "CompanyNotes": null,
      "IsAdmin": true,
      "Disabled": false,
      "SendEmail": false,
      "IsTech": false,
      "LastSeen": "2020-02-28T04:48:00Z",
      "IsManager": false,
      "PushToken": null,
      "FullNameAndLogin": "Max",
      "FullName": "Max"
    }
   */
  async getUser(params = {}) {
    let result;
    const method = 'GET';

    if (params.userId && !result) {
      if (typeof params.userId !== 'number') throw new Error('If looking up by userId, must be a number');
      const endpoint = '/User';
      result = await this.#makeRequest({ endpoint, method, params });
    }
    if (params.email && !result) {
      if (typeof params.email !== 'string') throw new Error('If looking up by email, must be a string');
      params.email = params.email.trim();
      const endpoint = '/UserByEmail';
      result = await this.#makeRequest({ endpoint, method, params });
    }
    if (!result && params.email && !params.username) params.username = params.email;
    if (params.username && !result) {
      if (typeof params.username !== 'string') throw new Error('If looking up by username, must be a string');
      params.username = params.username.trim();
      const endpoint = '/UserByUsername';
      result = await this.#makeRequest({ endpoint, method, params });
    }

    if (result && result.error) throw new Error(error.message);
    if (result && result.statusCode == 200) return result.data;
    else return null;
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
   * @return {Boolean} true if status is 200, otherwise false
   */
  async updateTicket(params = {}) {
    const endpoint = '/UpdateTicket';
    const method = 'POST';

    const result = await this.#makeRequest({ endpoint, method, params });
    if (result && result.error) throw new Error(error.message);
    if (result && result.statusCode == 200) return result.data;
    else return null;
  }

  /**
   * @description get all Categories
   * @date December 02 2024 15:50 pm -0500
   * @return {Object[]} Returns all categories the user has permissions to see
   * @example
    [
        {
            "CategoryID": 7277,
            "Name": "General issues",
            "SectionID": null,
            "Section": null,
            "NameWithSection": "General issues",
            "ForTechsOnly": false,
            "FromAddress": null
        }
      ]
   */
  async getCategories() {
    const endpoint = '/categories';
    const method = 'GET';

    const result = await this.#makeRequest({ endpoint, method });
    if (result && result.error) throw new Error(error.message);
    if (result && result.statusCode == 200 && result.data) {
      result.data.forEach((category) => {
        const { CategoryID, Name, SectionID, Section } = category;
        this.#categoriesById[CategoryID] = category;
        this.#categoriesByName[Name] = category;
        this.#categoriesBySectionId[SectionID] = category;
        this.#categoriesBySectionName[Section] = category;
      });
      return result.data;
    } else return null;
  }
}

module.exports = jitBit;
