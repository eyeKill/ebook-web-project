<template>
<v-card>
    <v-card-title>
        <span class="headline">
            <v-icon>fas fa-shopping-cart</v-icon>
            购物车
        </span>
        <v-spacer></v-spacer>
        <v-text-field
            v-model="searchString"
            append-icon="fas fa-search" label="搜索"
            single-line hide-details />
    </v-card-title>
    <v-data-table :headers="headers" :items="order" class="elevation-1" :search="searchString">
        <template v-slot:items="props">
            <td>{{ props.item.book.title }}</td>
            <td>
                <v-edit-dialog
                    :return-value.sync="props.item.amount"
                    @save="updateOrderItem(props.item)" lazy> 
                    {{ props.item.amount }}
                    <template v-slot:input>
                        <v-text-field
                        v-model="props.item.amount"
                        type="number" label="编辑数量"
                        single-line counter lazy/>
                    </template>
                </v-edit-dialog>
            </td>
        </template>
        <template v-slot:no-results>
            <v-alert :value="true" color="error" icon="fas fa-warning">
            Your search for "{{ searchString }}" found no results.
            </v-alert>
        </template>
    </v-data-table>
    <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="submitOrder">提交订单</v-btn>
    </v-card-actions>
</v-card>
</template>

<style>

</style>

<script>

export default {
    data() {
        return {
            order: [],
            headers: [

            ],
            searchString: ""
        }
    },
    methods: {
        updateOrderItem(orderItem) {
            let vm = this
            this.$axios.put("/cart", orderItem)
            .then(response => {
                vm.$store.commit("setPrompt", `修改成功`)
                if(orderItem.amount == 0) {
                    // delete the entry
                    console.log(`orderItem.id=${orderItem.id}`)
                    console.log(vm.order)
                    for(let orderitm in vm.order) {
                        console.log(orderitm.id)
                    }
                    vm.order = vm.order.filter(item => (item.id !== orderItem.id))
                }
            })
            .catch(error => {
                vm.$store.commit("setPrompt", `修改失败，${error}`)
            })
        },
        submitOrder() {
            let vm = this
            this.$axios.post("/cart/submit")
            .then(response => {
                vm.$store.commit("setPrompt", "提交成功！")
                vm.order = []
            })
            .catch(error => {
                vm.$store.commit("setPrompt", `提交失败，提示信息：${error}`)
            })
        }
    },
    created() {
        let vm = this
        this.$axios.get("/cart")
        .then((response) => {
            vm.order = response.data.content
        })
        .catch((error) => {
            console.log("fetch data failed, " + error)
        })
    }
}
</script>
