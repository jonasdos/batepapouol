const configtoggle = document.querySelectorAll('.configtoggle')
configtoggle.forEach(item => {
  item.addEventListener('click', chamaConfig)
})

function chamaConfig() {
  let page = document.querySelector('#config')

  if (page.style.display === '' || page.style.display === 'none') {

    page.style.display = 'flex'
  }
  else {

    page.style.display = 'none'
  }
}
