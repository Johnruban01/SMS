sap.ui.define([
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Label",
    "sap/m/Input",
    "sap/m/Button"
], function (BusyIndicator, MessageToast, Dialog, Label, Input, Button) {
    "use strict";

    let oDeptDialog = null;

    return {


        deleteStudent: async function () {

            const extensionAPI = this; 

            // Get selected rows
            const selectedContexts = extensionAPI.getSelectedContexts();

            if (!selectedContexts.length) {
                MessageToast.show("Select a student first.");
                return;
            }

            const student = selectedContexts[0].getObject();
            const studentID = student.ID;

            BusyIndicator.show(200);

            try {
                await $.ajax({
                    url: "/school/deleteStudent",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify({ studentID })
                });

                MessageToast.show("Student deleted successfully!");

                // refresh the table
                extensionAPI.refresh();
            }
            catch (err) {
                console.error("Delete error:", err.responseText);
                MessageToast.show("Failed to delete student.");
            }

            BusyIndicator.hide();
        },

        openDeptDialog: function () {

            if (!oDeptDialog) {
                oDeptDialog = new Dialog({
                    title: "Create Department",
                    contentWidth: "400px",
                    draggable: true,
                    resizable: true,

                    content: [
                        new Label({ text: "Name" }),
                        new Input("deptNameInput"),

                        new Label({ text: "Description" }),
                        new Input("deptDescInput")
                    ],

                    beginButton: new Button({
                        text: "Create",
                        type: "Emphasized",
                        press: this.createDepartment.bind(this)
                    }),

                    endButton: new Button({
                        text: "Cancel",
                        press: function () { oDeptDialog.close(); }
                    })
                });
            }

            oDeptDialog.open();
        },

        createDepartment: function () {

            const name = sap.ui.getCore().byId("deptNameInput").getValue();
            const description = sap.ui.getCore().byId("deptDescInput").getValue();

            if (!name) {
                MessageToast.show("Name is required");
                return;
            }

            BusyIndicator.show(100);

            $.ajax({
                url: "/school/Departments",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    name: name,
                    description: description
                }),

                success: function () {
                    BusyIndicator.hide();
                    MessageToast.show("Department created!");

                    sap.ui.getCore().byId("deptNameInput").setValue("");
                    sap.ui.getCore().byId("deptDescInput").setValue("");
                    oDeptDialog.close();

                    // Refresh main FE model
                    const oModel = sap.ui.getCore().getModel();
                    oModel.refresh();
                },

                error: function () {
                    BusyIndicator.hide();
                    MessageToast.show("Failed to create department.");
                }
            });
        }
    };
});
