sap.ui.define([
	"./Base.controller"
], function(Controller) {
	"use strict";

	return Controller.extend("HeyAirin.controller.Launcher", {
		chooseLoginMode: function(oEvent) {
			var oSrc = oEvent.getSource(),
				oRouter = this.getRouter();
				
			console.log("Auth action required:", oSrc.data("action"));
				
			switch (oSrc.data("action")) {
				case "auth-vk" :
					break;
			}
			
			
			// oRouter.navTo(oSrc.data("to"), true);
		}
	});
});