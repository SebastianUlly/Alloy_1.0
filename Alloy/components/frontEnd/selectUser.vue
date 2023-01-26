<template>
    <div
		class="selectUserBackground"
	>
        <select
			v-model="user"
			class="selectUser"
			name=""
			id=""
		>
            <option
				v-for="item in availableUsers"
				class="selectUserOption"
				:value="item.userId"
				:key="item.userId"
			>
				{{ item.name }}
			</option>
        </select>
	</div>
</template>

<script>
import gql from "graphql-tag";
import { mapGetters } from "vuex";

export default {
    data () {
        return {
           user: {},
           availableUsers: []
        };
    },
    
    created() {
		this.getAllUsers()
    },

	computed: {
		...mapGetters({
			userId: 'authentication/getUserId'
		})
	},

	watch: {
		user () {
			this.$emit('userId', this.user)
		}
	},

	methods: {
		getAllUsers () {
			this.$apollo.query({
				query: gql`
					query {
						getAllUser {
							userId
							data
						}
					}
				`
			}).then((data) => {
				// console.log(data)
				for (const user of data.data.getAllUser) {
					this.availableUsers.push({
						userId: user.userId,
						name:
							user.data.find(item => item.elementId === "2d1b9f45-61f4-438d-b682-734000022169").data.text
							+ ' ' + user.data.find(item => item.elementId === "7b990f61-122c-4d14-a234-34bd32472c63").data.text
					})
				}
				this.user = this.userId
				// console.log(this.availableUsers.find(item => item.userId === this.userId), this.user)
			}).catch((error) => {
				console.log({ error })
			})
		}
	}
}
</script>

<style scoped>
.selectUserBackground {
	background-color: #1E1E1E;
	height: 50px;
	width: 250px;
	display: flex;
    align-items: center;
    justify-content: center;
	border-radius: 2px;
}

.selectUser {
	border: solid 1px white;
	border-radius: 4px;
	width: 86%;
	height: 70%;
	color: white;
    text-align: left;
	padding-left: 20px;
}

.selectUserOption {
	background-color: #1E1E1E;
}
</style>