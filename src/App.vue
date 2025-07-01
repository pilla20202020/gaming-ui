<template>
  <div class="container py-4">
    <nav class="nav nav-pills mb-4">
      <router-link class="nav-link" to="/">Dashboard</router-link>
      <router-link class="nav-link" to="/teams">Teams</router-link>
      <router-link class="nav-link" to="/players">Players</router-link>
    </nav>
    <router-view />
  </div>
</template>
