
// exports.validateInsertBlog = [
//     body('title' ).notEmpty().withMessage('Title is required'),
//     body('description').notEmpty().withMessage('Description is required'),
//     body('active').isBoolean().withMessage('Active must be a boolean value'),
//     body('category').notEmpty().withMessage('Category is required'),
    
//     (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())  {
//         return res.status(400).json({ errors: errors.array() });
//     }
//         next();
//         },
// ];
