sap.ui.define([
	"./Base.controller"
], function(Controller) {
	"use strict";

	return Controller.extend("HeyAirin.controller.Launcher", {
		
		onInit: function() {
			var
				sHash = window.location.hash.substring(1);
			
			if (sHash.startsWith("auth:")) {
				var sAuthKey = sHash.substring(6);
				
				if (sAuthKey) {
					this.Storage["auth"] = sAuthKey;
					
					this.navTo("Chat");
				}
			}
		},

		chooseLoginMode: function(oEvent) {
			var oSrc = oEvent.getSource(),
				oRouter = this.getRouter(),
				localModel = this.getModel("local");
				
			switch (oSrc.data("action")) {
				case "readonly":
					this.Storage["auth"] = "READONLY";
					oRouter.navTo("Chat", true);
					break;
				
				case "auth-vk" :
					window.location.href = "https://api.https.cat/heyairin/auth/vk/start";
					break;
					
				case "auth-facebook" :
					window.location.href = "https://api.https.cat/heyairin/auth/fb/start";
					break;
			}
			// oRouter.navTo(oSrc.data("to"), true);
		}
	});
});