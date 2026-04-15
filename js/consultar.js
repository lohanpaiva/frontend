document.addEventListener("DOMContentLoaded", () => {
  const formValidacao = document.getElementById("formValidacao");
  const inputCodigo = document.getElementById("codigo");
  const resultadoValidacao = document.getElementById("resultadoValidacao");

  function getCodigoDaUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("codigo") || "";
  }

  function renderResultado(data) {
    const statusClass = data.valido ? "valido" : "invalido";
    const statusTitulo = data.valido ? "Documento válido" : "Documento inválido";

    resultadoValidacao.innerHTML = `
      <div class="resultado-card ${statusClass}">
        <div class="resultado-topo">
          <span class="status-dot"></span>
          <h2>${statusTitulo}</h2>
        </div>

        <p class="resultado-mensagem">${data.mensagem || ""}</p>

        ${
          data.documento
            ? `
          <div class="resultado-grid">
            <div class="resultado-item">
              <span>Tipo do documento</span>
              <strong>${data.documento.tipo || "-"}</strong>
            </div>
            <div class="resultado-item">
              <span>Data de emissão</span>
              <strong>${data.documento.dataEmissao || "-"}</strong>
            </div>
            <div class="resultado-item">
              <span>Código</span>
              <strong>${data.documento.codigoValidacao || "-"}</strong>
            </div>
            <div class="resultado-item">
              <span>Status</span>
              <strong>${data.status || "-"}</strong>
            </div>
          </div>
        `
            : ""
        }

        ${
          data.paciente || data.medico
            ? `
          <div class="resultado-extra">
            <p><strong>Paciente:</strong> ${data.paciente?.nome || "-"}</p>
            <p><strong>Médico:</strong> ${data.medico?.nome || "-"}</p>
            <p><strong>CRM:</strong> ${data.medico?.crm || "-"} / ${data.medico?.uf || "-"}</p>
          </div>
        `
            : ""
        }
      </div>
    `;
  }

  function renderErro(msg) {
    resultadoValidacao.innerHTML = `
      <div class="resultado-card invalido">
        <div class="resultado-topo">
          <span class="status-dot"></span>
          <h2>Erro na consulta</h2>
        </div>
        <p class="resultado-mensagem">${msg}</p>
      </div>
    `;
  }

  async function consultarCodigo(codigo) {
    resultadoValidacao.innerHTML = `
      <div class="resultado-card carregando">
        <p class="resultado-mensagem">Consultando documento...</p>
      </div>
    `;

    try {
      const API_BASE = "https://SEU-BACKEND.onrender.com";
      const response = await fetch(`${API_BASE}/api/validacao/${codigo}`);
      const data = await response.json();

      renderResultado(data);
    } catch (error) {
      renderErro("Não foi possível validar o documento neste momento.");
    }
  }

  if (formValidacao) {
    formValidacao.addEventListener("submit", async (e) => {
      e.preventDefault();

      const codigo = inputCodigo.value.trim().toUpperCase();

      if (!codigo) {
        renderErro("Digite um código válido.");
        return;
      }

      inputCodigo.value = codigo;
      await consultarCodigo(codigo);
    });
  }

  const codigoUrl = getCodigoDaUrl();

  if (codigoUrl && inputCodigo) {
    inputCodigo.value = codigoUrl.toUpperCase();
    consultarCodigo(codigoUrl.toUpperCase());
  }
});