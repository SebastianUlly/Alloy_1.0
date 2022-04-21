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

router.post('/image/uploadImage/', upload.single('file'), (req, res) => {
	// console.log(__dirname)
	// console.log(req.file)
	// console.log(req.file.mimetype)

	res.json({ file: req.file })
})

// function to move a file from one folder to another => by renaming the path of the file
router.put('/image/moveImage', function (req, res) {
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


// #####################################################################################################

// import fs from 'fs'
// import path from 'path'
// import multer from 'multer'
// import { Router } from 'express'
// // import sharp from 'sharp'
// // import gulp from 'gulp'
// import jp2 from 'gulp-jpeg-2000'
// import streamify from 'stream-array'
// import File from 'vinyl'

// function transformBufferWithGulpPlugin (inputBuffer, gulpPlugin) {
// 	return new Promise(function (resolve, reject) {
// 		streamify([new File({ path: 'dummy', contents: inputBuffer })])
// 			.pipe(gulpPlugin)
// 			.on('error', reject)
// 			.on('data', function (file) {
// 				resolve(file.contents)
// 			})
// 	})
// }

// // transformBufferWithGulpPlugin(Buffer.from('<p>\n Test \n</p>'), jp2())
// // 	.then(function (result) {
// // 		console.log(result.toString())
// // 	}, function (error) {
// // 		console.error(error)
// // 	})

// // const convertToWebP = async (buffer, location) => {

// // }

// // const convertToJPF = async (buffer, location) => {
// // 	await gulp.src
// // }

// // const convertToWebPandJPF = async (buffer, location) => {

// // }

// const router = Router()

// const storage = multer.diskStorage({
// 	destination (req, file, cb) {
// 		cb(null, './static/uploads/')
// 	},
// 	filename (req, file, cb) {
// 		// const name = uuidv4().toString()
// 		// console.log(name)
// 		cb(null, Date.now() + '.' + file.mimetype.split('/')[1])
// 	}
// })

// const upload = multer({ storage })

// router.post('/image/uploadImage/', upload.single('file'), (req, res) => {
// 	// console.log(__dirname)
// 	// console.log(req.file)
// 	fs.readFile('./static/uploads/' + req.file.filename, async (err, data) => {
// 		if (err) {
// 			throw err
// 		}
// 		console.log(data)
// 		// const testBuffer = await transformBufferWithGulpPlugin(data, jp2())
// 		transformBufferWithGulpPlugin(Buffer.from(data), jp2())
// 			.then(function (result) {
// 				console.log(result.toString())
// 			}, function (error) {
// 				console.error(error)
// 			})
// 		// await sharp(testBuffer)
// 		// 	.webp()
// 		// 	.toFile('./static/uploads/' + req.file.filename.split('.')[0] + '.webp', (err, info) => {
// 		// 		if (err) {
// 		// 			throw err
// 		// 		}
// 		// 		console.log(info)
// 		// 	})
// 	})
// 	// console.log(test)
// 	// console.log(req.file.mimetype)

// 	res.json({ file: req.file })
// })

// // function to move a file from one folder to another => by renaming the path of the file
// router.put('/image/moveImage', function (req, res) {
// 	// console.log(req)
// 	const pathToStatic = path.join(__dirname, '../', '../')
// 	const oldFilePath = path.join(pathToStatic, req.query.oldPath)
// 	const newFilePath = path.join(pathToStatic, req.query.newPath)
// 	// console.log('hellllooläsödlf', req)

// 	fs.rename(oldFilePath, newFilePath, function (error) {
// 		if (error) {
// 			// throw error
// 			return res.send('Error!!!')
// 		} else {
// 			return res.send('Successfully deleted')
// 		}
// 		// console.log('Moved!!!')
// 	})
// })

// module.exports = router
