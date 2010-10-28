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

      var params = {};
      params[gadgets.io.RequestParameters.REFRESH_INTERVAL] = 1;
      params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
      var thisObject = this;
      gadgets.io.makeRequest('http://todos.demo.sproutcore.com/tasks', function(response) {
        thisObject.didFetchTasks(response,store,query);
      }, params);
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
      var params = {};
      params[gadgets.io.RequestParameters.REFRESH_INTERVAL] = 1;
      params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
      var thisObject = this;
      gadgets.io.makeRequest('http://todos.demo.sproutcore.com' + url, function(response) {
        thisObject.didRetrieveTask(response,store,storeKey);
      }, params);
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
		  
      var params = {};
      params[gadgets.io.RequestParameters.REFRESH_INTERVAL] = 1;
      params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
      params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.POST;
      params[gadgets.io.RequestParameters.POST_DATA] = gadgets.json.stringify(store.readDataHash(storeKey));
      var thisObject = this;
      gadgets.io.makeRequest('http://todos.demo.sproutcore.com/tasks', function(response) {
        thisObject.didCreateTask(response,store,storeKey);
      }, params);
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
		  var url = store.idFor(storeKey);
		  var params = {};
      params[gadgets.io.RequestParameters.REFRESH_INTERVAL] = 1;
      params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
      params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.PUT;
      params[gadgets.io.RequestParameters.POST_DATA] = gadgets.json.stringify(store.readDataHash(storeKey));
      var thisObject = this;
      gadgets.io.makeRequest('http://todos.demo.sproutcore.com' + url, function(response) {
        thisObject.didUpdateTask(response,store,storeKey);
      }, params);
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
      var url = store.idFor(storeKey);
      var params = {};
      params[gadgets.io.RequestParameters.REFRESH_INTERVAL] = 1;
      params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
      params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.DELETE;
      var thisObject = this;
      gadgets.io.makeRequest('http://todos.demo.sproutcore.com' + url, function(response) {
        thisObject.didDestroyTask(response,store,storeKey);
      }, params);
      return YES;
		  
		} else return NO;
	},
	didDestroyTask: function(response, store, storeKey) {
		if (SC.ok(response)) {
		  store.dataSourceDidDestroy(storeKey);
		} else store.dataSourceDidError(response);
	}
  
}) ;
