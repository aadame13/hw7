"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wsClient = require("./ws-client");

var _wsClient2 = _interopRequireDefault(_wsClient);

var _storage = require("./storage");

var _dom = require("./dom");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FORM_SELECTOR = "[data-chat='chat-form']";
var INPUT_SELECTOR = "[data-chat='message-input']";
var LIST_SELECTOR = "[data-chat='message-list']";

var userStore = new _storage.UserStore("x-chattrbox/u");
var username = userStore.get();
if (!username) {
  username = (0, _dom.promptForUsername)();
  userStore.set(username);
}

var ChatApp = function ChatApp() {
  var _this = this;

  _classCallCheck(this, ChatApp);

  this.chatForm = new _dom.ChatForm(FORM_SELECTOR, INPUT_SELECTOR);
  this.chatList = new _dom.ChatList(LIST_SELECTOR, "wonderwoman");
  _wsClient2.default.init("ws://localhost:3001");
  _wsClient2.default.registerOpenHandler(function () {
    _this.chatForm.init(function (data) {
      var message = new ChatMessage({
        message: data
      });
      _wsClient2.default.sendMessage(message.serialize());
    });
    _this.chatList.init();
  });
  _wsClient2.default.registerMessageHandler(function (data) {
    console.log(data);
    var message = new ChatMessage(data);
    _this.chatList.drawMessage(message.serialize());
  });
};

var ChatMessage = function () {
  function ChatMessage(_ref) {
    var m = _ref.message,
        _ref$user = _ref.user,
        u = _ref$user === undefined ? username : _ref$user,
        _ref$timestamp = _ref.timestamp,
        t = _ref$timestamp === undefined ? new Date().getTime() : _ref$timestamp;

    _classCallCheck(this, ChatMessage);

    this.message = m;
    this.user = u;
    this.timestamp = t;
  }

  _createClass(ChatMessage, [{
    key: "serialize",
    value: function serialize() {
      return {
        user: this.user,
        message: this.message,
        timestamp: this.timestamp
      };
    }
  }]);

  return ChatMessage;
}();

exports.default = ChatApp;
