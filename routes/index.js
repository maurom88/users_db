module.exports = {
    getHomePage: (req, res) => {
        let query = "SELECT * FROM `teachers` ORDER BY id ASC"; // query database to get all the teachers

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }
            res.render('index.ejs', {
                title: "Welcome to ELiTe | View teachers"
                ,teachers: result
            });
        });
    },
};