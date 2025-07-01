<template>
  <div>
    <h2 class="mb-3">Team Winning Percentages</h2>
    <div v-for="team in teams" :key="team.id" class="mb-3">
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
            ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
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
const teams = ref([])

function getTeamColor(teamId) {
  return teamColors[teamId] || '#6c757d' // default gray
}
onMounted(async () => {
  const { data } = await api.get('/winning-percentages')
  teams.value = data.data
})
</script>
