const { Router } = require('express');

const LogEntry = require('../models/LogEntry');

const router = Router();

router.get('/', async (req, res, next) => {
    try {
    const entries = await LogEntry.find()
    res.json(entries); 
    } catch (error) {
        next(error);
    }
   
});

router.get('/:id', async (req, res, next) => {
    try {
        const log = await LogEntry.findById(req.params.id)
        res.json(log)
    } catch (error) {
        next(error)
    }
})

router.post('/',  async (req, res, next) => {
    try {
        const newEntry = new LogEntry(req.body);
        const createdEntry =  await newEntry.save();
        res.json(createdEntry);
    } catch (error) {
        if(error.name === 'ValidationError'){
            res.status(422)
        }
        next(error)
    } 
})

router.put('/update/:id', async(req, res, next) =>{
    try {
			const id = req.params.id
			const updateObject = req.body
			const updatedObject = await LogEntry.findOneAndUpdate({_id: id}, updateObject, {new: true}).exec()
			
			return res.status(200).send({
				data_updated: updatedObject
			});
    } catch (error) {
        next(error)
		}
})

router.delete('/delete/:id', async (req, res, next) => {
	const id = req.params.id;
	const toDeleteEntry = await LogEntry.findByIdAndRemove(id, { useFindAndModify: false})
		.exec()
		.then(() => res.status(204).json({
				success: true
		}))
		.catch((err) => res.status(500).json({
				success: false,
		}));
})

module.exports = router;