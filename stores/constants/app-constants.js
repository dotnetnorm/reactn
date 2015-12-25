let keyMirror = require("keymirror");

let APIRoot = "http://beta.lumilups.com";

module.exports = {

 APIEndPoints : {
    TOKEN: APIRoot + "/token",
    GET_LUPS : APIRoot + "/api/publicLups",
     GET_LUP_ENTRIES: APIRoot + "/api/entries/",
     TOKEN: APIRoot + "/token"
 },
  PayloadSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null,
    REQUEST_ACTION:null
  }),
  ActionTypes:keyMirror({
    GET_PUBLIC_LUPS: null,
    GET_LUP_COMMENTS: null,
    GET_LUP_RESPONSE: null,
    GET_LUP_ENTRIES:null,
      GET_LUP_ENTRIES_RESPONSE:null,
      SET_TITLE:null,
      LUPR_LOGIN:null,
     USER_INFO_RECEIVED:null
  })

};