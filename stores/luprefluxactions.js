import Reflux from "reflux";
import WebApi from "../utils/WebAPIs";
import constants from "../constants/constants";
import Logger from "../utils/Logger";
import SignalR from "../utils/SignalRUtils";
import UserStore from "./userStore";


// this creates 'load', 'load.completed' and 'load.failed'
var LupActions = Reflux.createActions([
  {
    "loadLups": {children: ["completed","failed"]}},
    {"loadLup":{children :["completed","failed"]}},

  {"savePost":{children :["completed","failed"]}},
  {"saveComment": {children: ["completed", "failed"]}},
  {"login": {children: ["completed", "failed"]}},
  {"logout": {children: ["completed", "failed"]}},
  {"verifyPostTitle": {children: ["completed", "failed"]}},
  {"savePost": {children: ["completed", "failed"]}},
  {"saveDraft": {children: ["completed", "failed"]}},
  {"getDrafts": {children: ["completed", "failed"]}},
  {"updatePost": {children: ["completed", "failed"]}},
  {"loadStates": {children: ["completed", "failed"]}},
  {"loadCities": {children: ["completed", "failed"]}},
  {"loadTags": {children: ["completed", "failed"]}},
  {"saveLup": {children: ["completed", "failed"]}},
  {"archiveLup": {children: ["completed", "failed"]}},
  {"deleteEntry": {children: ["completed", "failed"]}},
  {"joinLup": {children: ["completed", "failed"]}},
  {"requestInvite": {children: ["completed", "failed"]}},
  {"saveComment": {children: ["completed", "failed"]}},
  {"deleteComment": {children: ["completed", "failed"]}},
    "filter",
    "postTitleChanged",
    "postBodyChanged",
    "editPost",
    "deletePost",
  "lupAlreadyLoaded",
  "connectSignalR",
  "newPostTitleChanged",
  "newPostPostChanged",
  "newPostReceived",
  "increaseUsers",
  "decreaseUsers",
  "addUser",
  "removeUser"

]);

LupActions.loadLups.listen(function(){
  var self = this;
  Logger.Log("in load lups");
  WebApi.getLups().then((res)=>{self.completed(res)});
});
LupActions.loadLup.listen(function(lupName){
  var self=this;
  Logger.Log("in load lup ", lupName);
  var isAuth = UserStore.isAuthorized();
  if (!isAuth) {
    Hub.updateLup(lupName);
  }
  else {
    Hub.UpdateLupersOnline(UserStore.getCurrentUser().user);
  }
  WebApi.getLup(lupName).then((res)=> {
    self.completed(res)
  }).catch((res)=> {
    Logger.Log("failed");
    self.failed(res)
  });
});
LupActions.login.listen(function(credentials){
  var self=this;
  WebApi.login(credentials).then((res)=>{sef.completed(res)});
});
LupActions.verifyPostTitle.listen(function (model) {
  var self = this;
  WebApi.verifyPostTitle(model).then(()=> {
    self.completed()
  }).catch(()=> {
    self.failed()
  });
});
LupActions.savePost.listen(function (postObj) {
  var self = this;
  WebApi.savePost(postObj).then((res)=> {
    self.completed(res)
  }).catch((res)=> {
    self.failed()
  });
});
LupActions.loadStates.listen(function () {
  var self = this;
  Logger.Log("loading states");
  WebApi.loadStates().then((res)=> {
    self.completed(res);
  }).catch((res)=> {
    self.failed(res);
  });
});
LupActions.loadCities.listen(function (stateId) {
  var self = this;
  WebApi.loadCities(stateId).then((res)=> {
    self.completed(res);
  }).catch((res)=> {
    self.failed(res);
  });
});
LupActions.loadTags.listen(function () {
  Logger.Log("loading tags");
  var self = this;
  WebApi.loadTags().then((res)=> {
    self.completed(res);
  }).catch((res)=> {
    self.failed(res);
  });
});
LupActions.saveLup.listen(function (lupObj) {
  Logger.Log("saving lup", lupObj);
  var self = this;
  WebApi.saveLup(lupObj).then((res)=> {
    self.completed(res);
  }).catch((res)=> {
    self.failed(res)
  });
});
LupActions.archiveLup.listen(function (id) {
  var self = this;
  WebApi.archiveLup(id).then((res)=> {
    self.completed(res);
  }).catch((res)=> {
    self.failed(res);
  });
});
LupActions.deleteEntry.listen(function (id) {
  var self = this;
  WebApi.deleteEntry(id).then((res)=> {
    self.completed(res);
  }).catch((res)=> {
    self.failed(res);
  })
});
LupActions.updatePost.listen(function (postObj) {
  var self = this;
  WebApi.updatePost(postObj).then((res)=> {
    self.completed(res);
  }).catch((res)=> {
    self.failed(res)
  });
});
LupActions.joinLup.listen(function (id) {
  var self = this;
  WebApi.joinLup(id).then((res)=> {
    self.completed(res);
  }).catch((res)=> {
    self.failed(res);
  });
});
LupActions.saveComment.listen(function (comment) {
  var self = this;
  WebApi.saveComment(comment).then((res)=> {
    self.completed(res);
  }).catch((res)=> {
    self.failed(res)
  });
});
LupActions.deleteComment.listen(function (commentId, entryId) {
  var self = this;
  WebApi.deleteComment(commentId, entryId).then((res)=> {
    self.completed(res);
  }).catch((res)=> {
    self.failed(res)
  });
});
LupActions.saveDraft.listen(function (postObj) {
  var self = this;
  WebApi.securePost(postObj, constants.APIEndPoints.SAVEDRAFT).then((res)=> {
    self.completed(res)
  }).catch((res)=> {
    self.failed()
  });
});
LupActions.getDrafts.listen(function () {
  var self = this;
  Logger.Log("get drafts");
  WebApi.secureGet(constants.APIEndPoints.SAVEDRAFT).then((res)=> {
    self.completed(res)
  }).catch((res)=> {
    self.failed(res);
  });
});
LupActions.connectSignalR.listen(function () {
  Hub.connect();
});

