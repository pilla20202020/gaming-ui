import { createApp } from 'vue'
import App from './App.vue'
import router from './router'


// Bootstrap (if you haven’t already)
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Toastr CSS + JS
import 'toastr/build/toastr.min.css'
import toastr from 'toastr'

// Optional: configure default position, timeouts, etc.
toastr.options = {
  positionClass: 'toast-top-right',
  closeButton: true,
  progressBar: true,
  timeOut: '3000',
}

const app = createApp(App)
app.config.globalProperties.$toastr = toastr
app.use(router).mount('#app')
