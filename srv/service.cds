using school from '../db/schema';

service SchoolService @(path:'/school') {

    entity Departments as projection on school.Departments;
    entity Teachers as projection on school.Teachers;
    entity Students as projection on school.Students;
    
    action deleteStudent(
        studentID : UUID
    ) returns Boolean;

    action updateStudent(
        studentID : UUID,
        name      : String,
        age       : Integer,
        address   : String
    ) returns Students;

    action createTeacher(
        name        : String,
        subject     : String,
        experience  : Integer,
        departmentID: UUID
    ) returns Teachers;
}
