import { format } from "@formkit/tempo";

const fridayCountEl = document.getElementById('friday-count')
const gifEl = document.getElementById('time-gif')
const monthsEl = document.getElementById('months')
const weeksEl = document.getElementById('weeks')
const daysEl = document.getElementById('days')
const hoursEl = document.getElementById('hours')

function getRemainingFridays(){
  const today = new Date();
  const endOfYear = new Date(today.getFullYear(), 11, 31);
  let fridays = 0;

  const current = new Date(today);
  while(current <= endOfYear){
        if (current.getDay() === 5) fridays++
    current.setDate(current.getDate() + 1)
    
  }
  return fridays
}

// function getTimeLeft() {
//   const now = new Date()
//   const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59)

//   const diffMs = endOfYear - now
//   const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
//   const diffWeeks = Math.floor(diffDays / 7)
//   const diffMonths = Math.floor(diffDays / 30)
//   const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

//   monthsEl.textContent = diffMonths
//   weeksEl.textContent = diffWeeks
//   daysEl.textContent = diffDays
//   hoursEl.textContent = diffHours
// }
function getTimeLeft() {
  const now = new Date()
  const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59)

  // 1) Diferencia total en ms
  const diffMs = end - now
  const MS_PER_HOUR = 1000 * 60 * 60         // 3_600_000
  const MS_PER_DAY = MS_PER_HOUR * 24       // 86_400_000

  // 2) Horas totales (enteras)
  const totalHours = Math.floor(diffMs / MS_PER_HOUR)

  // 3) Días totales (enteros)
  const totalDays = Math.floor(diffMs / MS_PER_DAY)

  // 4) Semanas completas y días residuales
  const weeks = Math.floor(totalDays / 7)
  const daysRemainingAfterWeeks = totalDays % 7

  // 5) Meses calendario exactos:

  function monthsUntil(endDate, startDate) {
    const startY = startDate.getFullYear()
    const startM = startDate.getMonth()
    const startD = startDate.getDate()
    const endY = endDate.getFullYear()
    const endM = endDate.getMonth()
    const endD = endDate.getDate()

    let months = (endY - startY) * 12 + (endM - startM)
    if (startD > endD) months -= 1
    return months
  }

  const months = monthsUntil(end, now)


  const daysAfterMonths = (() => {

    const startClone = new Date(now.getTime())
    startClone.setMonth(startClone.getMonth() + months)

    let days = Math.floor((end - startClone) / MS_PER_DAY)
    if (days < 0) days = 0
    return days
  })()

  const hours = Math.floor((diffMs % MS_PER_DAY) / MS_PER_HOUR)

  monthsEl.textContent = months
  weeksEl.textContent = weeks
  daysEl.textContent = totalDays
  hoursEl.textContent = totalHours

}

// Fetch to Giphy
async function loadGif() {
  const apiKey = import.meta.env.VITE_GIPHY_API_KEY
  const query = 'time'
  const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=20&rating=g`
  const randomNumber = Math.floor(Math.random() * (10 - 1 + 1) ) + 1;

  console.log('randomNumber:', randomNumber);
  
  try {
    const res = await fetch(url)
    const data = await res.json()
    const gifUrl = data.data[randomNumber]?.images?.downsized_medium?.url
    gifEl.src = gifUrl
  } catch (error) {
    console.error('Error cargando GIF:', error)
  }
}

// 🏁 Inicialización principal
function init() {
  const fridays = getRemainingFridays()
  fridayCountEl.textContent = `Faltan ${fridays} viernes para que termine el año 🎉`

  getTimeLeft()
  loadGif()

  // Actualiza los datos cada hora
  setInterval(getTimeLeft, 3600000)
}

init()