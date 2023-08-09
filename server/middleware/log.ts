export default defineEventHandler((event) => {
  console.info(`New request: ${getRequestURL(event)}`)
})
