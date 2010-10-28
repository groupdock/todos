// ==========================================================================
// Project:   Todos.TaskDataSource
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Todos */

sc_require('models/task');
Todos.TASKS_QUERY = SC.Query.local(Todos.Task, {
  orderBy: 'isDone,description'
});

/** @class

  (Document Your Data Source Here)

  @extends SC.DataSource
*/
Todos.TaskDataSource = SC.DataSource.extend(
/** @scope Todos.TaskDataSource.prototype */ {

  // ..........................................................
  // QUERY SUPPORT
  // 

  fetch: function(store, query) {
 
		if (query === Todos.TASKS_QUERY) {
		  SC.Request.getUrl('/tasks').header({'Accept': 'application/json'}).json()
		    .notify(this, 'didFetchTasks', store, query)
		    .send();
		  return YES;
		} 
		return NO;
	},
 
	didFetchTasks: function(response, store, query) {
		if (SC.ok(response)) {
		  store.loadRecords(Todos.Task, response.get('body').content);
		  store.dataSourceDidFetchQuery(query);
	 
		} else store.dataSourceDidErrorQuery(query, response);
	},

  // ..........................................................
  // RECORD SUPPORT
  // 
  
  retrieveRecord: function(store, storeKey) {
		if (SC.kindOf(store.recordTypeFor(storeKey), Todos.Task)) {
	 
		  var url = store.idFor(storeKey);
		  SC.Request.getUrl(url).header({
		              'Accept': 'application/json'
		          }).json()
		    .notify(this, 'didRetrieveTask', store, storeKey)
		    .send();
		  return YES;
	 
		} else return NO;
	},
	 
	didRetrieveTask: function(response, store, storeKey) {
		if (SC.ok(response)) {
		  var dataHash = response.get('body').content;
		  store.dataSourceDidComplete(storeKey, dataHash);
	 
		} else store.dataSourceDidError(storeKey, response);
	}, 
  
	createRecord: function(store, storeKey) {
		if (SC.kindOf(store.recordTypeFor(storeKey), Todos.Task)) {
		  
		  SC.Request.postUrl('/tasks').header({
		              'Accept': 'application/json'
		          }).json()
		    .notify(this, this.didCreateTask, store, storeKey)
		    .send(store.readDataHash(storeKey));
		  return YES;
	 
		} else return NO;
	},
	 
	didCreateTask: function(response, store, storeKey) {
		if (SC.ok(response)) {
		  // Adapted from parseUri 1.2.2
		  // (c) Steven Levithan <stevenlevithan.com>
		  // MIT License
		  var parser = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
		  var url = parser.exec(response.header('Location'))[8];
		  store.dataSourceDidComplete(storeKey, null, url); // update url
	 
		} else store.dataSourceDidError(storeKey, response);
	},
  
  updateRecord: function(store, storeKey) {
		if (SC.kindOf(store.recordTypeFor(storeKey), Todos.Task)) {
		  SC.Request.putUrl(store.idFor(storeKey)).header({
		              'Accept': 'application/json'
		          }).json()
		    .notify(this, this.didUpdateTask, store, storeKey)
		    .send(store.readDataHash(storeKey));
		  return YES;
		  
		} else return NO ;
	},
	didUpdateTask: function(response, store, storeKey) {
		if (SC.ok(response)) {
		  var data = response.get('body');
		  if (data) data = data.content; // if hash is returned; use it.
		  store.dataSourceDidComplete(storeKey, data) ;
		    
		} else store.dataSourceDidError(storeKey); 
	},
  
	destroyRecord: function(store, storeKey) {
		if (SC.kindOf(store.recordTypeFor(storeKey), Todos.Task)) {
		  SC.Request.deleteUrl(store.idFor(storeKey)).header({
		              'Accept': 'application/json'
		          }).json()
		    .notify(this, this.didDestroyTask, store, storeKey)
		    .send();
		  return YES;
		  
		} else return NO;
	},
	didDestroyTask: function(response, store, storeKey) {
		if (SC.ok(response)) {
		  store.dataSourceDidDestroy(storeKey);
		} else store.dataSourceDidError(response);
	}
  
}) ;
