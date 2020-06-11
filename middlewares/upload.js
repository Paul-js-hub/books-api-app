import multer from 'multer';
import path from 'path';

module.exports = (req, res, next) => {
    const fileFilter = (req, file, cb) => {
        if (file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/png") {
            cb(null, true);

            return next();
        } else {
            cb(null, false);
        }
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './uploads/');
        },
        filename: (req, file, cb) => {
            cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
        }

    });

    const upload = multer({
        storage: storage,
        limits: {
            fileSize: 1024 * 1024 * 5
        },
        fileFilter: fileFilter
    }).single('bookImage')

}