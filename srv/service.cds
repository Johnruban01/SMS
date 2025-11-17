using school from '../db/schema';

service SchoolService @(path:'/school') {

    entity Departments as projection on school.Departments;
    entity Teachers as projection on school.Teachers;
    entity Students as projection on school.Students;
    
    action deleteStudent(
        studentID : UUID
    ) returns Boolean;

   action updateStudent(
    ID          : UUID,
    rollNumber  : Integer,
    name        : String,
    age         : Integer,
    address     : String,
    grade       : String,
    parentName  : String,
    phone       : String,
    email       : String
) returns Students;

    
   
}
