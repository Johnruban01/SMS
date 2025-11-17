namespace school;

using { cuid, managed } from '@sap/cds/common';

entity Departments : cuid, managed {
    name        : String(111) @mandatory;
    description : String(255);

    // Department → Teachers (1:N)
    teachers    : Composition of many Teachers
                    on teachers.department = $self;
}

entity Teachers : cuid, managed {
    name        : String(111) @mandatory;
    subject     : String(111);
    experience  : Integer;

    // Backlink to Department
    department  : Association to Departments;

    // Teacher → Students (1:N)
    students    : Composition of many Students
                    on students.teacher = $self;
}

entity Students : cuid, managed {
    rollNumber  : Integer       @mandatory;
    name        : String(111)   @mandatory;
    age         : Integer;
    address     : String(255);

    grade       : String(20);
    parentName  : String(111);
    phone       : String(20);
    email       : String(111);

    teacher     : Association to Teachers;

}

