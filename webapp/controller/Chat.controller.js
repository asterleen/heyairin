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

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf HeyAirin.view.Chat
		 */
		onInit: function() {
			this.getRouter().getRoute("Chat").attachMatched(this.onMatched.bind(this));
		},
		
		onMatched: function (oEvent) {
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
		
		onSocketMessage: function (oEvent) {
			this.log("chat socketMessage");
			this.processCommand(oEvent.data);
		},
		
		onSocketClose: function (oEvent) {
			this.log("Socket is closed: " + oEvent.code);
			this._oSocket = null;
		},
		
		processCommand: function (commandline) {
			this.log(commandline);
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf HeyAirin.view.Chat
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf HeyAirin.view.Chat
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf HeyAirin.view.Chat
		 */
		//	onExit: function() {
		//
		//	}

	});

});