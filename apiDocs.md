<a name="jitBit"></a>

## jitBit
**Kind**: global class  
**Date**: November 15 2024 11:11 am -0500  

* [jitBit](#jitBit)
    * [new jitBit()](#new_jitBit_new)
    * _instance_
        * [.getTickets(params)](#jitBit+getTickets) ⇒ <code>Array</code>
        * [.getTicket(params)](#jitBit+getTicket) ⇒ <code>\*</code>
        * [.getAttachment(params)](#jitBit+getAttachment) ⇒ <code>Buffer</code>
        * [.createTicket(params)](#jitBit+createTicket) ⇒ <code>\*</code>
        * [.updateTicket(params)](#jitBit+updateTicket) ⇒ <code>\*</code>
    * _static_
        * [.jitBit](#jitBit.jitBit)
            * [new jitBit({baseUrl,)](#new_jitBit.jitBit_new)

<a name="new_jitBit_new"></a>

### new jitBit()
Class wrapper for jitbit rest api JITBIT Documentation
    https://www.jitbit.com/docs/api/
    https://www.jitbit.com/helpdesk/email-api/

<a name="jitBit+getTickets"></a>

### jitBit.getTickets(params) ⇒ <code>Array</code>
Get Tickets

**Kind**: instance method of [<code>jitBit</code>](#jitBit)  
**Date**: November 13 2024 11:11 am -0500  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| params | <code>Object</code> | <code>{}</code> |  |
| params.mode | <code>string</code> |  | (optional) Allows you to choose, which tickets to show: all (default) shows all tickets, including closed, unanswered shows new or updated by customer or for tech tickets, unclosed all active tickets, handledbyme shows tickets assigned to the user |
| params.categoryId | <code>Array.&lt;int&gt;</code> |  | (optional) Filter by a category, you can pass an array like this: ?categoryId=1&categoryId=2 |
| params.sectionId | <code>int</code> |  | (optional) Filter by a section |
| params.statusId | <code>Array.&lt;int&gt;</code> |  | (optional) Filter by status(es), you can pass an array like this: ?statusId=1&statusId=2 |
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

<a name="jitBit+getTicket"></a>

### jitBit.getTicket(params) ⇒ <code>\*</code>
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

### jitBit.createTicket(params) ⇒ <code>\*</code>
create a ticket

**Kind**: instance method of [<code>jitBit</code>](#jitBit)  
**Date**: November 13 2024 12:11 pm -0500  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> |  |
| params.categoryId | <code>int</code> | Category ID |
| params.body | <code>string</code> | Ticket body |
| params.subject | <code>string</code> | Ticket subject |
| params.priorityId | <code>int</code> | Ticket priority. Values: <li>-1 – Low</li><li>0 – Normal</li><li>1 – High</li><li>2 – Critical</li> |
| params.userId | <code>int</code> | (optional) - User-ID to create a ticket "on-behalf" of this user (requires technician permissions) |
| params.tags | <code>string</code> | (optional) - A string of tags separated by comma. Example: tags=tag1,tag2,tag3 |
| params.origin | <code>int</code> | (optional) - Where the ticket came from, i.e. sets the "via" field for the ticket. Can be one of: 0 (WebApp), 1 (Email), 2 (Widget), 3 (API), 4 (Scheduler), 5 (MobileApp), 6 (Phone), 7 (LiveChat), 8 (InPerson) |
| params.assignedToUserId | <code>int</code> | (optional) - User-ID to assign the ticket to (optional, requires technician permissions) |
| params.customFields | <code>string</code> | (optional) - A JSON-string that contains custom field values for the ticket. Format { "ID1" : "value", "ID2" : "value" } where "ID" is the custom field's ID-number. |
| params.suppressConfirmation | <code>bool</code> | (optional) - Skip sending user confirmation email (useful when creating a ticket on behalf) |

<a name="jitBit+updateTicket"></a>

### jitBit.updateTicket(params) ⇒ <code>\*</code>
update one or more tickets

**Kind**: instance method of [<code>jitBit</code>](#jitBit)  
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

<a name="jitBit.jitBit"></a>

### jitBit.jitBit
**Kind**: static class of [<code>jitBit</code>](#jitBit)  
**Date**: November 15 2024 11:11 am -0500  
<a name="new_jitBit.jitBit_new"></a>

#### new jitBit({baseUrl,)
Creates an instance of jitBit.


| Param | Type | Description |
| --- | --- | --- |
| {baseUrl, | <code>\*</code> | username, password, token} |

