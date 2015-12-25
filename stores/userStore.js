import Reflux from "reflux";
import Actions from "./userActions";
import Constants from "../constants/constants";
import Logger from "../utils/Logger";

var UserStore = Reflux.createStore({
    // Shorthand for listening to all ContentReviewerActions
    listenables: Actions,
    lupr:{},
    isAuth:false,
    credentials:{userName:'',password:''},
    token:'',


    init: function () {


    },
    getToken:function(){
        return this.token;
    },
    getCurrentUser: function () {
        return this.lupr;
    },
    isAuthorized:function(){
        console.warn("isAuthorized called", this.isAuth)
        if (this.isAuth) {
            return this.isAuth;
        }
        var token = localStorage.token;
        if (token) {
            Actions.luprCheck();
        }
        return this.isAuth;
    },
    isAdmin: function () {
        if (this.lupr != undefined && this.lupr.roles != undefined && this.lupr.roles.indexOf("admin") > -1) {
            return true;
        }
        return false;
    },
    onLoginCompleted:function(isLocal,res){
        if (isLocal){
            console.warn("login complete ", res)
            localStorage.user = JSON.parse(res.text);
            this.isAuth = true;
        }
        else{
            var obj = JSON.parse(res.text);
            localStorage.token = obj.access_token;
            this.token = obj.access_token;
        }
        //this.isAuth=true;
        //this.trigger(Constants.ActionTypes.LOGGEDIN);
        Actions.luprCheck();
    },
    onLogOut: function () {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        this.isAuth = false;
        this.currentUser = null;
        this.trigger(Constants.ActionTypes.LOGOUT);

    },
    onLuprCheckCompleted: function (res) {
        localStorage.user = res.text;
        this.lupr = JSON.parse(res.text);
        this.isAuth = true;
        Logger.Log("lup check done successfully");
        this.trigger(Constants.ActionTypes.LUPRCHECKSUCCESS);
    },
    onLuprCheckFailed: function (res) {
        this.isAuth = false;
        localStorage.token = "";
        localStorage.user = "";
        this.trigger(Constants.ActionTypes.LUPRCHECKFAILED);
    },
    onLoginFailed: function (res) {
        this.trigger(Constants.ActionTypes.LOGGEDINERROR);
    },
    onRegister: function (userObj) {
        Logger.Log("registering ", userObj);
        this.trigger(Constants.ActionTypes.USERREGISTERING);
    },
    onRegisterCompleted: function (res) {
        this.trigger(Constants.ActionTypes.USERREGISTERED);
    },
    onRegisterFailed: function (res) {
        var response = JSON.parse(res);
        this.trigger(Constants.ActionTypes.USERREGISTERERROR, response);
    },
    onValidateNameCompleted: function () {
        this.trigger(Constants.ActionTypes.NAMEOK);
    },
    onValidateNameFailed: function () {
        this.trigger(Constants.ActionTypes.NAMEERROR);
    },
    onSaveCameraImage: function () {
    },
    onSaveCameraImageCompleted: function () {
    },
    onSaveCameraImageFailed: function () {
    }


});

module.exports = UserStore;