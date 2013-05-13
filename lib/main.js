var events = require("sdk/system/events");
var { MatchPattern } = require("sdk/page-mod/match-pattern");
var { Ci } = require("chrome");
var { Cr } = require("chrome");

var reddit = new MatchPattern("*.reddit.com");
 
function listener(event) {
  var channel = event.subject.QueryInterface(Ci.nsIHttpChannel);
  var url = channel.URI.spec;
  console.log(url);

  if (!reddit.test(url)) {
    return;
  }

  if (url.indexOf("/r/hawkthorne") != -1) {
    // Allow all requests to /r/hawkthorne
    return;
  }

  if (url.match(/^https?:\/\/(www\.|ssl\.)?reddit.com\/?$/)) {
    channel.cancel(Cr.NS_BINDING_ABORTED);
    return;
  }

  if (url.match(/\.reddit\.com\/r\/*/g)) {
    channel.cancel(Cr.NS_BINDING_ABORTED);
    return;
  }
}
 
events.on("http-on-opening-request", listener);
