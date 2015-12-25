/**
 * Created by normancrandall on 7/27/15.
 */
import enquire from "../../assets/enquire.min.js";
import json2mq from "json2mq";

class mediaQuery {

    media(query, cb, falseMatch) {
        enquire.register(json2mq(query), {
            match: cb,
            unmatch: falseMatch
        });
    }

    unregister(query) {
        enquire.unregister(query);
    }

}

var _mediaQuery = new mediaQuery();

export default _mediaQuery;