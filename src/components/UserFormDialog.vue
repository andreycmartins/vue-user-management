<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-dialog
    max-width="600px"
    :model-value="dialog"
    @click:outside="closeDialog"
    @update:model-value="updateDialog"
  >
    <v-card>
      <v-card-title>{{ isEditing ? 'Editar Usuário' : 'Criar Usuário' }}</v-card-title>
      <v-card-text>
        <template v-if="isLoading">
          <v-skeleton-loader
            v-for="i in 5"
            :key="i"
            height="100px"
            type="text"
            width="100%"
          />
        </template>
        <template v-else>
          <v-form ref="userForm" @submit.prevent="saveUser">
            <v-text-field
              v-model="userStore.editingUser.name"
              clearable
              label="Nome"
              placeholder="Seu Nome Completo"
              :rules="[rules.required]"
            />
            <v-text-field
              v-model="userStore.editingUser.email"
              clearable
              label="Email"
              placeholder="email@mail.com"
              :rules="[rules.required, rules.email]"
              type="email"
            />
            <v-text-field
              v-model="userStore.editingUser.cpfcnpj"
              v-mask="'##############'"
              clearable
              label="CPF/CNPJ"
              placeholder="CPF ou CNPJ"
              :rules="[rules.required, rules.cpfcnpjCounter]"
              type="number"
            />
            <v-text-field
              v-model="userStore.editingUser.gma"
              clearable
              hint="Ganho Mensal Aproximado"
              label="Ganho Mensal Aproximado"
              min="0"
              placeholder="Ex: 1000.00"
              prefix="R$"
              :rules="[rules.required]"
              type="number"
            />
            <v-text-field
              v-model="userStore.editingUser.cep"
              v-mask="'########'"
              class="no-arrows"
              clearable
              label="CEP"
              :rules="[rules.required, rules.cepCounter]"
              type="text"
            />
            <v-switch
              v-model="userStore.editingUser.status"
              false-value="inativo"
              hide-details
              :label="`Usuário ${editingUser.status}`"
              true-value="ativo"
            />
            <v-card-actions>
              <v-spacer />
              <div class="dialog-actions">
                <v-btn color="red" :disabled="userStore.isLoading" text @click="closeDialog">Cancelar</v-btn>
                <v-btn color="green" :disabled="userStore.isLoading" text @click="saveUser">
                  <v-progress-circular
                    v-if="userStore.isLoading"
                    color=""
                    indeterminate
                  />
                  Salvar
                </v-btn>
              </div>
            </v-card-actions>
          </v-form>
        </template>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

  <script setup>
  import { ref } from 'vue'
  import { useUserStore } from '@/stores/userStore'
  import { useToast } from 'vue-toastification'

  const { dialog, isEditing, editingUser } = defineProps({
    dialog: {
      type: Boolean,
      required: true,
    },
    isEditing: {
      type: Boolean,
      required: true,
    },
    editingUser: {
      type: Object,
      required: true,
    },
    isLoading: {
      type: Object,
      required: true,
    },
  })

  const emit = defineEmits(['update:dialog', 'update:editingUser'])
  const toast = useToast()
  const userStore = useUserStore()
  const userForm = ref(null)

  const rules = {
    required: value => !!value || 'Campo obrigatório',
    email: value => {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return pattern.test(value) || 'E-mail inválido'
    },
    cpfcnpjCounter: value => (value.length === 11 || value.length === 14) || 'CPF ou CNPJ inválido',
    cepCounter: value => value.length === 8 || 'CEP deve conter 8 caracteres',
  }

  const closeDialog = () => {
    emit('update:dialog', false)
    emit('update:editingUser', {})
  }

  let saveAttempts = 0
  const saveUser = async () => {
    saveAttempts++

    if (!userForm.value.isValid) {
      toast.error('Preencha todos os campos corretamente!')
      return
    }

    console.log(userStore.isLoading)
    userStore.setLoading(true)
    console.log(userStore.isLoading)
    await new Promise(resolve => setTimeout(resolve, 500))

    if (saveAttempts % 3 === 0) {
      userStore.setLoading(false)
      toast.error('Erro ao salvar o usuário! (erro falso)')
      return
    }

    try {
      userStore.saveUser()
      toast.success(isEditing ? 'Usuário editado!' : 'Usuário criado!')
      closeDialog()
    } catch (error) {
      console.log(error)
      toast.error('Erro ao salvar o usuário!')
    } finally {
      userStore.setLoading(false)
    }
  }
</script>

<style scoped>
    .dialog-actions {
        display: flex; flex-direction: row; justify-content: space-between; gap: 32px;
    }
</style>
