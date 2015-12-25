var Reflux = require("reflux");
import Actions from "./luprefluxactions";
import constants from "../constants/constants";
import UserStore from "./userStore";
import Logger from "../utils/Logger";


var LupRefluxStore = Reflux.createStore({
    // Shorthand for listening to all ContentReviewerActions
    listenables: Actions,

    lups: [],
    allLups: [],
    currentLup: null,
    currentUser: {},
    lupsLoaded: false,
    lupLoaded: false,
    lupLoadFailed: false,
    postTitleIsDuplicate: false,
    newPost: "",
    states: [],
    cities: [],
    tags: [],
    currentDrafts: [],

    // Load a review when the store is initialized
    init: function () {
        Logger.Log("init lupreluxstore");
        Actions.loadLups();

        this.listenTo(UserStore, this._UserStoreChange);
        //  Actions.loadLup();
    },
    _UserStoreChange(change){
        switch (change) {
            case constants.ActionTypes.LUPRCHECKSUCCESS:
                Actions.loadLups();
        }
    },
    getEntry: function (id) {
        var entry = this.currentLup.entries.filter((e)=> {
            if (e.FriendlyTitle == id) return e;
        });
        console.warn("get entry", entry, id, this.currentLup);
        if (entry != undefined) return entry[0];
        return null;
    },
    getEntryFromDrafts: function (id) {
        var entry = this.currentDrafts.filter((e)=> {
            if (e.FriendlyTitle == id) return e;
        });
        if (entry != undefined) return entry[0];
        return null;
    },
    getStates: function () {
        return this.states;
    },
    getCities: function () {
        return this.cities;
    },
    getTags: function () {
        return this.tags;
    },
    getCurrentDrafts: function () {
        return this.currentDrafts;
    },
    getLupModerators: function () {
        if (this.currentLup != undefined && this.currentLup.loop != undefined) {
            return this.currentLup.loop.Members.filter((m)=> {
                if (m.IsModerator) return m;
            })
        }
    },
    isCurrentUserModerator: function () {
        var currentUser = UserStore.getCurrentUser();

        if (this.currentLup != undefined && this.currentLup.loop != undefined && currentUser != undefined) {
            var userName = currentUser.user;
            var member = this.currentLup.loop.Members.filter((m)=> {
                if (m.IsModerator && m.Id == userName) return m;
            })
            if (member != undefined && member.length > 0) {
                return true;
            }
        }
        return false;
    },
    isCurrentUserMember: function () {
        Logger.Log("isCurrentUserMember")
        var currentUser = UserStore.getCurrentUser();

        if (this.currentLup != undefined && this.currentLup.loop != undefined && currentUser != undefined) {
            var userName = currentUser.user;
            var member = this.currentLup.loop.Members.filter((m)=> {
                if (m.Id == userName) return m;
            })
            if (member != undefined && member.length > 0) {
                return true;
            }
            if (this.currentLup.CanPostWithoutBeingAMember) {
                return true;
            }
        }
        return false;
    },
    userCanComment: function () {
        var currentUser = UserStore.getCurrentUser();
        var isAuth = UserStore.isAuthorized();
        if (!isAuth) return false;
        console.error("current User userCanComment", currentUser);
        if (this.currentLup != undefined && this.currentLup.loop != undefined && currentUser != null) {
            if (this.currentLup.loop.CanPostWithoutBeingAMember) return true;
            var userName = currentUser.user;
            var member = this.currentLup.loop.Members.filter((m)=> {
                if (m.Id == userName) return m;
            })
            if (member != undefined && member.length > 0) {
                return true;
            }

        }
        return false;
    },
    canJoin: function () {
        var currentUser = UserStore.getCurrentUser();
        if (!this.isCurrentUserMember()) {
            if (this.currentLup != undefined && this.currentLup.loop != undefined && currentUser != undefined) {
                if (!this.currentLup.loop.IsPrivate && this.currentLup.loop.OthersAllowed) {
                    return {canJoin: true, inviteNeeded: false};
                }
                if (this.currentLup.loop.IsPrivate && this.currentLup.loop.OthersAllowed) {
                    return {canJoin: true, inviteNeeded: true}
                }
                if (this.currentLup.loop.IsPrivate && !this.currentLup.loop.OthersAllowed) {
                    return {canJoin: false, inviteNeeded: false}
                }
                return {canJoin: false, inviteNeeded: false}


            }
        }
    },
    getLups: function () {
        return this.lups;
    },
    getLupsLoaded: function () {
        return this.lupsLoaded;
    },
    getLupLoaded: function () {
        return this.lupLoaded;
    },
    getLoadLupFailed: function () {
        Logger.Log("getting loadLupFailed", this.loadLupFailed);
        return this.loadLupFailed;
    },
    getTitleIsDuplicate: function () {
        return this.postTitleIsDuplicate;
    },
    onNewPostTitleChanged: function (value) {
        this.newPost.Title = value;
    },
    onNewPostPostChanged: function (value) {
        this.newPost.Text = value;
    },
    onFilter: function (value) {
        var newLups = this.allLups.filter((l)=> {
            var testValue = l.Name || l.Id;
            if (testValue.toLowerCase().indexOf(value.toLowerCase()) > -1) {
                return l;
            }
        });
        this.lups = newLups;
        this.trigger(constants.ActionTypes.LUPSLOADED);
    },
    onLoadLups: function () {
        this.lups = null;
        Logger.Log("loading lups");
        this.lupLoaded = false;
        this.trigger(constants.ActionTypes.LUPSLOADING);
    },
    onLoadLupsCompleted: function (res) {

        Logger.Log("LoadLupsCompleted", res);
        var lupList = JSON.parse(res.text);
        this.lups = lupList;
        this.allLups = lupList;
        this.lupsLoaded = true;
        this.trigger(constants.ActionTypes.LUPSLOADED);
    },

    onLoadLupFailed: function (res) {

        Logger.Log("load lup failed", res);
        this.loadLupFailed = true;
        this.trigger(constants.ActionTypes.LUPLOADEDFAILED);
    },
    getCurrentLup: function () {
        Logger.Log("currentLup ", this.currentLup);
        return this.currentLup;
    },
    onLoadLup: function () {
        this.currentLup = null;
        Logger.Log("getting lup")
        this.lupLoaded = false;
        this.loadLupFailed = false;
        this.trigger(constants.ActionTypes.LUPLOADING);
    },
    onLoadLupCompleted: function (res) {
        this.loadLupFailed = false;

        console.warn("loading lup completed", res);
        this.lupLoaded = true;
        var lup = JSON.parse(res.text);
        if (lup.loop) {
            console.warn("Loop is not undefined");
            this.currentLup = lup;
        }
        else {
            console.warn("Loop is undefined");
            this.currentLup = {};
            this.currentLup.entries = lup;
            console.warn(this.currentLup)
        }


        this.trigger(constants.ActionTypes.LUPLOADED);
    },
    onPostTitleChanged: function (value) {
        Logger.Log(value);
        if (value.length > 5) {
            Logger.Log("validation currentLup", this.currentLup);
            var obj = {title: value, lupFriendlyName: this.currentLup.loop.FriendlyName};
            Logger.Log("validation Object ", obj);
            Actions.verifyPostTitle(obj);
        }
    },
    onVerifyPostTitleCompleted: function () {
        Logger.Log("post title is good");
        this.postTitleIsDuplicate = false;
        this.trigger(constants.ActionTypes.POSTTITLEGOOD);
    },
    onVerifyPostTitleFailed: function () {
        Logger.Log("post title is duplicate");
        this.postTitleIsDuplicate = true;
        this.trigger(constants.ActionTypes.POSTTITLEBAD);
    },
    onSavePost: function (postObj) {
        var currentUser = UserStore.getCurrentUser();
        postObj.PosterName = currentUser.user;
        postObj.PostedDate = new Date();
        this.currentLup.entries.unshift(postObj);
        this.trigger(constants.ActionTypes.SAVINGPOST);
    },
    onSavePostCompleted: function (res) {
        this.trigger(constants.ActionTypes.POSTSAVED);
    },
    onSavePostFailed: function (res) {
        this.trigger(constants.ActionTypes.POSTSAVEDERROR);
    },
    onLoadStates: function () {
    },
    onLoadCities: function () {
    },
    onLoadTags: function () {
    },
    onLoadStatesCompleted: function (res) {
        var states = JSON.parse(res.text);
        this.states = states;
        this.trigger(constants.ActionTypes.STATESLOADED);
    },
    onLoadCitiesCompleted: function (res) {
        var cities = JSON.parse(res.text);
        this.cities = cities;
        this.trigger(constants.ActionTypes.CITIESLOADED);
    },
    onLoadTagsCompleted: function (res) {
        var tags = JSON.parse(res.text);
        this.tags = tags;
        this.trigger(constants.ActionTypes.TAGSLOADED);
    },
    onSaveLupCompleted: function (res) {
        Actions.loadLups();
        console.warn("successfully saved the lup");
        this.trigger(constants.ActionTypes.LUPSAVED);

    },
    onSaveLupFailed: function (res) {
        this.trigger(constants.ActionTypes.LUPSAVEDERROR);
    },
    onArchiveLup: function (id) {
        this.archivingLup = id;
        this.trigger(constants.ActionTypes.ARCHIVINGLUP);
    },
    onArchiveLupCompleted: function (res) {
        var lupId = this.archivingLup;
        this.lups = this.lups.filter((l)=> {
            if (l.Id != lupId) return l;
        });
        this.trigger(constants.ActionTypes.LUPSLOADED);
    },
    onArchiveLupFailed: function (id) {
        this.trigger(constants.ActionTypes.LUPARCHIVEDFAILED);
    },
    onDeleteEntry: function (id) {
        console.warn("deleing entry", id);
        this.currentLup.entries = this.currentLup.entries.filter((e)=> {
            if (e.Id != id) return e;
        });
        this.trigger(constants.ActionTypes.LUPLOADED);
    },
    onDeleteEntryCompleted: function (res) {
        this.trigger(constants.ActionTypes.ENTRYDELETED);
    },
    onDeleteEntyFailed: function (res) {
        this.trigger(constants.ActionTypes.ENTRYDELETEDFAILED);
    },
    onUpdatePost: function (postObj) {
        this.currentLup.entries.filter((e)=> {
            if (e.FriendlyTitle == postObj.FriendlyTitle) {
                return postObj;
            }
            else {
                return e;
            }
        });
        this.trigger(constants.ActionTypes.LUPLOADED);
    },
    onUpdatePostCompleted: function (res) {
        this.trigger(constants.ActionTypes.POSTSAVED);
    },
    onUpdatePostFailed: function (res) {
        this.trigger(constants.ActionTypes.POSTSAVED);
    },
    onJoinLup: function () {
        this.trigger(constants.ActionTypes.JOINLUP);
    },
    onJoinLupCompleted: function (res) {
        Actions.loadLups();
        this.trigger(constants.ActionTypes.LUPJOINED);
    },
    onJonLupFailed: function (res) {
        var err = JSON.parse(res);
        this.trigger(constants.ActionTypes.LUPJOINEDERROR, err);
    },
    onSaveComment: function (comment) {
        var entryId = comment.EntryIdStr;
        var currentUser = UserStore.getCurrentUser();
        var obj = {Id: -99, PosterName: currentUser.user, Comment: comment.Comment, PostedDate: new Date()};
        var entry = this.currentLup.entries.find(entry => entry.Id == entryId);
        if (entry != undefined) {
            entry.Comments.push(obj);
        }
        var entries = this.currentLup.entries.map((e)=> {
            if (e.Id == entryId) {
                return entry;
            }
            return e;
        });
        this.currentLup.entries = entries;
        this.trigger(constants.ActionTypes.LUPLOADED);
    },
    onSaveCommentCompleted: function (res) {
        console.error("response ", res.text);
        var response = JSON.parse(res.text);
        var entryId = response.EntryId;
        var entry = this.currentLup.entries.find(entry => entry.Id == response.EntryId);
        if (entry != undefined) {
            var comments = entry.Comments.map((c)=> {
                if (c.Id == -99) {
                    return response;
                }
                return c;
            });
            entry.Comments = comments;
        }
        var entries = this.currentLup.entries.map((e)=> {
            if (e.Id == entryId) {
                return entry;
            }
            return e;
        });
        this.currentLup.entries = entries;
        this.trigger(constants.ActionTypes.LUPLOADED);
        //this.trigger(constants.ActionTypes.SAVECOMMENTSUCCESS);
    },
    onSaveCommentFailed: function (res) {
        this.trigger(constants.ActionTypes.SAVECOMMENTFAILED);
    },
    onDeleteComment: function (commentId, entryId) {

        var entries = this.currentLup.entries.map((e)=> {
            if (e.Id == entryId) {
                var comments = e.Comments.filter((c)=> {
                    if (c.Id != commentId) return c;
                });
                e.Comments = comments;

            }
            return e;
        });
        this.currentLup.entries = entries;
        this.trigger(constants.ActionTypes.LUPLOADED);
    },
    onDeleteCommentCompleted: function (res) {
        console.error("completed delete");
        this.trigger(constants.ActionTypes.DELETECOMMENTSUCCESS);
    },
    onDeleteCommentFailed: function (res) {
        console.error("completed error");
        this.trigger(constants.ActionTypes.DELETECOMMENTFAILED);
    },
    onSaveDraft: function (res) {
        this.trigger(constants.ActionTypes.SAVEDRAFT);
    },
    onSaveDraftCompleted: function (res) {
        this.trigger(constants.ActionTypes.SAVEDRAFTSUCCESS);
    },
    onSaveDraftFailed: function (res) {
        this.trigger(constants.ActionTypes.SAVEDRAFTFAILED);
    },
    onGetDrafts: function () {
        this.trigger(constants.ActionTypes.GETDRAFTS);
    },
    onGetDraftsCompleted: function (res) {
        var drafts = JSON.parse(res.text);
        this.currentDrafts = drafts;
        this.trigger(constants.ActionTypes.GETDRAFTSSUCCESS);
    },
    onGetDraftsFailes: function (res) {
        this.trigger(constants.ActionTypes.GETDRAFTSFAILED);
    },
    onLupAlreadyLoaded: function () {
        this.trigger(constants.ActionTypes.LUPLOADED);
    },
    onNewPostReceived: function (lupFriendlyName, post) {

    },
    onConnectSignalR: function () {

    },
    onDecreaseUsers: function () {

    }


});
module.exports = LupRefluxStore;
