/*global QUnit*/

sap.ui.define([
	"outstation/medicaloutstation/controller/outstation.controller"
], function (Controller) {
	"use strict";

	QUnit.module("outstation Controller");

	QUnit.test("I should test the outstation controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