var Hub = new SignalR("LupHub", {
  listeners: {
    'newPost': function (lupFriendlyName, post) {
      LupActions.newPostReceived(lupFriendlyName, post);
    },
    'addUser': function (userId) {
      LupActions.addUser(userId);
    },
    'removeUser': function (userId) {
      LupActions.removeUser(userId)
    },
    increaseUsers: function (lupFriendlyName) {
      LupActions.increaseUserCount(lupFriendlyName);
    },
    decreaseUsers: function (lupFriendlyName) {
      LupActions.decreaseUsers(lupFriendlyName);
    }


    //'removeConnection': function (id) {
    //    Employees.connected.splice(Employees.connected.indexOf(id), 1);
    //    $rootScope.$apply();
    //},
    //'lockEmployee': function (id) {
    //    var employee = find(id);
    //    employee.Locked = true;
    //    $rootScope.$apply();
    //},
    //'unlockEmployee': function (id) {
    //    var employee = find(id);
    //    employee.Locked = false;
    //    $rootScope.$apply();
    //},
    //'updatedEmployee': function (id, key, value) {
    //    var employee = find(id);
    //    employee[key] = value;
    //    $rootScope.$apply();
    //},
    //'addEmployee': function (employee) {
    //    Employees.all.push(new Employee(employee));
    //    $rootScope.$apply();
    //},
    //'removeEmployee': function (id) {
    //    var employee = find(id);
    //    Employees.all.splice(Employees.all.indexOf(employee), 1);
    //    $rootScope.$apply();
    //}
  },
  rootPath: "https://www.lumilups.com/signalr",
  methods: ['updateLup'],
  errorHandler: function (error) {
    console.error(error);
  },
  stateChanged: function (state) {
    console.log("state for signalR ", state);
    switch (state.newState) {
      case $.signalR.connectionState.connecting:
        //console.log("in switch statement", state.newState);
        //SignalRActions.connected();
        break;
      case $.signalR.connectionState.connected:
        console.log("in switch statement", state.newState);
        SignalRActions.connected();
        break;
      case $.signalR.connectionState.reconnecting:
        SignalRActions.connected();
        break;
      case $.signalR.connectionState.disconnected:
        //your code here
        break;
    }
  }
});



module.exports = LupActions;
