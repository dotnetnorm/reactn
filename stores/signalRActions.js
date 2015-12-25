import Reflux from "reflux";
import Logger from "../utils/Logger";
import SignalR from "../utils/SignalRUtils";


var SignalRActions = Reflux.createActions([
        "connected", "start", "hello", "helloReply"
    ]
);
SignalRActions.hello.listen(function () {
    console.log("in hello method");
    hub.hello();
})
SignalRActions.start.listen(function () {
    console.log("start called");
    hub.connect();
});
var hub = new SignalR('LuprHub', {
    listeners: {
        'helloReply': function (value) {
            SignalRActions.helloReply(value);
        },

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
    methods: ['hello'],
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

module.exports = SignalRActions;