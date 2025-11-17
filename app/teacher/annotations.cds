using SchoolService as service from '../../srv/service';

annotate service.Departments with @UI.HeaderInfo : {
    TypeName       : 'Department',
    TypeNamePlural : 'Departments',
    Title          : { Value : name },
    Description    : { Value : description }
};

annotate service.Teachers with @UI.HeaderInfo : {
    TypeName       : 'Teacher',
    TypeNamePlural : 'Teachers',
    Title          : { Value : name },
    Description    : { Value : subject }
};

annotate service.Students with @UI.HeaderInfo : {
    TypeName       : 'Student',
    TypeNamePlural : 'Students',
    Title          : { Value : name },
    Description    : { Value : rollNumber }
};


annotate service.Departments with @(
    UI.FieldGroup #DeptInfo : {
        $Type : 'UI.FieldGroupType',
        Data  : [
            { $Type : 'UI.DataField', Label : 'Name',        Value : name },
            { $Type : 'UI.DataField', Label : 'Description', Value : description }
        ]
    },

    UI.LineItem : [
        { $Type : 'UI.DataField', Value : name },
        { $Type : 'UI.DataField', Value : description }
    ],

    UI.Facets : [
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : 'General Information',
            Target : '@UI.FieldGroup#DeptInfo'
        },
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Teachers',
            Target : 'teachers/@UI.LineItem'
        }
    ]
);


annotate service.Teachers with @(
    UI.LineItem : [
        { Value : name },
        { Value : subject },
        { Value : experience }
    ],

    UI.FieldGroup #TeacherInfo : {
        Data : [
            { Value : name },
            { Value : subject },
            { Value : experience }
        ]
    },

    UI.Facets : [
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Teacher Information',
            Target : '@UI.FieldGroup#TeacherInfo'
        },
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Students',
            Target : 'students/@UI.LineItem'
        }
    ]
);

annotate service.Students with @(
    UI.LineItem : [
        { Value : rollNumber },
        { Value : name },
        { Value : grade }
    ],

    UI.FieldGroup #StudentFullInfo : {
        $Type : 'UI.FieldGroupType',
        Data  : [
            { $Type : 'UI.DataField', Label : 'Roll Number', Value : rollNumber },
            { $Type : 'UI.DataField', Label : 'Name',        Value : name },
            { $Type : 'UI.DataField', Label : 'Age',         Value : age },
            { $Type : 'UI.DataField', Label : 'Address',     Value : address },

            { $Type : 'UI.DataField', Label : 'Grade',       Value : grade },
            { $Type : 'UI.DataField', Label : 'Parent Name', Value : parentName },
            { $Type : 'UI.DataField', Label : 'Phone',       Value : phone },
            { $Type : 'UI.DataField', Label : 'Email',       Value : email }
        ]
    },

    UI.Facets : [
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : 'Student Full Information',
            Target : '@UI.FieldGroup#StudentFullInfo'
        }
    ],
);
