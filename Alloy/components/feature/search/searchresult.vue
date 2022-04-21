<template>
	<div>
		<div v-if="searchItemCopy">
			<img
				v-if="searchItemCopy.image"
				:src="'/images/' + searchItemCopy.image.fileName"
				alt=""
			>
			<span>
				{{ searchItemCopy.fileLabel }}
			</span>
			<p>
				{{ searchItemCopy.searchvalue }}
			</p>
			<a :href="searchItemCopy.link">
				{{ searchItemCopy.link }}
			</a>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { deepCopy } from '../../../assets/classes/objectClasses'
import { GetLinkToFile } from '../../../assets/classes/alloyClasses'

export default {
	props: {
		searchItem: {
			type: Object,
			required: true
		}
	},

	data () {
		return {
			searchItemCopy: null,
			elementIds: [
				'56f5bbc4-8638-4231-a790-8aab57f81304'
			]
		}
	},

	computed: {
		...mapGetters({
			flatDirectory: 'directory/getDirectory'
		})
	},

	watch: {
		searchItem () {
			this.processSearchItem()
		}
	},

	mounted () {
		this.processSearchItem()
	},

	methods: {
		processSearchItem () {
			// copying the searchresult-object
			this.searchItemCopy = deepCopy(this.searchItem)
			// finding the image-data from the fileData
			const image = this.searchItemCopy.fileData.find(item => item.elementId === this.elementIds[0])
			// checking if image-data has been found
			if (image) {
				// assigning the image-daat to the searchresult
				this.searchItemCopy.image = image.data.images[0]
			}
			// assigning the link to the searchresult
			this.searchItemCopy.link = new GetLinkToFile(this.searchItemCopy.fileId, this.flatDirectory).link
		}
	}
}
</script>

<style lang="scss" scoped>
img {
	max-width: 40px;
	max-height: 40px;
}
</style>
