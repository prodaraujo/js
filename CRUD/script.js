function mostrarSecao() {
  const hash = window.location.hash || "#add";

  // Esconde todas as seções
  document.querySelectorAll(".page").forEach(sec => {
    sec.classList.add("hidden");
  });

  // Mostra só a seção correspondente ao hash
  const secao = document.querySelector(hash);
  if (secao) {
    secao.classList.remove("hidden");
  }
}

// Garante que, se não tiver hash, ele vá para #cadastro
window.addEventListener("load", () => {
  if (!window.location.hash) {
    window.location.hash = "#add";
  }
  mostrarSecao();
});

// Atualiza a exibição sempre que mudar o hash
window.addEventListener("hashchange", mostrarSecao);

// GET
function consultar() {
  const nome = document.getElementById("nome-src").value;
  const url = nome 
    ? `http://localhost:3000/usuarios/consulta/${nome}`
    : "http://localhost:3000/usuarios/consulta";

  fetch(url)
    .then(res => res.json())
    .then(dados => {
        if (Array.isArray(dados)) {
            // Se for array de usuários
            mostrarUsuarios(dados);
        } 
        else if (dados && typeof dados === "object" && !Array.isArray(dados)) {
            // Se for um objeto único, transforma em array para exibir
            mostrarUsuarios([dados]);
        } 
        else if (typeof dados === "string") {
            mostrarMensagem(dados);
        } 
        else if (dados && dados.mensagem) {
            mostrarMensagem(dados.mensagem);
        } 
        else {
            // Se for qualquer outro tipo de dado, exibe cru
            mostrarMensagem(JSON.stringify(dados, null, 2));
        }
    })
    .catch(err => {
        console.error("Erro ao buscar dados:", err);
        mostrarMensagem("Erro ao buscar dados. Tente novamente.");
    });

    document.getElementById("nome-src").value = "";
}

