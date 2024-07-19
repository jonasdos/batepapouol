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
    page.style.display = 'none'
  }
}

// ------------------- Configurações do servidor ---------------------
const idSala = '313a6cea-68ee-4ae7-b019-d38e574856aa'
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
let usuario = ''
function loginAprovado(user) {

  contatosBox.innerHTML = `<h1>Escolha um contato<br> para enviar mensagem:</h1>
   `

  carregaContatos()
  onlineUsers.push({ name: user.name, src: "./assets/contato.svg" })
  usuario = user.name
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
    if (item.name === usuario) { }
    else {
      contatosBox.innerHTML += `
      <div class="item"> 
        <div class="contato">
          <img class="icon" src=${item.src} alt="">
          <p>${item.name}</p>
        </div>`
    }
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
let gflagVisibilidade = 'Público'
function esperaClick() {
  const listaAtualizada = document.querySelectorAll('#contatos .item')
  listaAtualizada.forEach(item => item.addEventListener('click', function () {
    addgreenflag(this)
  }))
}

// ----------------------------- Seleciona contato para enviar a mensagem ---------------------------------------------------------------------
const listaVisibilidade = document.querySelectorAll('#visibilidade .item')
listaVisibilidade.forEach(item => item.addEventListener('click', function () {
  addVisibilidade(this)
}))
function cleanGreenFlagContatos() {
  const listaAtualizada = document.querySelectorAll('#contatos .item')
  listaAtualizada.forEach(e => {
    let svg = e.querySelector('svg')
    if (svg != null) {
      svg.remove()
    }
  })
}
function addgreenflag(item) {
  cleanGreenFlagContatos()
  gFlagContato = item.querySelector('p').innerHTML
  atualizaConfigMsg()
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
//--------------------- Seleciona o nível de visibilidade da mensagem ---------------------------
function addVisibilidade(item) {
  cleanGreenFlagVisibilidade()
  gflagVisibilidade = item.querySelector('p').innerHTML
  atualizaConfigMsg()
  renderizaFlagVisibilidade()
}
function cleanGreenFlagVisibilidade() {
  const listaVisibilidade = document.querySelectorAll('#visibilidade .item')
  listaVisibilidade.forEach(e => {
    let svg = e.querySelector('svg')
    if (svg != null) {
      svg.remove()
    }
  })
}
function renderizaFlagVisibilidade() {
  const listaAtualizada = document.querySelectorAll('#visibilidade .item')
  listaAtualizada.forEach(item => {
    if (item.querySelector('p').innerHTML === gflagVisibilidade && item.querySelector('p').nextElementSibling != configSelectIcon) {
      item.innerHTML += configSelectIcon
    }
  })
}

// ----------------------------------------- Iniciar chat ------------------------------------------
const chatBox = document.querySelector('article')

function loadChat() {

  let requisicao = axios.get(linkChatHistory)
  requisicao.then(resp => atualizaChat(resp.data))
  requisicao.catch(error => console.log('erro: ' + error))

}
function atualizaChat(historico) {
  chatBox.innerHTML = ''
  historico.forEach(item => {
    if (item.type === 'status') {
      chatBox.insertAdjacentHTML('beforeend', `<div class="msg log">
      <p><span class="horario">(${item.time})</span><span class="nome">${item.from}</span> ${item.text}</p>
      </div>`)
    }
    else if (item.type === 'message') {
      chatBox.insertAdjacentHTML('beforeend', `<div class="msg">
      <p><span class="horario">(${item.time})</span><span class="nome">${item.from}</span> para <span class="nome">${item.to}</span>: ${item.text} </p>
      </div>`)
    }
    else if (item.type === 'private_message') {
      if (item.to === usuario || item.from === usuario) {
        chatBox.insertAdjacentHTML('beforeend', `<div class="msg private">
      <p><span class="horario">(${item.time})</span><span class="nome">${item.from}</span> reservadamente para <span class="nome">${item.to}</span>: ${item.text} </p>
      </div>`)
      }
    }
  }
  )
  const scrolar = chatBox.querySelector('div:last-child')
  scrolar.scrollIntoView()
}
// ---------------------------- Mostra a configuração da mensagem ------------------
const configMsg = document.querySelector('.inputbox p')
const botaoEnviar = document.querySelector('.botaoEnviar')
botaoEnviar.addEventListener('click', enviaMsg)
document.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    enviaMsg()
  }
})
function atualizaConfigMsg() {
  configMsg.innerHTML = `Enviando para ${gFlagContato}(${gflagVisibilidade})`
}

//-------------------------- Envia mensagem ------------------------------------------
function enviaMsg() {
  const mensagem = document.querySelector('input').value
  if (mensagem === '') { return }
  const tipoMsg = gflagVisibilidade === 'Reservadamente' ? 'private_message' : 'message'
  const mensagemData = {
    from: usuario,
    to: gFlagContato,
    text: mensagem,
    type: tipoMsg
  }
  limpaInput()
  const novaMsg = axios.post(linkChatHistory, mensagemData)
  novaMsg.then(res => loadChat())
  novaMsg.catch(erro => window.location.reload())
}
function limpaInput() {
  document.querySelector('input').value = ''
}

setInterval(function () {
  loadChat()
}, 3000)

setInterval(function () {
  carregaContatos()
}, 10000)