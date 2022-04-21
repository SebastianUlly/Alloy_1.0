<template>
	<div class="main">
		<form autocomplete="off">
			<div class="autocomplete">
				<!-- input-field for the search-input -->
				<input
					id="myInputForAutoComplete"
					v-model="searchValue"
					type="text"
				>
				<!-- unordered list for autocomplete-results -->
				<!-- <ul
					v-show="isOpen"
					class="autocomplete-results"
				>
					list-item to display the individual autocomplete-results
					<li
						v-for="(result, index) in autocomplete"
						:key="index"
						class="autocomplete-result"
						:class="{ 'is-active': index === arrowCounter }"
						@click="setResult(result)"
					>
						{{ result }}
					</li>
				</ul> -->
				<!-- button to click when ready to search -->
				<button
					@click="onEnter"
				>
					<v-icon>
						mdi-magnify
					</v-icon>
				</button>
				<!-- button to click when input-field has to be cleared -->
				<button @click="searchValue = ''; arrowCounter = -1">
					<v-icon>
						mdi-close
					</v-icon>
				</button>
			</div>
		</form>
	</div>
</template>

<script>
// uncomment if used in webshop
// import { mapGetters } from 'vuex'

import gql from 'graphql-tag'

export default {
	apollo: {
		autocomplete: gql`
			query autocomplete {
				autocomplete
			} 
		`
	},

	data () {
		return {
			searchValue: '',
			searchResult: [],
			isOpen: false,
			results: [],
			arrowCounter: -1
		}
	},

	computed: {
		// uncomment if used in webshop
	// 	...mapGetters({
	// 		schema: ''
	// 	})
	},

	mounted () {
		// adding an event-listener when the component is mounted
		// the event-listener is responsible for detecting when the client clicks outside of the input-field and the autocomplete-list
		document.addEventListener('click', this.handleClickOutside)

		this.autocompleteOnInput(document.getElementById('myInputForAutoComplete'), this.autocomplete)
	},
	destroyed () {
		// removing an event-listener when the component is destroyed
		document.removeEventListener('click', this.handleClickOutside)
	},

	methods: {
		autocompleteOnInput (inp, arr) {
			// the autocomplete function takes two arguments,
			// the text field element and an array of possible autocompleted values:
			let currentFocus
			// execute a function when someone writes in the text field:
			inp.addEventListener('input', function () {
				let b
				let i
				const val = this.value
				// close any already open lists of autocompleted values
				closeAllLists()
				if (!val) {
					return false
				}
				currentFocus = -1
				// create a DIV element that will contain the items (values):
				const a = document.createElement('DIV')
				a.setAttribute('id', this.id + 'autocomplete-list')
				a.setAttribute('class', 'autocomplete-items')
				// append the DIV element as a child of the autocomplete container:
				this.parentNode.appendChild(a)
				// for each item in the array...
				for (i = 0; i < arr.length; i++) {
					// check if the item starts with the same letters as the text field value:
					if (arr[i].substr(0, val.length).toUpperCase() === val.toUpperCase()) {
						// create a DIV element for each matching element:
						b = document.createElement('DIV')
						// make the matching letters bold:
						b.innerHTML = '<strong>' + arr[i].substr(0, val.length) + '</strong>'
						b.innerHTML += arr[i].substr(val.length)
						// insert a input field that will hold the current array item's value:
						b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>"
						// execute a function when someone clicks on the item value (DIV element):
						b.addEventListener('click', function () {
							// insert the value for the autocomplete text field:
							inp.value = this.getElementsByTagName('input')[0].value
							// close the list of autocompleted values,
							// (or any other open lists of autocompleted values:
							closeAllLists()
						})
						a.appendChild(b)
					}
				}
			})
			// execute a function presses a key on the keyboard:
			inp.addEventListener('keydown', function (e) {
				let x = document.getElementById(this.id + 'autocomplete-list')
				if (x) {
					x = x.getElementsByTagName('div')
				}
				if (e.keyCode === 40) {
					// If the arrow DOWN key is pressed,
					// increase the currentFocus variable:
					currentFocus++
					// and and make the current item more visible:
					addActive(x)
				} else if (e.keyCode === 38) { // up
					// If the arrow UP key is pressed,
					// decrease the currentFocus variable:
					currentFocus--
					// and and make the current item more visible:
					addActive(x)
				} else if (e.keyCode === 13) {
					// If the ENTER key is pressed, prevent the form from being submitted,
					e.preventDefault()
					if (currentFocus > -1) {
					// and simulate a click on the "active" item:
						if (x) {
							x[currentFocus].click()
						}
					}
				}
			})
			function addActive (x) {
				// a function to classify an item as "active":
				if (!x) {
					return false
				}
				// start by removing the "active" class on all items:
				removeActive(x)
				if (currentFocus >= x.length) {
					currentFocus = 0
				}
				if (currentFocus < 0) {
					currentFocus = (x.length - 1)
				}
				// add class "autocomplete-active":
				x[currentFocus].classList.add('autocomplete-active')
			}
			function removeActive (x) {
				// a function to remove the "active" class from all autocomplete items:
				for (let i = 0; i < x.length; i++) {
					x[i].classList.remove('autocomplete-active')
				}
			}
			function closeAllLists (elmnt) {
				// close all autocomplete lists in the document,
				// except the one passed as an argument:
				const x = document.getElementsByClassName('autocomplete-items')
				for (let i = 0; i < x.length; i++) {
					if (elmnt !== x[i] && elmnt !== inp) {
						x[i].parentNode.removeChild(x[i])
					}
				}
			}
			// execute a function when someone clicks in the document:
			document.addEventListener('click', function (e) {
				closeAllLists(e.target)
			})
		},

		// function to filter the searchResults in order to display the autocomplete-options
		filterResults () {
			this.results = this.searchResult.filter(item => item.fileLabel.toLowerCase().includes(this.searchValue.toLowerCase()) > -1)
		},

		// function that is called when the result is being set from the autocomlpete-options
		setResult (result) {
			this.searchValue = result
			this.isOpen = false
			this.arrowCounter = -1
			this.$emit('search', this.searchValue)
		},

		// function that handles whenever the client clicks outside of the input-filed and autocomplete-container
		handleClickOutside (event) {
			if (!this.$el.contains(event.target)) {
				this.arrowCounter = -1
				this.isOpen = false
			}
		},

		// function that is called when the client wants to search for the searchValue (enter-key or search-icon)
		onEnter () {
			if (this.arrowCounter !== -1) {
				this.searchValue = this.results[this.arrowCounter].fileLabel
			}
			this.arrowCounter = -1
			this.isOpen = false
			this.$emit('search', this.searchValue)
		}
	}
}
</script>

<style lang="scss" scoped>
/*the container must be positioned relative:*/
.autocomplete {
  position: relative;
  display: inline-block;
}

input {
  border: 1px solid transparent;
  background-color: #f1f1f1;
  padding: 10px;
  font-size: 16px;
}

input[type=text] {
  background-color: #f1f1f1;
  width: 100%;
}

.autocomplete-items {
  position: absolute;
  border: 1px solid #d4d4d4;
  border-bottom: none;
  border-top: none;
  z-index: 99;
  /*position the autocomplete items to be the same width as the container:*/
  top: 100%;
  left: 0;
  right: 0;
}

.autocomplete-items div {
  padding: 10px;
  cursor: pointer;
  background-color: #fff;
  border-bottom: 1px solid #d4d4d4;
}

/*when hovering an item:*/
.autocomplete-items div:hover {
  background-color: #e9e9e9;
}

/*when navigating through the items using the arrow keys:*/
.autocomplete-active {
  background-color: green;
  color: #ffffff;
}
</style>
