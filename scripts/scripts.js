// ------------------- Navegação entre Menu e Chat -----------------------------
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
    page.style.display = 'flex'
  }
}

// ------------------- Configurações das mensagens e contatos ---------------------
const idSala = 'aa27ddac-3812-4d43-befe-480ebb7829e5'
const linkSala = `https://mock-api.driven.com.br/api/v6/uol/participants/${idSala}`
const linkStatus = `https://mock-api.driven.com.br/api/v6/uol/status/${idSala}`
const linkChatHistory = `https://mock-api.driven.com.br/api/v6/uol/messages/${idSala}`

const listAlerts = ['Digite seu nome para entrar no chat', 'Esse nome não está disponível, digite outro']

// --------------------- Requisições -------------------------------------------- 
function entrarNoChat(usuario) {
  const requisicao = axios.post(linkSala, usuario)
  requisicao.then(resposta => verificaOnline(usuario))
  requisicao.catch(error => {
    console.log('Nome de usuário já presente no chat')
    console.log(error.data)
    return
  })

}
//entrarNoChat({ name: 'Jonas' })

function verificaOnline(user) {
  setInterval(function () {
    const verificaStatus = axios.post(linkStatus, user)
    verificaStatus.then(resp => carregalistaContatos())
    verificaStatus.catch(error => {
      console.log("Usuário saiu da sala")
      return
    })
  }, 5000)
}

function carregalistaContatos() {
  const requisicao = axios.get(linkSala)

  requisicao.then(resposta => contatosOnline(resposta))
  requisicao.catch(error => console.log(error))
}
function contatosOnline(users) {
  console.log(users)
}