function mostrarUsuarios(usuarios) {
    const container = document.getElementById("resultado-container");
    const tbody = document.getElementById("resultado-body");
    tbody.innerHTML = ""; // limpa resultados anteriores

    usuarios.forEach(usuario => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${usuario.id ?? "-"}</td>
            <td>${usuario.nome ?? "-"}</td>
            <td>${usuario.idade ?? "-"}</td>
            <td>${usuario.email ?? "-"}</td>
        `;
        tbody.appendChild(tr);
    });

    container.style.display = "block";
}

function mostrarMensagem(msg) {
    const container = document.getElementById("resultado-container");
    const tbody = document.getElementById("resultado-body");
    tbody.innerHTML = `
        <tr>
            <td colspan="3" style="text-align:center; color:red; font-weight:bold; white-space:pre-wrap;">
                ${msg}
            </td>
        </tr>
    `;
    container.style.display = "block";
}

// Botão fechar
document.getElementById("btn-fechar").addEventListener("click", () => {
  document.getElementById("resultado-container").style.display = "none";
  document.getElementById("resultado-body").innerHTML = ""; // limpa sempre
});

// Fecha a tela de usuários ao clicar nos botões de menu
const botoes = document.querySelectorAll(".menu");
botoes.forEach(btn => {
  btn.addEventListener("click", () => {
    document.getElementById("resultado-container").style.display = "none";
    document.getElementById("resultado-body").innerHTML = "";
  });
});


// POST
function cadastro() {
  const nome = document.getElementById("nome-add").value;
  const idade = document.getElementById("idade-add").value;
  const email = document.getElementById("email-add").value;

  fetch("http://localhost:3000/usuarios/adicionar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nome: nome,
      idade: idade,
      email: email
    })
  })
  .then(res => res.json())
  .then(dados => {
    console.log("Resposta da API:", dados);

    // Exibe uma mensagem de sucesso ou erro
    if (dados && dados.mensagem) {
      alert(dados.mensagem);
    } else {
      alert("Usuário cadastrado com sucesso!");
    }
  })
  .catch(err => {
    console.error("Erro no cadastro:", err);
    alert("Erro ao cadastrar. Verifique o servidor.");
  });
  document.getElementById("nome-add").value = "";
  document.getElementById("idade-add").value = "";
  document.getElementById("email-add").value = "";

}


// DELETE
function deletar() {
  const nome = document.getElementById("nome-del").value.trim();

  if (!nome) {
    alert("Digite um nome para deletar.");
    return;
  }

  const urlConsulta = `http://localhost:3000/usuarios/consulta/${encodeURIComponent(nome)}`;

  // Primeiro consulta se o usuário existe
  fetch(urlConsulta)
    .then(res => res.json())
    .then(dados => {
      let usuarioExiste = false;

      if (Array.isArray(dados) && dados.length > 0) {
        usuarioExiste = true;
      } else if (dados && typeof dados === "object" && !Array.isArray(dados)) {
        usuarioExiste = true; // objeto único
      } else if (typeof dados === "string") {
        usuarioExiste = false;
      }

      if (!usuarioExiste) {
        alert("Usuário não encontrado!");
        return;
      }

      // Se existe, faz DELETE
      const urlDelete = `http://localhost:3000/usuarios/apagar/${encodeURIComponent(nome)}`;
      return fetch(urlDelete, { method: "DELETE" });
    })
    .then(resDelete => {
      if (!resDelete) return; // não há DELETE se usuário não existe

      if (resDelete.ok) {
        alert("Usuário deletado com sucesso!");
        document.getElementById("nome-del").value = "";
        }
    })
    .catch(err => {
      console.error("Erro ao deletar:", err);
      alert("Erro ao deletar usuário. Verifique o servidor.");
    });
}

// PATCH
function editar(event) {
  if (event) event.preventDefault(); // impede submit do form

  const container = document.getElementById("upd");
  const tituloOriginal = document.getElementById("titulo");
  const inputName = document.getElementById("nome-upd");
  const btnEditar = container.querySelector("button"); // pega o botão Editar dentro do form
  const nome = inputName.value.trim();

  if (!nome) {
    alert("Digite um nome para buscar e editar.");
    return;
  }

  // Esconde elementos originais
  tituloOriginal.style.display = "none";
  inputName.style.display = "none";
  btnEditar.style.display = "none"; // esconde o botão Editar também

  // Remove elementos dinâmicos antigos
  document.querySelectorAll(".dinamico").forEach(el => el.remove());

  // Busca usuário
  fetch(`http://localhost:3000/usuarios/consulta/${encodeURIComponent(nome)}`)
    .then(res => {
      if (!res.ok) throw new Error("Registro não encontrado.");
      return res.json();
    })
    .then(pessoa => {
      // --- Cria elementos dinâmicos ---
      const titulo = document.createElement("h2");
      titulo.textContent = `Editar Usuário ${nome }`;
      titulo.classList.add("dinamico");
      container.appendChild(titulo);

      const select = document.createElement("select");
      select.id = "campo-selecionado";
      select.classList.add("dinamico");
      Object.keys(pessoa).forEach(campo => {
        if (campo !== "id") {
          const option = document.createElement("option");
          option.value = campo;
          option.textContent = campo;
          select.appendChild(option);
        }
      });
      container.appendChild(select);

      const input = document.createElement("input");
      input.type = "text";
      input.id = "novo-valor";
      input.placeholder = "Novo valor";
      input.classList.add("dinamico");
      container.appendChild(input);

      const btnAtualizar = document.createElement("button");
      btnAtualizar.textContent = "Atualizar";
      btnAtualizar.type = "button"; // evita submit
      btnAtualizar.classList.add("dinamico");
      container.appendChild(btnAtualizar);

      // --- Evento do botão PATCH ---
      btnAtualizar.onclick = function () {
        const campo = select.value;
        const novoValor = input.value.trim();

        if (!novoValor) {
          alert("Digite o novo valor.");
          return;
        }

        fetch(`http://localhost:3000/usuarios/editar/${encodeURIComponent(nome)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [campo]: novoValor })
        })
          .then(res => res.json())
          .then(resultado => {
            alert(resultado.sucesso ? "Atualizado com sucesso!" : "Falha ao atualizar.");

            // Remove elementos dinâmicos
            document.querySelectorAll(".dinamico").forEach(el => el.remove());

            // Mostra elementos originais novamente
            tituloOriginal.style.display = "block";
            inputName.style.display = "inline-block";
            btnEditar.style.display = "inline-block"; // mostra botão Editar
            inputName.value = ""; // limpa input
          })
          .catch(err => {
            console.error("Erro ao atualizar cliente:", err);
            tituloOriginal.style.display = "block";
            inputName.style.display = "inline-block";
            btnEditar.style.display = "inline-block"; // mostra botão Editar mesmo em erro
          });
      };
    })
    .catch(err => {
      alert("Registro não encontrado.");
      tituloOriginal.style.display = "block";
      inputName.style.display = "inline-block";
      btnEditar.style.display = "inline-block"; // mostra botão Editar
    });
}