sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"HeyAirin/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("HeyAirin.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			
			// this will store the system state
			this.setModel(models.createLocalModel(), "local");

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			
			this.getRouter().initialize();
		}
	});
});