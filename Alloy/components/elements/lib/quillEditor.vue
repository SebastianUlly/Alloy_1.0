# name: Quill Editor
# author: Sebastian ULLY
# type: Text Editor
# version: 1.0
# date: 04.02.2022
# external dependents: /
# internal dependents: Has Changed Indicator

<template>
	<!-- container to hold all thats neccessary for the editor-element -->
	<div class="editor" style="position:relative;">
		<!-- label to the input-field -->
		<span class="editor__label">
			{{ label }}
		</span>
		<div
			id="editorcontainer"
			style="min-height:100%; overflow-y:hidden;"
		>
			<div id="editor" style="min-height:100%; height:auto;">
				<client-only>
					<quill-editor
						v-model="dataToEdit"
						:options="parameters.toolbarOptions"
					/>
				</client-only>
			</div>
		</div>
		<!-- error-message to the input -->
		<span
			v-if="parameters.required && !dataToEdit"
			class="editor__error"
		>
			required
		</span>
		<div class="editor__error">
			<has-changed-indicator
				:old-data="dataOriginal"
				:new-data="dataToEdit"
			/>
		</div>
	</div>
</template>

<script>
export default {
	inheritAttrs: false,
	props: {
		label: {
			type: String,
			required: true
		},
		dataOriginal: {
			type: String,
			required: false,
			default: ''
		},
		parameters: {
			type: Object,
			required: false,
			default: null
		}
	},

	data () {
		return {
			dataToEdit: ''
		}
	},

	watch: {
		dataOriginal (value) {
			this.dataToEdit = value
		},
		// watcher to watch the entered data
		dataToEdit (value) {
			this.$emit('update', value)
		}
	},

	mounted () {
		this.dataToEdit = this.dataOriginal
	}
}
</script>

<style lang="scss">
@import '../../../assets/scss/componets/quillEditor.scss';
</style>
