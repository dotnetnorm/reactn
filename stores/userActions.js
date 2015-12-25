import Reflux from "reflux";
import WebApi from "../utils/WebAPIs";
import Logger from "../utils/Logger";



// this creates 'load', 'load.completed' and 'load.failed'
var UserActions = Reflux.createActions([
    {
        "login": {children: ["completed","failed"]}},
        {"logout":{children :["completed","failed"]}},
    {"register": {children: ["completed", "failed"]}},
    {"luprCheck": {children: ["completed", "failed"]}},
    {"validateName": {children: ["completed", "failed"]}},
    {"saveCameraImage": {children: ["completed", "failed"]}},
        "usernameChanged",
        "passwordChanged",
    "logOut",
]);

UserActions.login.listen(function(credentials){
    Logger.Log("credentials ", credentials);
    var self = this;
    Logger.Log("logging in user");
    Logger.Log("WebApi", WebApi);
    WebApi.login(credentials).then((res)=>{
        Logger.Log(res);
        self.completed(false, res)
    }).catch((res)=> {
        self.failed(res)
    });
});
UserActions.logout.listen(function(){
    var self=this;
    Logger.Log("logging user out");
    WebApi.logout(lupName).then((res)=>{self.completed(res)});
});
UserActions.register.listen(function (userObj) {
    var self = this;
    Logger.Log("registering new user");
    WebApi.register(userObj).then((res)=> {
        self.completed(res)
    }).catch((res)=> {
        self.failed(res)
    });
});
UserActions.luprCheck.listen(function () {
    var self = this;
    WebApi.getUser().then((res)=> {
        self.completed(res)
    }).catch((res)=> {
        self.failed(res);
    });
});
UserActions.validateName.listen(function (value) {
    var self = this;
    WebApi.validateName(value).then((res)=> {
        self.completed();
    }).catch((res)=> {
        self.failed(res)
    });
});
UserActions.saveCameraImage.listen(function (obj) {
    var self = this;
    WebApi.saveCameraImage(obj).then((res)=> {
        self.completed(res);
    }).catch((res)=> {
        self.failed(res)
    });
});



module.exports = UserActions;
