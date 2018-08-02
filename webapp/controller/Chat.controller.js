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

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf HeyAirin.view.Chat
		 */
		onInit: function() {
			this.getRouter().getRoute("Chat").attachMatched(this.onMatched.bind(this));
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
		
		sendMessage: function (message) {
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
					this.sendMessage("LEVEL 3");
					this.sendMessage("CONNECT " + this._sAuthKey + " #HeyAirin Test App");
					break;
					
				case "AUTH":
					switch (commands[1]) {
						case "OK":
						case "READONLY":
							this.sendMessage("LOG 20");
							break;
							
						case "FAIL":
							this.showError("System error: " + fulltext);
							break;
							
						case "BANNED":
							this.showError("Auth error: " + fulltext, "Authentication error", this.navTop.bind(this));
							break;
					}
					break;
					
				case "NUS":
					this.sendMessage("SUS");
					break;
			}
		},
		
		processMessage: function (commands, fulltext) {
			
		},
		
		onNavBack: function() {
			this.socketDisconnect();
			this.navTop();
		}
		
	});

});