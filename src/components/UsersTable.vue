<template>
  <div>
    <v-data-table
      :headers="headers"
      item-key="cpfcnpj"
      :items="filteredUsers"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Lista de Usuários</v-toolbar-title>
        </v-toolbar>
        <div class="table-header">
          <v-text-field v-model="search" clearable label="Pesquisar" style="margin-top: 20px;" />
          <v-btn class="open-create-dialog-button" color="primary" @click="openCreateDialog">
            <v-icon>mdi-account-plus</v-icon>&nbsp;Adicionar usuário
          </v-btn>
        </div>
      </template>
      <template #item.actions="{ item: user }">
        <td class="table-td">
          <v-tooltip location="top" text="Editar">
            <template #activator="{ props }">
              <v-btn
                class="edit-btn"
                icon
                rounded
                size="small"
                variant="text"
                v-bind="props"
                @click="openEditDialog(user)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
          <v-tooltip location="top" text="Visualizar">
            <template #activator="{ props }">
              <v-btn
                class="view-btn"
                icon
                rounded
                size="small"
                v-bind="props"
                variant="text"
                @click="openDetailsDialog(user)"
              >
                <v-icon>mdi-eye</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
          <v-tooltip location="top" text="Deletar">
            <template #activator="{ props }">
              <v-btn
                class="delete-btn"
                icon
                rounded
                size="small"
                v-bind="props"
                variant="text"
                @click="deleteDialog(user)"
              >
                <template v-if="userStore.deletingUser === user.cpfcnpj">
                  <v-progress-circular color="white" indeterminate size="20" />
                </template>
                <template v-else>
                  <v-icon color="red">mdi-delete</v-icon>
                </template>
              </v-btn>
            </template>
          </v-tooltip>
          <v-dialog v-model="deleteUserDialog.isOpen" max-width="400">
            <v-card>
              <v-card-title class="text-h6">Confirmação</v-card-title>
              <v-card-text>Tem certeza que deseja deletar o usuário {{ deleteUserDialog.user?.name }}?</v-card-text>
              <v-card-actions>
                <v-btn color="red" text @click="confirmDelete">Sim</v-btn>
                <v-btn color="blue" text @click="deleteUserDialog.isOpen = false">Cancelar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </td>
      </template>
      <template #item.status="{ item }">
        <v-chip class="d-flex justify-center" :color="item.status === 'ativo' ? 'green' : 'red' " style="max-width: 80px;">
          {{ item.status.charAt(0).toUpperCase() + item.status.slice(1) }}
        </v-chip>
      </template>
    </v-data-table>

    <UserDetailsDialog
      :is-open="viewDialog"
      :user="selectedUser"
      @update:is-open="viewDialog = $event"
    />

    <UserFormDialog
      :dialog="dialog"
      :isLoading="isLoading"
      :isEditing="isEditing"
      :editingUser="userStore.editingUser"
      @update:dialog="dialog = $event"
      @update:editingUser="userStore.editingUser = $event"
    />
  </div>
</template>

<script setup>
  import { useUserStore } from '@/stores/userStore'
  import { ref } from 'vue'
  import { useToast } from 'vue-toastification'
  import axios from 'axios'
  import UserDetailsDialog from './UserDetailsDialog.vue'
  import UserFormDialog from './UserFormDialog.vue'

  const toast = useToast()
  const userStore = useUserStore()
  const dialog = ref(false)
  const isEditing = ref(false)
  const viewDialog = ref(false)
  const selectedUser = ref({})
  const address = ref(null)
  const isLoading = ref(false)
  const search = ref('')
  const userForm = ref(null)
  const deleteUserDialog = ref({
    isOpen: false,
    user: null,
  })

  const headers = [
    { title: 'Nome', value: 'name', key: 'name' },
    { title: 'Email', value: 'email', key: 'email' },
    { title: 'CPF/CNPJ', value: 'cpfcnpj', key: 'cpfcnpj' },
    { title: 'GMA', value: 'gma', key: 'gma' },
    { title: 'Status', value: 'status', key: 'status' },
    { title: 'CEP', value: 'cep', key: 'cep' },
    { title: 'Ações', value: 'actions' },
  ]

  const closeDialog = () => {
    userStore.clearEditingUser()
    dialog.value = false
    isEditing.value = false
  }

  const deleteDialog = user => {
    deleteUserDialog.value = { isOpen: true, user }
  }

  const confirmDelete = async () => {
    const { user } = deleteUserDialog.value
    deleteUserDialog.value.isOpen = false

    if (user?.cpfcnpj) {
      try {
      userStore.setDeletingUser(user.cpfcnpj)
      userStore.setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))

      const index = userStore.users.findIndex(u => u.cpfcnpj === user.cpfcnpj)
      if (index !== -1) userStore.users.splice(index, 1)

      toast.success('Usuário deletado!')
      } catch (error) {
        console.log(error)
        toast.error('Erro ao deletar usuário!')
      } finally {
        userStore.setDeletingUser(null)
        userStore.setLoading(false)
      }
    }
  }

  const openCreateDialog = () => {
    closeDialog()
    dialog.value = true
  }

  const openEditDialog = user => {
    closeDialog()
    isLoading.value = true
    dialog.value = true
    isEditing.value = true

    setTimeout(() => {
      userStore.setEditingUser(user)
      isLoading.value = false
    }, 500)
  }

  const openDetailsDialog = async user => {
    selectedUser.value = { ...user }
    viewDialog.value = true
  }
  
  const filteredUsers = computed(() => {
    const lowerSearch = search.value.toLowerCase()
    return userStore.users.filter(user =>
      Object.values(user).some(value =>
        typeof value === 'string' && value.toLowerCase().includes(lowerSearch)
      )
    )
  })

</script>

<style scoped>

.table-header {
  display: flex; gap: 10px; align-items: center; justify-content: space-between;
}

.open-create-dialog-button {
  margin-bottom: 10px; max-width: 200px; margin-top: 10px; margin-left:10px
}

.table-td {
  display: flex; justify-content: space-between;
}
</style>
