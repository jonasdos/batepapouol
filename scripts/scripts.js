// Navegação entre Menu e Chat
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

// Configurações da mensagem
const uuid = 'aa27ddac-3812-4d43-befe-480ebb7829e5'
const lksala = `https://mock-api.driven.com.br/api/v6/uol/participants/${uuid}`
const listaContatos = [
  {
    nome: 'Todos',
    status: '',
    imgsrc: '"./assets/people.svg"'
  },
  {
    nome: 'João',
    status: '',
    imgsrc: '"./assets/contato.svg"'
  },
  {
    nome: 'Maria',
    status: '',
    imgsrc: '"./assets/contato.svg"'
  },
]
const listaVisibility = [
  {
    nome: 'Público',
    status: 'ativo'
  },
  {
    nome: 'Reservadamente',
    status: ''
  }
]
// Requisições 
function enviaNome(nome) {
  const requi = axios.post(lksala, { name: nome })
    .then(resp => { console.log('Resposta: ', resp) })
    .catch(error => { console.log(error) })
}
//enviaNome('Joonas')
function dadosArmazenados() {
  const requi = axios.get(lksala)
    .then(resp => { console.log(resp) })
    .catch(error => console.log(error))
  console.log(lksala)
}
dadosArmazenados()
function limpaConfig() {
  const elemento = document.querySelector('#options')
  elemento.innerHTML = ''
  carregaContatos('Mario')
}
limpaConfig()
function carregaContatos(nameUser) {
  //encontra o contato no array - enviar requisição para o servidor
  const contatoAtivo = listaContatos.find(contato => contato.nome === nameUser)
  //verifica se contato existe 
  if (contatoAtivo) {
    console.log('True')
  } else {
    criaNovoUser(nameUser)
  }
}
function criaNovoUser(usuario) {
  listaContatos.push({
    nome: usuario,
    status: '',
    imgsrc: '"./assets/contato.svg"'
  })
  renderizaContatos(listaContatos, usuario)
}
function renderizaContatos(contatos, usuario) {
  const elemento = document.querySelector('#options')
  elemento.innerHTML = '<h1>Escolha um contato<br> para enviar mensagem:</h1>'
  contatos.forEach(item => {
    if (item.nome === usuario) {

    } else if (item.nome === 'Todos') {
      elemento.innerHTML +=
        ` <div class="item"> 
            <div class="contato">
              <img class="icon" src=${item.imgsrc} alt="">
              <p>${item.nome}</p>
            </div>
            <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 2L4.7 9L2 6.375" stroke="#28BB25" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>`
    } else {
      elemento.innerHTML += `
        <div class="item"> 
          <div class="contato">
            <img class="icon" src=${item.imgsrc} alt="">
            <p>${item.nome}</p>
          </div>
        </div>`
    }
  })

  elemento.innerHTML +=
    ` <h1> Escolha a visibilidade</h1>
      <div class="item">
        <div class="contato">
          <img src="./assets/cadeado.svg" alt="">
          <p>Público</p>
        </div>
        <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 2L4.7 9L2 6.375" stroke="#28BB25" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
      </div>
      <div class="item">
        <div class="contato">
        <img src="./assets/cadeado.svg" alt="">
        <p>Reservadamente</p>
      </div>`
}
