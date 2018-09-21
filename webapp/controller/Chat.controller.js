sap.ui.define([
	"./Base.controller"
], function(Controller) {
	"use strict";

	return Controller.extend("HeyAirin.controller.Chat", {

		_oServerSettings: { // change these to your own
			address: "hey.airin.https.cat",
			port: 443,
			additionalPath: "",
			secure: true
		},

		_oSocket: null, // WebSocket
		_sAuthKey: "",
		_sLastMessageKey: "",

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf HeyAirin.view.Chat
		 */
		onInit: function() {
			this.getRouter().getRoute("Chat").attachMatched(this.onMatched.bind(this));
			
			var oPage = this.byId("chatPage");
			
			sap.ui.core.ResizeHandler.register(oPage, function() {
				this.sizeScrollContainer();
			}.bind(this));
		},
		
		onMatched: function (oEvent) {
			
			if (this.Storage["auth"]) {
				this._sAuthKey = this.Storage["auth"];
			} else {
				this.navTop();
				return;
			}
			
			this.socketConnect();
		},
		
		socketConnect: function() {
			if (this._oSocket) {
				this.log("Socket is already connected!");
				return;
			}
			
			this._oSocket = new WebSocket((this._oServerSettings.secure ? "wss" : "ws") + "://" + this._oServerSettings.address + ":" + 
				this._oServerSettings.port + "/" + this._oServerSettings.additionalPath);
			this._oSocket.onmessage = this.onSocketMessage.bind(this);
			this._oSocket.onclose = this.onSocketClose.bind(this);
		},
		
		socketDisconnect: function() {
			if (this._oSocket) {
				this._oSocket.close(1000);
				this._oSocket = null;
			} else {
				this.log("Socket is already closed.");
			}
		},
		
		sendCommand: function (message) {
			this.log("Send: " + message);
			if (this._oSocket) {
				this._oSocket.send(message);
			}
		},
		
		onSocketMessage: function (oEvent) {
			this.log("Recv: " + oEvent.data);
			this.processCommand(oEvent.data);
		},
		
		onSocketClose: function (oEvent) {
			this.log("Socket is closed: " + oEvent.code);
			this._oSocket = null;
		},
		
		processCommand: function (commandline) {
			var commands = commandline.split(" "),
				fulltext = commandline.substr(commandline.indexOf("#") + 1),
				mainCmd = commands[0];
			
			switch (mainCmd) {
				case "INIT":
					this.sendCommand("LEVEL 3");
					this.sendCommand("CONNECT " + this._sAuthKey + " #HeyAirin Test App");
					break;
					
				case "AUTH":
					switch (commands[1]) {
						case "OK":
						case "READONLY":
							this.sendCommand("LOG 20");
							break;
							
						case "FAIL":
						case "BANNED":
							this.showError("Auth error: " + fulltext, "Authentication error", this.navTop.bind(this));
							break;
					}
					break;
					
				case "NUS":
					this.sendCommand("SUS");
					break;
					
				case "FAIL":
					this.showError("System error: " + fulltext);
					break;
					
				case "CONTENT": // a single message while chatting
				case "LOGCON":  // a single message after a LOG command
					this.processMessage(commands, fulltext);
					break;
					
				case "CONREC":
					if (commands[1] === this._sLastMessageKey) {
						this.byId("messageText").setValue("");
					}
					break;
			}
		},
		
		// CONTENT 1337 1533558532 Anonyamous 50f436 null #asdasdasd azaza ololoepepe pysch pysch
		//    0      1      2          3        4     5               6 [fulltext]
		processMessage: function (commands, fulltext) {
			var listItem = new sap.m.FeedListItem({
					senderActive: false,
					showIcon: false,
					sender: commands[3],
					info: ">>" + commands[1],
					text: fulltext,
					timestamp: this.formatDate(+commands[2]).time
				}),
				chatMessages = this.byId("chatMessages"),
				chatContainer = this.byId("chatContainer");
				
			chatMessages.addItem(listItem);
			
			setTimeout(function() {chatContainer.scrollToElement(listItem); }, 100);
		},
		
		sendMessage: function (sMessage) {
			this._sLastMessageKey = this.randWord(20);
			this.sendCommand("CONTENT " + this._sLastMessageKey + " #" + sMessage);
		},
		
		onMessageSubmit: function (oEvent) {
			this.sendMessage(oEvent.getSource().getValue());
		}, 
		
		onNavBack: function() {
			this.socketDisconnect();
			this.navTop();
		},
		
		sizeScrollContainer: function() {
			var
				oChatPage = this.byId("chatPage"),
				oChatPanel = this.byId("chatMessagePanel"),
				oChatContainer = this.byId("chatContainer");
			
			oChatPanel.$().width(oChatPanel.$().parent().width());
			oChatContainer.setHeight((oChatPage.$().height() - 96) + "px");
		}
		
	});

});