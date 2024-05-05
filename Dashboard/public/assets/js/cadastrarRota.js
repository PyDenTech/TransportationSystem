document.getElementById("btn-add-escola").addEventListener("click", function () {
    var selectedOptions = document.querySelectorAll("#escolasNaoAtendidas option:checked");
    selectedOptions.forEach(function (option) {
        document.getElementById("escolasAtendidas").appendChild(option);
    });
});

// Script para remover escolas
document.getElementById("btn-remove-escola").addEventListener("click", function () {
    var selectedOptions = document.querySelectorAll("#escolasAtendidas option:checked");
    selectedOptions.forEach(function (option) {
        document.getElementById("escolasNaoAtendidas").appendChild(option);
    });
});

// Script para adicionar alunos
document.getElementById("btn-add-aluno").addEventListener("click", function () {
    var selectedOptions = document.querySelectorAll("#alunosNaoAtendidos option:checked");
    selectedOptions.forEach(function (option) {
        document.getElementById("alunosAtendidos").appendChild(option);
    });
});

// Script para remover alunos
document.getElementById("btn-remove-aluno").addEventListener("click", function () {
    var selectedOptions = document.querySelectorAll("#alunosAtendidos option:checked");
    selectedOptions.forEach(function (option) {
        document.getElementById("alunosNaoAtendidos").appendChild(option);
    });
});

function mostrarOcultarBotoes() {
    var tabEscolas = document.getElementById("tab-dados-escola");
    var tabAlunos = document.getElementById("tab-dados-alunos");
    var btnVoltar = document.getElementById("btn-back");
    var btnProximo = document.getElementById("btn-next");
    var btnConcluir = document.getElementById("salvarrota");
    var navLinks = document.querySelectorAll(".nav-item");

    // Botão "Voltar" só deve ser exibido se a aba ativa for "Escolas" ou "Alunos"
    btnVoltar.style.display = (tabEscolas.classList.contains("show") || tabAlunos.classList.contains("show")) ? "inline-block" : "none";

    // Botão "Concluir" só deve ser exibido se a aba ativa for "Alunos"
    btnConcluir.style.display = (tabAlunos.classList.contains("show")) ? "inline-block" : "none";

    // Botão "Próximo" só deve ser exibido se a aba ativa não for "Alunos"
    btnProximo.style.display = (tabAlunos.classList.contains("show")) ? "none" : "inline-block";

    // Botão "Cancelar" deve ser exibido em todas as abas
    document.getElementById("cancelarAcao").style.display = "inline-block";

    // Altera a classe "active" nos itens da lista de navegação com base na aba ativa
    navLinks.forEach(function (link) {
        link.classList.remove("active");
        var tabId = link.querySelector("button").getAttribute("aria-controls");
        var tab = document.getElementById(tabId);
        if (tab.classList.contains("show")) {
            link.classList.add("active");
        }
    });
}

// Adiciona um evento de clique para os botões de navegação
document.getElementById("btn-back").addEventListener("click", function () {
    // Navega para a aba anterior
    var activeTab = document.querySelector(".tab-pane.active");
    var previousTab = activeTab.previousElementSibling;
    if (previousTab) {
        activeTab.classList.remove("show", "active");
        previousTab.classList.add("show", "active");
        mostrarOcultarBotoes();
    }
});

document.getElementById("btn-next").addEventListener("click", function () {
    // Navega para a próxima aba
    var activeTab = document.querySelector(".tab-pane.active");
    var nextTab = activeTab.nextElementSibling;
    if (nextTab) {
        activeTab.classList.remove("show", "active");
        nextTab.classList.add("show", "active");
        mostrarOcultarBotoes();
    }
});

// Adiciona um evento de clique para o botão "Cancelar"
document.getElementById("cancelarAcao").addEventListener("click", function () {
    // Recarrega a página para cancelar a ação
    location.reload();
});

// Inicia a função para mostrar ou ocultar botões quando a página é carregada
window.addEventListener("load", mostrarOcultarBotoes);