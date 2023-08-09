export default defineEventHandler((event) => {
  console.log(getRequestURL(event).pathname)
})
