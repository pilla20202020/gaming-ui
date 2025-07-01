<template>
  <div>
    <div>
        <h2 class="mb-3">Team Winning Percentages</h2>
        <div v-for="team in teamsPercentage" :key="team.id" class="mb-3">
        <div class="d-flex justify-content-between">
            <strong>{{ team.name }}</strong>
            <small>{{ team.win_percent }}% ({{ team.raw_points }})</small>
        </div>
        <div class="progress">
            <div
                class="progress-bar"
                role="progressbar"
                :style="{
                    width: team.win_percent + '%',
                    backgroundColor: getTeamColor(team.id)
                }"
                :aria-valuenow="team.win_percent"
                aria-valuemin="0"
                aria-valuemax="100"
            >
            </div>
        </div>
        </div>
    </div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-3">Players by Team</h2>
      <button class="btn btn-primary mb-4" @click="openCreateModal">
        + New Player
      </button>
    </div>

    <div class="row">
      <div
        v-for="team in teams"
        :key="team.id"
        class="col-md-6 mb-5"
      >
        <h4>{{ team.name }}</h4>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Kills</th>
              <th>Status</th>
              <th>Points</th>
              <th class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!team.players.length">
              <td colspan="5" class="text-center">No players</td>
            </tr>
            <tr v-for="player in team.players" :key="player.id">
              <td>{{ player.name }}</td>
              <td>{{ player.eliminations }}</td>
              <td>
                <span v-if="player.is_eliminated" class="badge bg-danger">Eliminated</span>
                <span v-else-if="player.is_knocked" class="badge bg-warning text-dark ms-1">Knocked</span>
                <span v-else class="badge bg-success ms-1">Alive</span>
                <span v-if="player.is_in_zone" class="badge bg-info text-dark ms-1">In Zone</span>
              </td>
              <td>{{ player.points }}</td>
              <td class="text-end">
                <button
                  class="btn btn-sm btn-outline-success me-2"
                  @click="openEditModal(player)"
                >Edit</button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  @click="openDeleteModal(player.id, player.name)"
                >Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- CREATE / EDIT PLAYER MODAL -->
    <div
      class="modal fade"
      tabindex="-1"
      ref="playerModalEl"
      id="playerModal"
      aria-labelledby="playerModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <form class="modal-content" @submit.prevent="savePlayer">
          <div class="modal-header">
            <h5 class="modal-title" id="playerModalLabel">
              {{ form.id ? 'Edit Player' : 'New Player' }}
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="playerModal.hide()"
            ></button>
          </div>
          <div class="modal-body">
            <!-- Name -->
            <div class="mb-3">
              <label for="playerName" class="form-label">Name</label>
              <input
                id="playerName"
                v-model="form.name"
                type="text"
                class="form-control"
                required
              />
            </div>
            <!-- Eliminations -->
            <div class="mb-3">
              <label for="playerKills" class="form-label">Eliminations</label>
              <input
                id="playerKills"
                v-model.number="form.eliminations"
                type="number"
                min="0"
                class="form-control"
              />
            </div>
            <!-- Team Select -->
            <div class="mb-3">
                <label for="playerTeam" class="form-label">Team</label>
                <select
                    id="playerTeam"
                    v-model="form.team_id"
                    class="form-select"
                    required
                    :disabled="!!form.id"
                >
                    <option disabled value="">Select Team</option>
                    <option v-for="t in teams" :key="t.id" :value="t.id">
                    {{ t.name }}
                    </option>
                </select>
            </div>
            <!-- Checkboxes -->
            <div class="form-check mb-1">
              <input
                class="form-check-input"
                type="checkbox"
                v-model="form.is_eliminated"
                id="elimCheck"
              />
              <label class="form-check-label" for="elimCheck">
                Eliminated
              </label>
            </div>
            <div class="form-check mb-1">
              <input
                class="form-check-input"
                type="checkbox"
                v-model="form.is_knocked"
                id="knockedCheck"
              />
              <label class="form-check-label" for="knockedCheck">
                Knocked
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                v-model="form.is_in_zone"
                id="zoneCheck"
              />
              <label class="form-check-label" for="zoneCheck">
                In Zone
              </label>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="playerModal.hide()"
            >Cancel</button>
            <button type="submit" class="btn btn-primary">
              {{ form.id ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- DELETE CONFIRM MODAL -->
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
            >Cancel</button>
            <button
              type="button"
              class="btn btn-danger btn-sm"
              @click="confirmDelete"
            >Yes, Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import toastr from 'toastr' 
import { ref, onMounted, nextTick } from 'vue'
import api from '../services/api'
import { Modal } from 'bootstrap'

const teams = ref([])
const teamColors = {
  1: '#4e79a7',
  2: '#f28e2c',
  3: '#e15759',
  4: '#76b7b2',
  5: '#59a14f',
  6: '#edc949',
  7: '#af7aa1',
  8: '#ff9da7',
  9: '#9c755f',
  10: '#bab0ac',
}
const form = ref({
  id: null,
  name: '',
  eliminations: 0,
  team_id: '',
  is_eliminated: false,
  is_knocked: false,
  is_in_zone: false,
})
const deleteTargetId = ref(null)
const deleteTargetName = ref('')

const playerModalEl = ref(null)
const deleteModalEl = ref(null)
const teamsPercentage = ref([])
let playerModal, deleteModal

async function fetchData() {
  const res = await api.get('/teams')
  teams.value = res.data.data
}

async function teamsWinningPercentages() {
  const { data } = await api.get('/winning-percentages')
  teamsPercentage.value = data.data
  
}
function getTeamColor(teamId) {
  return teamColors[teamId] || '#6c757d'
}
function openCreateModal() {
  form.value = {
    id: null,
    name: '',
    eliminations: 0,
    team_id: '',
    is_eliminated: false,
    is_knocked: false,
    is_in_zone: false,
  }
  playerModal.show()
}
function openEditModal(player) {
  form.value = {
    id:            player.id,
    name:          player.name,
    eliminations:  player.eliminations,
    team_id:       player.team_id,
    is_eliminated: !!player.is_eliminated,
    is_knocked:    !!player.is_knocked,
    is_in_zone:    !!player.is_in_zone,
  }
  playerModal.show()
}

async function savePlayer() {
  try {
    if (form.value.id) {
      await api.put(`/players/${form.value.id}`, form.value)
      toastr.success('Player updated!', 'Success')
    } else {
      await api.post('/players', form.value)
      toastr.success('Player created!', 'Success')
    }
    playerModal.hide()
    await fetchData()
    await teamsWinningPercentages()
  } catch (e) {
    console.error(e)

    // Display backend-provided error message if exists
    if (e.response && e.response.data && e.response.data.message) {
      toastr.error(e.response.data.message, 'Error')
    } else {
      toastr.error('Failed to save player.', 'Error')
    }
  }
}




function openDeleteModal(id, name) {
  deleteTargetId.value = id
  deleteTargetName.value = name
  deleteModal.show()
}


async function confirmDelete() {
   try {
    await api.delete(`/players/${deleteTargetId.value}`)
    toastr.info('Team deleted.', 'Deleted')
    deleteModal.hide()
    await fetchData()
    await teamsWinningPercentages()
  } catch (e) {
    console.error(e)
    toastr.error('Failed to delete team.', 'Error')
  }
  
}

onMounted(async () => {
  await fetchData()
  // wait for modal elements to be in DOM
  await nextTick()
  if (playerModalEl.value) {
    playerModal = new Modal(playerModalEl.value, { backdrop: 'static' })
  }
  if (deleteModalEl.value) {
    deleteModal = new Modal(deleteModalEl.value)
  }
await teamsWinningPercentages()
})

</script>
