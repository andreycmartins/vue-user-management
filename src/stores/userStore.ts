import { defineStore } from 'pinia'

interface User {
    name: string;
    email: string;
    cpfcnpj: number | string;
    gma: number;
    status: string;
    cep: string;
  }

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [
      {
        name: 'Joao da Silva',
        email: 'email1@gmail.com',
        cpfcnpj: '12345671289',
        gma: 500,
        status: 'ativo',
        cep: '35130000',
      },
      {
        name: 'Marcos Souza',
        email: 'email2@gmail.com',
        cpfcnpj: '98732654321',
        gma: 600,
        status: 'inativo',
        cep: '89211220',
      }, {
        name: 'Maria Oliveira',
        email: 'maria123@gmail.com',
        cpfcnpj: '45611723789',
        gma: 700,
        status: 'ativo',
        cep: '93340531',
      },
      {
        name: 'Pedro Santos',
        email: 'pedrosantos@gmail.com',
        cpfcnpj: '78945436123',
        gma: 800,
        status: 'inativo',
        cep: '88032740',
      },
      {
        name: 'Ana Pereira',
        email: 'ana.pereira@gmail.com',
        cpfcnpj: '32147789456',
        gma: 900,
        status: 'ativo',
        cep: '97040312',
      },
      {
        name: 'Lucas Ferreira',
        email: 'lucasf@gmail.com',
        cpfcnpj: '65498732531',
        gma: 1000,
        status: 'ativo',
        cep: '59062370',
      },
      {
        name: 'Carla Costa',
        email: 'carla.costa@gmail.com',
        cpfcnpj: '98712173456',
        gma: 1100,
        status: 'inativo',
        cep: '79112270',
      },
    ] as User[],
    editingUser: {
      name: '',
      email: '',
      cpfcnpj: '0',
      gma: 0,
      status: 'Ativo',
      cep: '',
    } as User,
    isLoading: false,
    deletingUser: null as number | null,
  }),
  actions: {
    setEditingUser (user: User) {
      this.editingUser = { ...user }
    },
    saveUser () {
      const index = this.users.findIndex(user => user.cpfcnpj === this.editingUser.cpfcnpj)
      if (index !== -1) {
        this.users.splice(index, 1, this.editingUser)
      } else {
        this.users.push({ ...this.editingUser })
      }
      this.editingUser = {} as User
    },
    clearEditingUser () {
      this.editingUser = {
        status: 'ativo',
      } as User
    },
    deleteUser (cpfcnpj: number) {
      this.users = this.users.filter(user => user.cpfcnpj !== cpfcnpj)
    },
    updateUser (user: User) {
      const index = this.users.findIndex(u => u.cpfcnpj === user.cpfcnpj)
      if (index !== -1) {
        this.users.splice(index, 1, user)
      }
    },
    setLoading (isLoading: boolean) {
      this.isLoading = isLoading
    },
    setDeletingUser (cpfcnpj: number | null) {
      this.deletingUser = cpfcnpj
    },
  },
})
