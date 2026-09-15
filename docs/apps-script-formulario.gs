/**
 * Apps Script Web App — recebe o formulário de contato do site e grava
 * uma linha na planilha do Google Sheets onde este script está anexado.
 * Não envia e-mail nenhum, só grava na planilha.
 *
 * COMO USAR:
 * 1. Crie uma planilha no Google Sheets.
 * 2. Extensões -> Apps Script.
 * 3. Apague o conteúdo padrão e cole este arquivo inteiro.
 * 4. Implantar -> Nova implantação -> tipo "App da Web".
 *    - Executar como: você mesmo.
 *    - Quem pode acessar: Qualquer pessoa.
 * 5. Implantar, autorizar, e copiar a URL gerada (termina em /exec).
 * 6. Colar essa URL no site (na constante APPS_SCRIPT_URL do JS).
 */

function doPost(e) {
  try {
    var dados = JSON.parse(e.postData.contents);
    var planilha = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    if (planilha.getLastRow() === 0) {
      planilha.appendRow(['Data/Hora', 'Nome', 'E-mail', 'Telefone', 'Mensagem']);
      planilha.getRange(1, 1, 1, 5).setFontWeight('bold');
    }

    var agora = Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'dd/MM/yyyy HH:mm:ss');

    planilha.appendRow([
      agora,
      (dados.nome || '').toString(),
      (dados.email || '').toString(),
      (dados.telefone || '').toString(),
      (dados.mensagem || '').toString(),
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (erro) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'erro', mensagem: erro.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Só pra eu conseguir testar abrindo a URL direto no navegador.
function doGet() {
  return ContentService.createTextOutput('Web app do formulário está no ar.');
}
