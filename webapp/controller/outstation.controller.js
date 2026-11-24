sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast"
], function (Controller, Fragment, MessageToast) {
    "use strict";

    return Controller.extend("outstation.medicaloutstation.controller.outstation", {

        onInit() {
            const oModel = this.getOwnerComponent().getModel("empModel") || this.getView().getModel("empModel");
            if (!oModel) {
                return;
            }

            const fnBuildOutstationList = () => {
                const aEmployees = oModel.getProperty("/Employees");
                if (!Array.isArray(aEmployees)) {
                    return;
                }

                const aAllOutstation = [];
                aEmployees.forEach((oEmp) => {
                    (oEmp.outstation || []).forEach((oTrip) => {
                        aAllOutstation.push({
                            EmployeeId: oEmp.EmployeeId,
                            employeeName: oEmp.name,
                            dependantName: oTrip.dependantName,
                            relation: oTrip.relation,
                            place: oTrip.place,
                            fromDate: oTrip.fromDate,
                            toDate: oTrip.toDate,
                            purposeOfVisit: oTrip.purposeOfVisit
                        });
                    });
                });

                oModel.setProperty("/allOutstationRecords", aAllOutstation);
            };

            // 1. Run immediately in case model data already loaded before onInit
            fnBuildOutstationList();

            // 2. Also run once JSON load completes (for slower loads / refreshes)
            oModel.attachRequestCompleted(fnBuildOutstationList);
        },

        OnAddOutStation: function () {
            const oView = this.getView();

            if (!this._pAddDialog) {
                this._pAddDialog = Fragment.load({
                    id: oView.getId(),
                    name: "outstation.medicaloutstation.view.fragments.AddOutstationDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this._pAddDialog.then(function (oDialog) {
                this._resetDialogFields();
                oDialog.open();
            }.bind(this));
        },

        onSaveOutstation: function () {
            const sName = this.byId("inpDependantName").getValue().trim();
            const sRelation = this.byId("selRelation").getSelectedKey();
            const sPlace = this.byId("inpPlace").getValue().trim();
            const sFromDate = this.byId("dpFromDate").getValue();
            const sToDate = this.byId("dpToDate").getValue();
            const sPurpose = this.byId("txtPurposeOfVisit").getValue().trim();

            if (!sName || !sPlace || !sFromDate || !sToDate || !sPurpose) {
                MessageToast.show("Please fill all required fields.");
                return;
            }

            // Placeholder payload ready for your JSONModel or OData service later
            const oNewClaim = {
                name: sName,
                relation: sRelation,
                place: sPlace,
                fromDate: sFromDate,
                toDate: sToDate,
                purposeOfVisit: sPurpose
            };

            console.log("New Outstation Claim:", oNewClaim);
            MessageToast.show("Outstation claim submitted.");
            this.byId("addOutstationDialog").close();
        },

        onCancelOutstation: function () {
            this.byId("addOutstationDialog").close();
        },

        _resetDialogFields: function () {
            this.byId("inpDependantName").setValue("");
            this.byId("selRelation").setSelectedKey("Self");
            this.byId("inpPlace").setValue("");
            this.byId("dpFromDate").setValue("");
            this.byId("dpToDate").setValue("");
            this.byId("txtPurposeOfVisit").setValue("");
        }

    });
});