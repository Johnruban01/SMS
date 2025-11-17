sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"sms/teacher/test/integration/pages/DepartmentsList",
	"sms/teacher/test/integration/pages/DepartmentsObjectPage",
	"sms/teacher/test/integration/pages/TeachersObjectPage"
], function (JourneyRunner, DepartmentsList, DepartmentsObjectPage, TeachersObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('sms/teacher') + '/test/flp.html#app-preview',
        pages: {
			onTheDepartmentsList: DepartmentsList,
			onTheDepartmentsObjectPage: DepartmentsObjectPage,
			onTheTeachersObjectPage: TeachersObjectPage
        },
        async: true
    });

    return runner;
});

