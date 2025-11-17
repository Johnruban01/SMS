module.exports = srv => {

    srv.on("deleteStudent", async req => {
        const { studentID } = req.data;

        await DELETE.from("school.Students").where({ ID: studentID });

        return true;
    });
    

    srv.on("updateStudent", async req => {
    const data = req.data;

    await UPDATE("school.Students")
        .set({
            rollNumber : data.rollNumber,
            name       : data.name,
            age        : data.age,
            address    : data.address,
            grade      : data.grade,
            parentName : data.parentName,
            phone      : data.phone,
            email      : data.email
        })
        .where({ ID: data.ID });

    return true;
});

};
