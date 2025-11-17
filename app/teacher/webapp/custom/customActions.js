sap.ui.define([
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/m/Dialog",
    "sap/m/Label",
    "sap/m/Input",
    "sap/m/Button",
    "sap/m/Table",
    "sap/m/Column",
    "sap/m/ColumnListItem",
    "sap/m/Text",
    "sap/ui/model/json/JSONModel"
], function (
    BusyIndicator,
    MessageToast,
    MessageBox,
    Dialog,
    Label,
    Input,
    Button,
    Table,
    Column,
    ColumnListItem,
    Text,
    JSONModel
) {
    "use strict";

    let oDeptDialog = null;
    let oSortDeptDialog = null;

    return {


        deleteStudent: function () {

            const extensionAPI = this;

            const oTable = sap.ui.getCore().byId(
                "sms.teacher::TeachersObjectPage--fe::table::students::LineItem-innerTable"
            );

            if (!oTable) {
                sap.m.MessageToast.show("Students table not found.");
                return;
            }

            const selectedContexts = oTable.getSelectedContexts();

            if (!selectedContexts.length) {
                sap.m.MessageToast.show("Select a student first.");
                return;
            }

            const studentID = selectedContexts[0].getObject().ID;

            sap.ui.core.BusyIndicator.show(100);

            $.ajax({
                url: "/school/deleteStudent",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({ studentID }),

                success: function () {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show("Student deleted successfully!");
                    oTable.getModel().refresh(true);
                },

                error: function (err) {
                    sap.ui.core.BusyIndicator.hide();
                    console.error(err);
                    sap.m.MessageToast.show("Failed to delete student.");
                }
            });
        },

        openDeptDialog: function () {

            let that = this;

            if (!oDeptDialog) {

                oDeptDialog = new sap.m.Dialog({
                    title: "Create Department",
                    contentWidth: "500px",
                    draggable: true,
                    resizable: true,

                    content: [
                        new sap.m.Label({ text: "Name" }),
                        new sap.m.Input("deptNameInput"),

                        new sap.m.Label({ text: "Description" }),
                        new sap.m.Input("deptDescInput")
                    ],

                    beginButton: new sap.m.Button({
                        text: "Create",
                        type: "Emphasized",

                        press: function () {

                            const name = sap.ui.getCore().byId("deptNameInput").getValue();
                            const description = sap.ui.getCore().byId("deptDescInput").getValue();

                            if (!name) {
                                sap.m.MessageToast.show("Name is required");
                                return;
                            }

                            sap.ui.core.BusyIndicator.show(100);

                            $.ajax({
                                url: "/school/Departments",
                                type: "POST",
                                contentType: "application/json",
                                data: JSON.stringify({ name, description }),

                                success: function () {
                                    sap.ui.core.BusyIndicator.hide();
                                    sap.m.MessageToast.show("Department created!");

                                    sap.ui.getCore().byId("deptNameInput").setValue("");
                                    sap.ui.getCore().byId("deptDescInput").setValue("");

                                    oDeptDialog.close();
                                    sap.ui.getCore().getModel().refresh(true);
                                },

                                error: function () {
                                    sap.ui.core.BusyIndicator.hide();
                                    sap.m.MessageToast.show("Error creating department.");
                                }
                            });

                        }
                    }),

                    endButton: new sap.m.Button({
                        text: "Cancel",
                        press: function () {
                            oDeptDialog.close();
                        }
                    }),
                });
            }

            oDeptDialog.open();
        },

        openSortStudentsDialog: function () {

            const extensionAPI = this;
            const ctx = extensionAPI.getBindingContext();

            if (!ctx) {
                sap.m.MessageToast.show("No teacher selected.");
                return;
            }

            const teacherID = ctx.getObject().ID;

            sap.ui.core.BusyIndicator.show(100);

            // Fetch students belonging to this teacher
            $.ajax({
                url: `/school/Students?$filter=teacher_ID eq '${teacherID}'&$orderby=name asc`,
                type: "GET",
                dataType: "json",

                success: function (data) {
                    sap.ui.core.BusyIndicator.hide();

                    if (!data.value || data.value.length === 0) {
                        sap.m.MessageToast.show("No students found.");
                        return;
                    }

                    // Build MessageBox text
                    let text = "📘 Sorted Students (By Name)\n\n";

                    data.value.forEach((s, index) => {
                        text += `${index + 1}. ${s.name}  
                        Roll No: ${s.rollNumber}
                        Age: ${s.age}
                        City: ${s.address}`;
                    });
                    // Show in MessageBox (scrollable)
                    sap.m.MessageBox.information(text, {
                        title: "Sorted Students",
                        styleClass: "sapUiSizeCompact",
                        contentWidth: "400px"
                    });
                },

                error: function (err) {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show("Failed to load student data.");
                    console.error(err);
                }
            });
        },

        openSortDepartmentsDialog: function () {
            const that = this;

            sap.ui.core.BusyIndicator.show(100);

            $.ajax({
                url: "/school/Departments?$orderby=name asc",
                type: "GET",
                dataType: "json",

                success: function (data) {
                    sap.ui.core.BusyIndicator.hide();

                    if (!data.value || data.value.length === 0) {
                        sap.m.MessageToast.show("No departments found.");
                        return;
                    }

                    // JSON Model
                    const oModel = new sap.ui.model.json.JSONModel(data.value);

                    // Create dialog only once
                    if (!oSortDeptDialog) {
                        oSortDeptDialog = new sap.m.Dialog({
                            title: "Sorted Departments",
                            contentWidth: "450px",
                            contentHeight: "300px",
                            horizontalScrolling: false,
                            verticalScrolling: true,
                            draggable: true,
                            resizable: true,

                            content: [
                                new sap.m.Table({
                                    inset: false,
                                    columns: [
                                        new sap.m.Column({ header: new sap.m.Label({ text: "Name" }) }),
                                        new sap.m.Column({ header: new sap.m.Label({ text: "Description" }) })
                                    ],
                                    items: {
                                        path: "/",
                                        template: new sap.m.ColumnListItem({
                                            cells: [
                                                new sap.m.Text({ text: "{name}" }),
                                                new sap.m.Text({ text: "{description}" })
                                            ]
                                        })
                                    }
                                })
                            ],

                            beginButton: new sap.m.Button({
                                text: "Close",
                                press: function () {
                                    oSortDeptDialog.close();
                                }
                            })
                        });
                    }

                    // Update model before opening dialog
                    oSortDeptDialog.getContent()[0].setModel(oModel);

                    oSortDeptDialog.open();
                },

                error: function (err) {
                    sap.ui.core.BusyIndicator.hide();
                    console.error(err);
                    sap.m.MessageToast.show("Failed to load departments.");
                }
            });
        }

    };
});
