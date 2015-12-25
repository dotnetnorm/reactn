import Reflux from "reflux"
import Actions from "./signalRActions";
import UserStore from "./userStore";
import constants from "../constants/constants";
import Logger from "../utils/Logger";

var SignalRStore = Reflux.createStore({

    listenables: Actions,
    init(){
        //console.log("init on signalR store");
        //Actions.start();
        this.listenTo(UserStore, this.userStoreChange);
    },
    userStoreChange: function (changeType) {
        console.log("user store change in SignalRStore");
        switch (changeType) {
            case constants.ActionTypes.LUPRCHECKSUCCESS:
                Actions.start();
        }
    },
    onConnected: function () {
        console.log("connected to signalR");
        Actions.hello();
    },
    onStart: function () {
        console.log("onStart");
    },
    onHello: function () {
        console.log("Hello");
    },
    onHelloReply: function (value) {
        console.log("hello reply", value)
    }


});

module.exports = SignalRStore;