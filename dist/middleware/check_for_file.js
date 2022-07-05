"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkForFile = (req, res, next) => {
    if (!req.file)
        return res.status(400).json({ message: 'Error Uploading File' });
    next();
};
exports.default = checkForFile;
