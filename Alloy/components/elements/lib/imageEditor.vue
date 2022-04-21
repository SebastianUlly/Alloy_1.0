<template>
	<div class="popup">
		<!-- <vue-json-pretty :data="parameters" /> -->
		<vue-cropper
			ref="cropper"
			class="img-cropper"
			:src="url"
			:aspect-ratio="aspectRatio"
			preview=".preview"
		/>
		<div class="actions">
			<a
				href="#"
				role="button"
				@click.prevent="cropImage"
			>
				Übernehmen
			</a>
			<a
				href="#"
				role="button"
				@click.prevent="cancel"
			>
				Abbrechen
			</a>
			<!-- <a
				href="#"
				role="button"
				@click.prevent="showFileChooser"
			>
				Anderes Bild hochladen
			</a> -->
		</div>
	</div>
</template>

<script>
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'

export default {
	components: {
		VueCropper
	},

	props: {
		image: {
			required: true
		},
		parameters: {
			type: Object,
			required: false,
			default: null
		}
	},

	data () {
		return {
			url: '',
			cropImg: '',
			data: null,
			aspectRatio: 2 / 1,
			conversionFactor: 0,
			imageSize: {
				width: 0,
				height: 0
			}
		}
	},

	watch: {
		parameters: {
			deep: true,
			handler () {
				this.startFunction()
			}
		}
	},

	mounted () {
		this.startFunction()
	},

	created () {
		// creating the url of the passed image-file
		this.url = URL.createObjectURL(this.image)
		this.getImageSize()
	},

	methods: {
		startFunction () {
			this.aspectRatio = this.parameters.imageSpecs.width / this.parameters.imageSpecs.width
		},

		async getImageSize () {
			const imageDimensions = file =>
				new Promise((resolve, reject) => {
					const img = new Image()

					// the following handler will fire after the successful loading of the image
					img.onload = () => {
						const { naturalWidth: width, naturalHeight: height } = img
						resolve({ width, height })
					}

					// and this handler will fire if there was an error with the image (like if it's not really an image or a corrupted one)
					img.onerror = () => {
						reject('There was some problem with the image.')
					}

					img.src = URL.createObjectURL(file)
				})

			try {
				const dimensions = await imageDimensions(this.image)
				this.imageSize.width = dimensions.width
				this.imageSize.height = dimensions.height
				this.conversionFactor = 700 / this.imageSize.width
			} catch (error) {
				console.error(error)
			}
		},

		cropImage () {
			// get image data for post processing, e.g. upload or setting image src
			this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL()
			this.data = this.$refs.cropper.getCropBoxData()
			// console.log(this.data)
			// console.log('Conversion: left = ' + Math.ceil(this.data.left / this.conversionFactor) + ' top: ' + Math.ceil(this.data.top / this.conversionFactor) + ' width: ' + Math.ceil(this.data.width / this.conversionFactor) + ' height: ' + Math.ceil(this.data.height / this.conversionFactor))
			const convertedData = {
				left: Math.ceil(this.data.left / this.conversionFactor),
				top: Math.ceil(this.data.top / this.conversionFactor),
				width: Math.ceil(this.data.width / this.conversionFactor),
				height: Math.ceil(this.data.height / this.conversionFactor)
			}
			this.$emit('confirm', convertedData)
		},

		cancel () {
			this.$emit('cancel')
		},

		showFileChooser () {
			this.$refs.input.click()
		}
	}
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/componets/imageEditor.scss';
</style>
