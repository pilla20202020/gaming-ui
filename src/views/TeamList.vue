<template>
  <div>
    <h2 class="mb-3">Teams</h2>

    <!-- BUTTON TO LAUNCH CREATE MODAL -->
    <button class="btn btn-primary mb-3" @click="openCreateModal">
      + New Team
    </button>

    <!-- TEAMS LIST -->
    <ul class="list-group">
      <li
        v-for="team in teams"
        :key="team.id"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        {{ team.name }}
        <div>
          <button
            class="btn btn-sm btn-outline-success me-2"
            @click="openEditModal(team)"
          >
            Edit
          </button>
          <button
            class="btn btn-sm btn-outline-danger"
            @click="openDeleteModal(team.id, team.name)"
          >
            Delete
          </button>
        </div>
      </li>
    </ul>

    <!-- CREATE / EDIT TEAM MODAL -->
    <div
      class="modal fade"
      tabindex="-1"
      ref="teamModalEl"
      id="teamModal"
      aria-labelledby="teamModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <form class="modal-content" @submit.prevent="saveTeam">
          <div class="modal-header">
            <h5 class="modal-title" id="teamModalLabel">
              {{ form.id ? 'Edit Team' : 'New Team' }}
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="teamModal.hide()"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="teamName" class="form-label">Team Name</label>
              <input
                id="teamName"
                v-model="form.name"
                type="text"
                class="form-control"
                required
              />
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="teamModal.hide()"
            >
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">
              {{ form.id ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- DELETE CONFIRMATION MODAL -->
    <div
      class="modal fade"
      tabindex="-1"
      ref="deleteModalEl"
      id="deleteModal"
      aria-labelledby="deleteModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteModalLabel">Confirm Delete</h5>
            <button
              type="button"
              class="btn-close"
              @click="deleteModal.hide()"
            ></button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete
            <strong>{{ deleteTargetName }}</strong>?
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary btn-sm"
              @click="deleteModal.hide()"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-danger btn-sm"
              @click="confirmDelete"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import toastr from 'toastr'
import { ref, onMounted } from 'vue'
import api from '../services/api'
import { Modal } from 'bootstrap'
const teams = ref([])
const form = ref({ id: null, name: '' })
const teamModalEl = ref(null)
const deleteModalEl = ref(null)
let teamModal, deleteModal
const deleteTargetId = ref(null)
const deleteTargetName = ref('')
async function fetchTeams() {
  const res = await api.get('/teams')
  teams.value = res.data.data
}
function openCreateModal() {
  form.value = { id: null, name: '' }
  teamModalEl.value && teamModal.show()
}
function openEditModal(team) {
  form.value = { ...team }
  teamModalEl.value && teamModal.show()
}
async function saveTeam() {
  try {
    if (form.value.id) {
      await api.put(`/teams/${form.value.id}`, form.value)
    } else {
      await api.post('/teams', form.value)
    }
    toastr.success(
      form.value.id ? 'Team updated!' : 'Team created!',
      'Success'
    )
  } catch (e) {
    console.error(e)
    toastr.error('Something went wrong.', 'Error')
  }
  teamModal.hide()
  form.value = { id: null, name: '' }
  fetchTeams()
}
function openDeleteModal(id, name) {
  deleteTargetId.value = id
  deleteTargetName.value = name
  deleteModalEl.value && deleteModal.show()
}
async function confirmDelete() {
   try {
    await api.delete(`/teams/${deleteTargetId.value}`)
    toastr.info('Team deleted.', 'Deleted')
    deleteModal.hide()
    fetchTeams()
  } catch (e) {
    console.error(e)
    toastr.error('Failed to delete team.', 'Error')
  }
  
}

onMounted(() => {
  fetchTeams()

  if (teamModalEl.value) {
    teamModal = new Modal(teamModalEl.value, { backdrop: 'static' })
  }
  if (deleteModalEl.value) {
    deleteModal = new Modal(deleteModalEl.value)
  }
})
</script>
