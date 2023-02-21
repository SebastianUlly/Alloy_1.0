// @ts-nocheck

import fs from 'fs'
import path from 'path'
import multer from 'multer'
import { Router } from 'express'

const router = Router()

const storage = multer.diskStorage({
	destination (req, file, cb) {
		cb(null, './static/uploads/')
	},
	filename (req, file, cb) {
		// const name = uuidv4().toString()
		// console.log(name)
		cb(null, Date.now() + '.' + file.mimetype.split('/')[1])
	}
})

const upload = multer({ storage })

router.post('/file/uploadFile/', upload.single('file'), (req, res) => {
	// console.log(__dirname)
	// console.log(req.file)
	// console.log(req.file.mimetype)

	res.json({ file: req.file })
})

// function to move a file from one folder to another => by renaming the path of the file
router.put('/file/moveFile', function (req, res) {
	const pathToStatic = path.join(__dirname, '../', '../')
	const oldFilePath = path.join(pathToStatic, req.query.oldPath)
	const newFilePath = path.join(pathToStatic, req.query.newPath)
	console.log('hellllool')

	fs.rename(oldFilePath, newFilePath, function (error) {
		if (error) {
			// throw error
			return res.send('Error!!!')
		} else {
			return res.send('Successfully moved')
		}
		// console.log('Moved!!!')
	})
})

module.exports = router