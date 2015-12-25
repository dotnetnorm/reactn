import request from "superagent";
import * as constants from "../constants/constants";
import Logger from "./Logger";
//import UserStore from "../stores/userStore";
require('superagent-bluebird-promise');
var json = '';

class WebApi {

    getLups() {
        Logger.Log("getting currentLups");

        var isAuth = localStorage.token != undefined && localStorage.token.length > 0;
        if (!isAuth) {
            return request.get(constants.APIEndPoints.GET_LUPS)
                .set("Accept", "application/json")
                .promise();
        }
        else {
            return request.get(constants.APIEndPoints.LUPR_LUPS)
                .set("Authorization", "Bearer " + localStorage.token)
                .promise();
        }
    }

    getLup(lupName) {
        var isAuth = localStorage.token != undefined && localStorage.token.length > 0;
        if (lupName != undefined) {

            if (isAuth) {
                return request.get(constants.APIEndPoints.GET_LUP_ENTRIES + lupName)
                    .set("Accept", "application/json")
                    .set("Authorization", "Bearer " + localStorage.token)
                    .promise();
            }
            else {
                return request.get(constants.APIEndPoints.GET_LUP_ENTIRES_PUBLIC + lupName)
                    .set("Accept", "application/json")
                    .promise();
            }
        }
        else {
            if (isAuth) {
                return request.get(constants.APIEndPoints.LATEST_LUP_ENTRIES)
                    .set("Accept", "application/json")
                    .set("Authorization", "Bearer " + localStorage.token)
                    .promise();
            }
            else {
                console.warn("getting lup entries");
                return request.get(constants.APIEndPoints.LATEST_PUBLIC_LUP_ENTRIES)
                    .promise();
            }
        }
    }

    login(credentials) {
        var sendObj = {grant_type: "password", username: credentials.luprName, password: credentials.password};
        return request.post(constants.APIEndPoints.TOKEN)
            .type('form')
            .send(sendObj)
            .promise();
    }

    getUser() {
        var token = localStorage.token;
        return request.get(constants.APIEndPoints.LUPR_CHECK)
            .set("Authorization", "Bearer " + token)
            .promise();
    }

    verifyPostTitle(titleValidationModel) {
        Logger.Log("validating ", titleValidationModel);
        var token = localStorage.token;
        return request.get(constants.APIEndPoints.VALIDATE_TITLE + titleValidationModel.title.trim() + "/" + titleValidationModel.lupFriendlyName)
            .set("Accept", "application/json")
            .set("Authorization", "Bearer " + token)
            .promise();
    }

    savePost(postObj) {
        var token = localStorage.token;

        return request.post(constants.APIEndPoints.SAVEPOST)
            .set("Authorization", "Bearer " + token)
            .send(postObj)
            .promise();
    }

    validateName(value) {
        var sendObj = {Name: value};
        return request.post(constants.APIEndPoints.VALIDATENAME)
            .send(sendObj)
            .promise();
    }

    register(userObj) {
        return request.post(constants.APIEndPoints.REGISTER)
            .send(userObj)
            .promise();
    }

    loadStates() {
        return request.get(constants.APIEndPoints.STATES)
            .promise();
    }

    loadCities(stateId) {
        return request.get(constants.APIEndPoints.CITIES + "/" + stateId)
            .promise()
    }

    loadTags() {
        return request.get(constants.APIEndPoints.TAGS)
            .promise()
    }

    saveLup(lupObj) {
        var token = localStorage.token;
        if (lupObj.Id == "") {
            return request.post(constants.APIEndPoints.SAVELUP)
                .set("Authorization", "Bearer " + token)
                .send(lupObj)
                .promise();
        }
        return request.put(constants.APIEndPoints.SAVELUP + "/" + lupObj.Id)
            .set("Authorization", "Bearer " + token)
            .send(lupObj)
            .promise();
    }

    archiveLup(id) {
        var token = localStorage.token;
        return request.put(constants.APIEndPoints.ARCHIVE + id)
            .set("Authorization", "Bearer " + token)
            .promise();

    }

    deleteEntry(id) {
        var token = localStorage.token;
        return request.del(constants.APIEndPoints.DELETEENTRY + id)
            .set("Authorization", "Bearer " + token)
            .promise();
    }

    updatePost(postObj) {
        var token = localStorage.token;
        return request.put(constants.APIEndPoints.UPDATEPOST + postObj.Id)
            .set("Authorization", "Bearer " + token)
            .send(postObj)
            .promise();
    }

    joinLup(id) {
        var token = localStorage.token;
        return request.get(constants.APIEndPoints.JOINLUP + id)
            .set("Authorization", "Bearer " + token)
            .promise();
    }

    saveComment(comment) {
        var token = localStorage.token;
        return request.post(constants.APIEndPoints.COMMENT)
            .set("Authorization", "Bearer " + token)
            .send(comment)
            .promise();
    }

    deleteComment(commentId, entryId) {
        var token = localStorage.token;
        return request.del(constants.APIEndPoints.COMMENT + commentId + "/" + entryId)
            .set("Authorization", "Bearer " + token)
            .promise();
    }

    saveCameraImage(obj) {
        var token = localStorage.token;
        return request.post(constants.APIEndPoints.SAVECAMERAIMAGE)
            .set("Authorization", "Bearer " + token)
            .send(obj)
            .promise();
    }

    securePost(obj, endPoint) {
        var token = localStorage.token;
        return request.post(endPoint)
            .set("Authorization", "Bearer " + token)
            .send(obj)
            .promise();
    }

    secureGet(endPoint) {
        Logger.Log("secureGet called ", endPoint)
        var token = localStorage.token;
        return request.get(endPoint)
            .set("Authorization", "Bearer " + token)
            .promise();
    }


};
var _webApi = new WebApi();
module.exports = _webApi;
