# jitbit-js
  ZERO Dependencies Javascript Wrapper for the [Jitbit REST API](https://www.jitbit.com/docs/api/)
  <a name="jitBit"></a>

## .jitBit
**Kind**: static class  
**Date**: November 15 2024 11:11 am -0500  

* [.jitBit](#jitBit)
    * [new jitBit()](#new_jitBit_new)
    * _instance_
        * [.getTickets(params)](#jitBit+getTickets) ⇒ <code>Array.&lt;Object&gt;</code>
        * [.getTicket(params)](#jitBit+getTicket) ⇒ <code>Object</code>
        * [.getAttachment(params)](#jitBit+getAttachment) ⇒ <code>Buffer</code>
        * [.createTicket(params)](#jitBit+createTicket) ⇒ <code>int</code>
        * [.getUser(params)](#jitBit+getUser) ⇒ <code>Object</code>
        * [.updateTicket(params)](#jitBit+updateTicket) ⇒ <code>Boolean</code>
        * [.getCategories()](#jitBit+getCategories) ⇒ <code>Array.&lt;Object&gt;</code>
    * _static_
        * [.jitBit](#jitBit.jitBit)
            * [new jitBit(params)](#new_jitBit.jitBit_new)

<a name="new_jitBit_new"></a>

### new jitBit()
Class wrapper for jitbit rest api JITBIT Documentation
    https://www.jitbit.com/docs/api/

<a name="jitBit+getTickets"></a>

### jitBit.getTickets(params) ⇒ <code>Array.&lt;Object&gt;</code>
Get Tickets

**Kind**: instance method of [<code>jitBit</code>](#jitBit)  
**Returns**: <code>Array.&lt;Object&gt;</code> - An Array of Ticket Objects, example below:  
**Date**: November 13 2024 11:11 am -0500  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| params | <code>Object</code> | <code>{}</code> |  |
| params.mode | <code>string</code> |  | (optional) Allows you to choose, which tickets to show: all (default) shows all tickets, including closed, unanswered shows new or updated by customer or for tech tickets, unclosed all active tickets, handledbyme shows tickets assigned to the user |
| params.categoryId | <code>Array.&lt;int&gt;</code> |  | (optional) Filter by a category, int or an Array of ints |
| params.sectionId | <code>int</code> |  | (optional) Filter by a section |
| params.statusId | <code>Array.&lt;int&gt;</code> |  | (optional) Filter by statusID(s), int or an Array of ints. "New" is 1, "In process" is 2 "Closed" is 3. Check your custom status IDs in the admin area |
| params.fromUserId | <code>int</code> |  | (optional) Filter by a ticket creator |
| params.fromCompanyId | <code>int</code> |  | (optional) Filter by a company |
| params.handledByUserID | <code>int</code> |  | (optional) Filter by a ticket performer |
| params.tagName | <code>string</code> |  | (optional) Filter by ticket a tag |
| params.dateFrom | <code>string</code> |  | (optional) Filter by creation date (date format should be YYYY-MM-DD, for example 2016-11-24) |
| params.dateTo | <code>string</code> |  | (optional) Filter by creation date (date format should be YYYY-MM-DD, for example 2016-11-24) |
| params.updatedFrom | <code>string</code> |  | (optional) Filter by "last updated" date (date format should be YYYY-MM-DD, for example 2016-11-24) |
| params.updatedTo | <code>string</code> |  | (optional) Filter by "last updated" date (date format should be YYYY-MM-DD, for example 2016-11-24) |
| params.dueInDays | <code>int</code> |  | (optional) Filter by "due in X days" |
| params.includeCustomFields | <code>bool</code> |  | (optional) Add custom field values to the output |
| params.subscribedOnly | <code>bool</code> |  | (optional) Only return tickets you are subscribed to |
| params.count | <code>int</code> |  | (optional) How many tickets to return. Default: 10. Max: 300. |
| params.offset | <code>int</code> |  | (optional) Use this to create paging. For example "offset=20&count=20" will return the next 20 tickets after the first 20. Default: 0. |
| params.fullDetails | <code>Boolean</code> |  | (optional) Will call "getTicket" for each record returned, so you'll get full ticket details instead of just a summary. This will slow down the API call significantly. |

**Example**  
```js
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
```
<a name="jitBit+getTicket"></a>

### jitBit.getTicket(params) ⇒ <code>Object</code>
get details of one specific ticket by ID

**Kind**: instance method of [<code>jitBit</code>](#jitBit)  
**Date**: November 13 2024 12:11 pm -0500  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> |  |
| params.id | <code>int</code> | Ticket id |
| params.ticketId | <code>int</code> | (Alias) Ticket id |
| params.issueId | <code>int</code> | (Alias) Ticket id |
| params.IssueID | <code>int</code> | (Alias) Ticket id |
| params.TicketID | <code>int</code> | (Alias) Ticket id |

**Example**  
```js
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
```
<a name="jitBit+getAttachment"></a>

### jitBit.getAttachment(params) ⇒ <code>Buffer</code>
Allows you to download an individual file attachment

**Kind**: instance method of [<code>jitBit</code>](#jitBit)  
**Returns**: <code>Buffer</code> - The requested file attachment as a file Buffer.  
**Date**: November 13 2024 12:11 pm -0500  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> |  |
| params.id | <code>int</code> | File attachment ID |
| params.AttachmentID | <code>int</code> | (Alias) File attachment ID |
| params.attachmentId | <code>int</code> | (Alias) File attachment ID |
| params.fileId | <code>int</code> | (Alias) File attachment ID |
| params.FileID | <code>int</code> | (Alias) File attachment ID |

<a name="jitBit+createTicket"></a>

### jitBit.createTicket(params) ⇒ <code>int</code>
create a ticket

**Kind**: instance method of [<code>jitBit</code>](#jitBit)  
**Returns**: <code>int</code> - returns the ticket ID if successful, otherwise null  
**Date**: November 13 2024 12:11 pm -0500  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> |  |
| params.categoryId | <code>int</code> | Category ID |
| params.body | <code>string</code> | Ticket body |
| params.subject | <code>string</code> | Ticket subject |
| params.priorityId | <code>int</code> | Ticket priority. Values: <li>-1 – Low</li><li>0 – Normal</li><li>1 – High</li><li>2 – Critical</li> |
| params.userId | <code>int</code> | (optional) - User-ID to create a ticket "on-behalf" of this user (requires technician permissions) |
| params.userUsername | <code>int</code> | (optional) - User-Username to create a ticket "on-behalf" of this user (requires technician permissions) |
| params.userEmail | <code>int</code> | (optional) - User-Email to create a ticket "on-behalf" of this user (requires technician permissions) |
| params.tags | <code>Array.&lt;string&gt;</code> | (optional) - An Array of tags as strings |
| params.origin | <code>int</code> | (optional) - Where the ticket came from, i.e. sets the "via" field for the ticket. Can be one of: 0 (WebApp), 1 (Email), 2 (Widget), 3 (API), 4 (Scheduler), 5 (MobileApp), 6 (Phone), 7 (LiveChat), 8 (InPerson) |
| params.assignedToUserId | <code>int</code> | (optional) - User-ID to assign the ticket to (optional, requires technician permissions) |
| params.assignedToUserUsername | <code>int</code> | (optional) - User-Username to assign the ticket to (optional, requires technician permissions) |
| params.assignedToUserEmail | <code>int</code> | (optional) - User-Email to assign the ticket to (optional, requires technician permissions) |
| params.customFields | <code>Object</code> | (optional) - An object that contains custom field values for the ticket. Format { "ID1" : "value", "ID2" : "value" } where "ID" is the custom field's ID-number. |
| params.suppressConfirmation | <code>bool</code> | (optional) - Skip sending user confirmation email (useful when creating a ticket on behalf) |

<a name="jitBit+getUser"></a>

### jitBit.getUser(params) ⇒ <code>Object</code>
lookup User, first result by userId, username, or email

**Kind**: instance method of [<code>jitBit</code>](#jitBit)  
**Returns**: <code>Object</code> - returns User Details  
**Date**: December 04 2024 12:11 pm -0500  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> |  |
| params.userId | <code>int</code> | (optional) - User-ID |
| params.username | <code>String</code> | (optional) - User's username |
| params.email | <code>String</code> | (optional) - User's email address |

**Example**  
```js
{
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
```
<a name="jitBit+updateTicket"></a>

### jitBit.updateTicket(params) ⇒ <code>Boolean</code>
update one or more tickets

**Kind**: instance method of [<code>jitBit</code>](#jitBit)  
**Returns**: <code>Boolean</code> - true if status is 200, otherwise false  
**Date**: November 13 2024 12:11 pm -0500  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> |  |
| params.id | <code>int</code> | Ticket ID |
| params.categoryId | <code>int</code> | (optional) Ticket category |
| params.priority | <code>int</code> | (optional) Ticket priority. Values: -1 Low, 0 Normal, 1 High, 2 Critical |
| params.date | <code>DateTime</code> | (optional) Ticket creation date |
| params.userId | <code>int</code> | (optional) Ticket submitter's user ID |
| params.dueDate | <code>DateTime</code> | (optional) Due date |
| params.assignedUserId | <code>int</code> | (optional) Assigned technician's ID. Set to 0 (zero) to remove the currently assigned user. |
| params.timeSpentInSeconds | <code>int</code> | (optional) Time spent on the ticket |
| params.statusId | <code>int</code> | (optional) Ticket status ID. "Closed" id 3, "New" is 1, "In process" is 2. Check your custom status IDs in the admin area |
| params.tags | <code>string</code> | (optional) A comma-separated list of tags to apply to the ticket. Like tags=tag1,tag2,tag3. All existing tags will be removed |
| params.subject | <code>string</code> | (optional) Ticket subject |
| params.body | <code>string</code> | (optional) Ticket body |

<a name="jitBit+getCategories"></a>

### jitBit.getCategories() ⇒ <code>Array.&lt;Object&gt;</code>
get all Categories

**Kind**: instance method of [<code>jitBit</code>](#jitBit)  
**Returns**: <code>Array.&lt;Object&gt;</code> - Returns all categories the user has permissions to see  
**Date**: December 02 2024 15:50 pm -0500  
**Example**  
```js
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
```
<a name="jitBit.jitBit"></a>

### jitBit.jitBit
**Kind**: static class of [<code>jitBit</code>](#jitBit)  
**Date**: November 15 2024 11:11 am -0500  
<a name="new_jitBit.jitBit_new"></a>

#### new jitBit(params)
Creates an instance of jitBit.


| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> |  |
| params.baseUrl | <code>String</code> | Usually something like http://{DOMAIN}/helpdesk/api |
| params.username | <code>String</code> | username for authentication (optional if token is provided) |
| params.password | <code>String</code> | password for authentication (optional if token is provided) |
| params.token | <code>String</code> | token for authentication (optional if username/password is provided) (You can get your token by visiting /User/Token/ page in the helpdesk app) |

