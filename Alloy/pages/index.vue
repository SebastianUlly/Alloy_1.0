<template>
	<div>
		<h1>
			Home
		</h1>
		<!-- <div class="test-container">
			<input type="text" v-model="label">
			<div v-for="item of queryFileData.data" :key="item.elementId">
				<input type="text" permissionId="" v-model="item.data.text">
			</div>

			<button @click="save()">
				Speichern
			</button>
		</div> -->
	</div>
</template>

<script>
import Cookie from 'js-cookie'
import gql from 'graphql-tag'

export default {
    // apollo: {
    //     queryFileData: gql `
	// 		query {
	// 			queryFileData (
	// 				id:"28261231-93ec-4d00-b393-4e9d92eef317"
	// 			) {
	// 				id
	// 				label
	// 				data
	// 			}
	// 		}
	// 	`
    // },

	data () {
		return {
			label: ''
		}
	},

	// mounted () {
	// 	// this.label = this.queryFileData.label
	// },

	// watch: {
	// 	queryFileData: {
	// 		deep: true,
	// 		handler () {
	// 			this.label = this.queryFileData.label
	// 		}
	// 	}
	// },

    methods: {
        // token() {
        //     const token = Cookie.get("apollo-token");
        //     if (token) {
        //         const base64Url = token.split(".")[1];
        //         const base64 = base64Url.replace("-", "+").replace("_", "/");
        //         const payload = JSON.parse(window.atob(base64));
        //         console.log(payload);
        //         console.log(payload.permissionIds);
        //     }
        // }

		save () {
			this.$apollo.mutate({
				variables: {
					metadata: {
						fileId: this.queryFileData.id,
						label: this.label
					},
					elementsData: this.queryFileData.data,
					permissionIds: [
						// '227aaa02-ed2e-48cb-8b5e-ce2c3b4e4042',
						'02980e02-8aeb-4b89-bc5f-850c20647301'
					]
				},

				mutation: gql`
					mutation (
						$metadata: JSON
						$elementsData: JSON
						$permissionIds: JSON
					) {
						updateFilev2 (
							metadata: $metadata
							elementsData: $elementsData
							permissionIds: $permissionIds
						) {
							id
						}
					}
				`
			}).then((data) => {
				console.log(data)

				// this.$store.commit('infoBox/setSaveTrigger')

				// // create a new instance to add or remove the entity to the directory on every reqired location to change the name
				// const directoryWithChangedName = new EditEntity(this.storeDirectory)
				// // calling the function on the new instance to change the name
				// directoryWithChangedName.changeName(this.valuesToSave.fileId, this.valuesToSave.label)

				// // create a new instance to add or remove the entity to the directory on every reqired location to add or remove the updated file on every required location
				// const directoryWithAddedEntity = new AddEntityToDirectory(
				// 	directoryWithChangedName.directoryCopy,
				// 	{
				// 		fileId: this.valuesToSave.fileId,
				// 		label: this.valuesToSave.label,
				// 		schemaId: this.valuesToSave.schemaId,
				// 		isLeaf: this.selectedSchema.isLeaf
				// 	},
				// 	this.valuesToSave.parentIds)
				// // committing the changed directory to the store
				// this.$store.commit('directory/setToStoreDirectory', directoryWithAddedEntity.directoryCopy)
				// this.getFileDataToId(this.clickedEntityFileId)
			}).catch((error) => {
				console.log({ error })
			})
		}
    },
}
</script>

<style lang="scss" scoped>

input {
	color: white;
	height: 37px;
	width: 300px;
	border: white solid 2px;
	border-radius: 4px;
	margin: 10px 0;
}

button {
	background-color: green;
	height: 50px;
	width: 80px;
	border-radius: 5px;
}

.test-container {
	display: flex;
	// justify-content: space-evenly;
	width: 100vw;
	flex-direction: column;
	align-items: center;
}
</style>