const fs = require('fs');

module.exports = {
    addTeacherPage: (req, res) => {
        res.render('add-teacher.ejs', {
            title: "Welcome to ELiTe | Add a new teacher",
            message: ''
        });
    },
    addTeacher: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let username = req.body.username;
        let email = req.body.email;
        let password_1 = req.body.password_1;
        let password_2 = req.body.password_2;
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = username + '.' + fileExtension;

        let usernameQuery = "SELECT * FROM `teachers` WHERE user_name = '" + username + "'";

        db.query(usernameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Username already exists';
                res.render('add-teacher.ejs', {
                    message,
                    title: "Welcome to ELiTe | Add a new teacher"
                });
            } else {
                // Check if passwords match
                if (password_1 !== password_2) {
                    message = "Passwords don't match. Try again.";
                    res.render('add-teacher.ejs', {
                        message,
                        title: "Welcome to ELiTe | Add a new teacher",
                    });
                } else {
                    // check the filetype before uploading it
                    if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                        // upload the file to the /public/assets/img directory
                        uploadedFile.mv(`public/assets/img/${image_name}`, (err) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            // send the teacher's details to the database
                            let query = "INSERT INTO `teachers` (first_name, last_name, image, user_name, email, password) VALUES ('" +
                                first_name + "', '" + last_name + "', '" + image_name + "', '" + username + "', '" + email + "', '" + password_1 + "')";
                            db.query(query, (err, result) => {
                                if (err) {
                                    return res.status(500).send(err);
                                }
                                res.redirect('/');
                            });
                        });
                    } else {
                        message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                        res.render('add-teacher.ejs', {
                            message,
                            title: "Welcome to ELiTe | Add a new teacher"
                        });
                    }
                }
            }
        });
    },
    editTeacherPage: (req, res) => {
        let teacherId = req.params.id;
        let query = "SELECT * FROM `teachers` WHERE id = '" + teacherId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-teacher.ejs', {
                title: "Edit  Teacher"
                , teacher: result[0]
                , message: ''
            });
        });
    },
    editTeacher: (req, res) => {
        let teacherId = req.params.id;
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let email = req.body.email;
        let password = req.body.password;

        let query = "UPDATE `teachers` SET `first_name` = '" + first_name + "', `last_name` = '" + last_name + "', `email` = '" + email + "', `password` = '" + password + "' WHERE `teachers`.`id` = '" + teacherId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    },
    deleteTeacher: (req, res) => {
        let teacherId = req.params.id;
        let getImageQuery = 'SELECT image from `teachers` WHERE id = "' + teacherId + '"';
        let deleteUserQuery = 'DELETE FROM teachers WHERE id = "' + teacherId + '"';

        db.query(getImageQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            let image = result[0].image;

            fs.unlink(`public/assets/img/${image}`, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                db.query(deleteUserQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/');
                });
            });
        });
    }
};