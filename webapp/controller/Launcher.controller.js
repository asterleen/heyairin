sap.ui.define([
	"./Base.controller"
], function(Controller) {
	"use strict";

	return Controller.extend("HeyAirin.controller.Launcher", {
		chooseLoginMode: function(oEvent) {
			var oSrc = oEvent.getSource(),
				oRouter = this.getRouter(),
				localModel = this.getModel("local");
				
			switch (oSrc.data("action")) {
				case "readonly":
					localModel.setProperty("readonly", true);
					
					oRouter.navTo("Chat", true);
					break;
				
				case "auth-vk" :
					break;
			}
			
			
			// oRouter.navTo(oSrc.data("to"), true);
		}
	});
});