// ------------------- Navegação entre Menu e Chat -----------------------------
// Seletores
const configtoggle = document.querySelectorAll('.configtoggle')

// Liga-Desliga a Página de configuração das mensagens
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

// ------------------- Configurações do servidor ---------------------
const idSala = 'aa27ddac-3812-4d43-befe-480ebb7829e5'
const linkSala = `https://mock-api.driven.com.br/api/v6/uol/participants/${idSala}`
const linkStatus = `https://mock-api.driven.com.br/api/v6/uol/status/${idSala}`
const linkChatHistory = `https://mock-api.driven.com.br/api/v6/uol/messages/${idSala}`

// -------------------Login no chat ---------------------------------
const listAlerts = ['Digite seu nome para entrar no chat', 'Esse nome não está disponível, digite outro']

function solicitarLogin(usuario) {
  const requisicao = axios.post(linkSala, usuario)
  requisicao.then(resposta => loginAprovado(usuario))
  requisicao.catch(error => {
    solicitarLogin({ name: prompt(listAlerts[1]) })
  })
}
solicitarLogin({ name: prompt(listAlerts[0]) })

// ---------------------------- Renderiza configurações ----------------------------

const onlineUsers = [{ name: 'Todos', src: "./assets/people.svg" }]
const contatosBox = document.querySelector('#contatos')
function loginAprovado(user) {
  contatosBox.innerHTML = `<h1>Escolha um contato<br> para enviar mensagem:</h1>
   `
  onlineUsers.push({ name: user.name, src: "./assets/contato.svg" })
  carregaContatos(user)
  const conexao = setInterval(function () {
    const verificaStatus = axios.post(linkStatus, user)
    verificaStatus.then(resp => {
      buscaContatos()
    })
    verificaStatus.catch(error => {
      clearInterval(conexao)
    })
  }, 5000)
}
// --------------------- Renderiza contatos --------------------------------
function carregaContatos() {
  contatosBox.innerHTML = `<h1>Escolha um contato<br> para enviar mensagem:</h1>
   `
  onlineUsers.forEach(item => {
    contatosBox.innerHTML += `
      <div class="item"> 
        <div class="contato">
          <img class="icon" src=${item.src} alt="">
          <p>${item.name}</p>
        </div>`

  })
  esperaClick()
  renderizaFlag()
}
// ------------------------ Atualiza contatos ---------------------------------
function buscaContatos() {
  const requisicao = axios.get(linkSala)
  requisicao.then(users => {
    gravaContatos(users)
  })
  requisicao.catch(error =>
    console.log(error)
  )
}
function gravaContatos(users) {
  users.data.forEach(item => {
    if ((onlineUsers.find(nome => nome.name === item.name)) === undefined) {
      onlineUsers.push({ name: item.name, src: "./assets/contato.svg" })
    }
  })
  onlineUsers.forEach(user => {
    if (user.name === 'Todos') {
    } else {
      let resultado = users.data.find(nome => nome.name === user.name)
      if (resultado === undefined) {
        console.log('Usuário ' + user.name + ' saiu da sala')
        if (user.name === gFlagContato) {
          gFlagContato = 'Todos'
        }
        const deletar = user.name
        const item = onlineUsers.findIndex(user => user.name === deletar)
        onlineUsers.splice(item, 1)

      }
    }
  })
  carregaContatos()
}

// ---------------------------------- Configura mensagem -----------------------------------------------------------
const configSelectIcon = `<svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11 2L4.7 9L2 6.375" stroke="#28BB25" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
let gFlagContato = 'Todos'

function esperaClick() {
  const listaAtualizada = document.querySelectorAll('#contatos .item')
  listaAtualizada.forEach(item => item.addEventListener('click', function () {
    addgreenflag(this)
  }))
}
function cleanGreenFlagContatos() {
  const listaAtualizada = document.querySelectorAll('#contatos .item')
  listaAtualizada.forEach(e => {
    let svg = e.querySelector('svg')
    if (svg != null) {
      svg.innerHTML = null
    }

  })
}

function addgreenflag(item) {
  cleanGreenFlagContatos()
  gFlagContato = item.querySelector('p').innerHTML
  renderizaFlag()
}
function renderizaFlag() {
  const listaAtualizada = document.querySelectorAll('#contatos .item')
  listaAtualizada.forEach(item => {
    if (item.querySelector('p').innerHTML === gFlagContato && item.querySelector('p').nextElementSibling != configSelectIcon) {
      item.innerHTML += configSelectIcon
    }
  })
}
