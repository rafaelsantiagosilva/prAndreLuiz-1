import { getLista, novo } from "./acessa_dados_quartos.js";

let indiceSelecionado = -1;

async function cadastrarUsuario(usuario) {
  const API_URL = "http://localhost:8000/quartos/cadastrar"; //endpoint da api 
  console.log(usuario);
  
  try {
    //usando fetch para fazer requisição na api 
    const resposta = await fetch(API_URL, {
      method: "POST", // Método HTTP para cadastro
      headers: {
        "Content-Type": "application/json", // Indica que o corpo da requisição é JSON
      },
      body: JSON.stringify(usuario), // Converte o objeto para JSON
    });

    if (!resposta.ok) {
      //se der algo difente de "ok" ele vai disparar um erro
      throw new Error(
        `Erro ao cadastrar usuário: ${resposta.status} - ${resposta.statusText}`
      );
    }

    const dados = await resposta.json(); // armazenando a resposta da api
    console.log("Usuário cadastrado com sucesso:", dados); //mostrando no console se der bom
  } catch (erro) {
    console.error("Erro na requisição:", erro.message); // se algo quebra ele mostra aqui
  }
}

async function salvar(event) {
  event.preventDefault();
  const iptNumero = document.getElementById("numero");
  const iptBloco = document.getElementById("bloco");
  const iptIdCliente = document.getElementById("idcliente");
  const iptDescricao = document.getElementById("descricao");

  const obj = {
    numero: iptNumero.value,
    bloco: iptBloco.value,
    idcliente: iptIdCliente.value,
    descricao: iptDescricao.value
  };

  const dados = getLista();

  if (indiceSelecionado === -1) {
    await cadastrarUsuario(obj); // chamando a função que vai cadastrar o usuario
    novo(obj);
  } else {
    dados[indiceSelecionado] = obj;
    indiceSelecionado = -1;
  }

  desenhaTabela();
  limparCampos();
}

function desenhaTabela() {
  const tbody = document.getElementById("tbody1");
  const dados = getLista();
  tbody.innerHTML = "";
  for (let i = 0; i < dados.length; i++) {
    const tr = document.createElement("tr");
    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    const td4 = document.createElement("td");
    const td5 = document.createElement("td");
    const btnEditar = document.createElement("button");

    td1.innerText = dados[i].numero;
    td2.innerText = dados[i].bloco;
    td3.innerText = dados[i].idcliente;
    td4.innerText = dados[i].descricao;

    btnEditar.innerText = "Editar";
    btnEditar.classList.add("edit-button");
    btnEditar.addEventListener("click", () => editar(i));
    td5.appendChild(btnEditar);
    td5.style = "border: none";
    tr.append(td1, td2, td3, td4, td5);

    tr.addEventListener("click", () => selecionarLinha(i));

    if (i === indiceSelecionado) {
      tr.style.backgroundColor = "#ADD8E6";
    }

    tbody.append(tr);
  }
}

function selecionarLinha(indice) {
  indiceSelecionado = indice;
  desenhaTabela();
}

function editar(indice) {
  const dados = getLista();
  const cliente = dados[indice];
  document.getElementById("numero").value = quarto.numero;
  document.getElementById("bloco").value = quarto.bloco;
  document.getElementById("idcliente").value = quarto.idcliente;
  document.getElementById("descricao").value = quarto.descricao;
  indiceSelecionado = indice;
}

function excluir(event) {
  event.preventDefault();
  if (indiceSelecionado > -1) {
    const dados = getLista();
    dados.splice(indiceSelecionado, 1);
    indiceSelecionado = -1;
    desenhaTabela();
  } else {
    alert("Selecione o quarto que deseja excluir da base de dados.");
  }
}

function limparTabela(event) {
  event.preventDefault();
  const tbody = document.getElementById("tbody1");
  tbody.innerHTML = "";
  const dados = getLista();
  dados.splice(0, dados.length);
}

function limparCampos() {
  document.getElementById("numero").value = "";
  document.getElementById("bloco").value = "";
  document.getElementById("idcliente").value = "";
  document.getElementById("descricao").value = "";
}

const btSalvar = document.getElementById("btSalvar");
btSalvar.addEventListener("click", salvar);

const btLimpar = document.getElementById("btLimpar");
btLimpar.addEventListener("click", limparTabela);

const btExcluir = document.getElementById("btExcluir");
btExcluir.addEventListener("click", excluir);
