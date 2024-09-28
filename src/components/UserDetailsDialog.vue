<template>
  <v-dialog max-width="600px" :model-value="isOpen" @update:model-value="closeDialog">
    <v-card>
      <v-card-title>
        <span class="text-h5">Detalhes do Usuário</span>
      </v-card-title>
      <v-card-text>
        <p><strong>Nome:</strong> {{ user.name }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>CPF/CNPJ:</strong> {{ user.cpfcnpj }}</p>
        <p><strong>GMA:</strong> {{ user.gma }}</p>
        <p><strong>Status:</strong> {{ user.status }}</p>
        <p><strong>CEP:</strong> {{ user.cep }}</p>
        <div v-if="address" style="padding: 10px">
          <p v-if="address.logradouro"><strong>Logradouro:</strong> {{ address.logradouro }}</p>
          <p v-if="address.bairro"><strong>Bairro:</strong> {{ address.bairro }}</p>
          <p v-if="address.localidade"><strong>Cidade:</strong> {{ address.localidade }}</p>
          <p v-if="address.uf"><strong>Estado:</strong> {{ address.uf }}</p>
        </div>
        <div v-else>
          <v-progress-circular indeterminate />
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="closeDialog">Fechar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import axios from 'axios'
  import { useToast } from 'vue-toastification'

  const toast = useToast()
  const address = ref(null)
  const props = defineProps({
    isOpen: Boolean,
    user: Object,
  })

  const emit = defineEmits(['update:isOpen'])

  const closeDialog = () => {
    emit('update:isOpen', false)
  }

  watch(() => props.user, async newUser => {
    if (newUser?.cep) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${newUser.cep}/json/`)
        if (response.data && !response.data.erro) {
          address.value = response.data
        } else {
          address.value = null
        }
      } catch (error) {
        toast.error('Erro ao buscar dados do CEP:', error)
        address.value = null
      }
    }
  })
</script>
