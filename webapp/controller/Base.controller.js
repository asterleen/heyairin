sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function(Controller, JSONModel, MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("HeyAirin.controller.Base", {
		
		MT: MessageToast,
		JM: JSONModel,
		MB: MessageBox,
		Logger: jQuery.sap.log,
		Storage: window.localStorage,

		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		
		navTo: function(sView) {
			this.getRouter().navTo(sView, true);
		},

		navTop: function(evt) {
			this.getRouter().navTo("Launcher", true);
		},

		navBack: function() {
			var oHistory = sap.ui.core.routing.History.getInstance(),
				sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				// The history contains a previous entry
				history.go(-1);
			} else {
				this.navTop();
			}
		},
		
		showError: function(sText, sTitle, fOnClose) {
			this.MB.show(
		      sText, {
		          icon: sap.m.MessageBox.Icon.ERROR,
		          title: sTitle || "HeyAirin Error",
		          actions: [sap.m.MessageBox.Action.OK],
		          onClose: fOnClose
		      }
		    );
		},

		/**
		 * Get model from view or component
		 * @param {string} sName - name of the model
		 * @return {object} - model
		 */
		getModel: function(sName) {
			return this.getView().getModel(sName) || (this.getOwnerComponent() && this.getOwnerComponent().getModel(sName));
		},

		byId: function(sName) {
			return this.getView().byId(sName) || sap.ui.getCore().byId(sName);
		},

		/****************************************************************************************************
		 * Common handlers
		 ****************************************************************************************************/

		log: function(message, level) {
			switch (level) {
				case "info":
					this.Logger.info(message);
					break;
				case "warning":
					this.Logger.warning(message);
					break;
				case "error":
					this.Logger.error(message);
					break;
				case "fatal":
					this.Logger.fatal(message);
					break;
				default:
					this.Logger.info(message);
					break;
			}
		},
		
		rangeRand: function (iMin, iMax) {
			return Math.floor(Math.random() * (iMax - iMin + 1) + iMin);
		},
		
		randWord: function(iLength) {
			var s = "",
		    	ltr = "qwertyuiopasdfghjklzxcvbnm";
		    	
		    while (s.length < (iLength || 64)) {
		        s += ltr[this.rangeRand(0, 25)];
		    }
		    return s;
		}
	});
});