module.exports = srv => {

    srv.on("deleteStudent", async req => {
        const { studentID } = req.data;

        await DELETE.from("school.Students").where({ ID: studentID });

        return true;
    });

};
