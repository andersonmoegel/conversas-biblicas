# Conversas Bíblicas

## Iniciar a versão corrigida

Requer Node.js 22 ou superior. Mantenha seu arquivo .env com GEMINI_API_KEY na mesma pasta de server.mjs. Não envie a chave no chat nem compartilhe .env. Feche o servidor antigo com Ctrl+C no terminal onde foi iniciado. Abra INICIAR.cmd nesta pasta ou execute npm start. Atualize a página no navegador.

O servidor recarrega o arquivo worker/index.js quando ele é modificado, preservando as variáveis do processo. O servidor antigo precisa ser reiniciado uma vez para receber esse recurso. Não execute duas cópias na mesma porta.

## Como a leitura funciona

1. Consulta o serviço público anônimo usado pela própria página https://www.jw.org/pt/busca/ . A página HTML é uma interface dinâmica e não contém os resultados.
2. O serviço retorna links reais de publicações e da Biblioteca On-line.
3. O leitor segue os redirecionamentos, aceitando somente HTTPS de jw.org e seus subdomínios para conteúdo. O token público da busca fica apenas em memória. Somente os dois endereços exatos do serviço público em b.jw-cdn.org são utilizados para localizar artigos; eles não são fontes religiosas.
4. Extrai o artigo e envia o texto ao Gemini para sintetizar a explicação com referências.
5. Se a busca pública falhar, tenta localizar links pelo Google Grounding, resolve URLs intermediárias verificando o destino e tenta ler as páginas. Nunca usa os links de pesquisa como se fossem artigos lidos.

A consulta pode falhar por bloqueios de rede, páginas indisponíveis, alterações no serviço público ou limites do Gemini. Citações precisam ser conferidas: o programa valida que os números correspondem a fontes, mas não comprova automaticamente o sentido de cada afirmação.

## Diagnosticar sem chave Gemini

Execute npm run diagnose. Esse comando faz uma busca real e lê até cinco páginas, mostrando apenas títulos, endereços e quantidade de caracteres. Não exibe nem usa a chave Gemini. Para outro tema: node diagnose.mjs "O que é o Reino de Deus?".

A versão corrigida informa readerVersion: jw-search-v3 em http://localhost:3000/api/status. A chave não aparece nessa resposta. Se readerVersion não estiver presente, o processo ainda executa a versão antiga.

## Verificações

Execute npm test. Os 16 testes cobrem pesquisa pública, grupos de resultados, redirecionamentos, recusa de domínios externos, leitura de artigo, páginas de bloqueio, citações, falhas e interface. A busca e a leitura reais foram verificadas com os temas sofrimento e ansiedade. A síntese Gemini foi verificada com respostas simuladas; não houve uso da chave configurada em outro processo para testar a nova cópia.

## Recursos e privacidade

Tema do sistema, alto contraste, texto ampliado, redução de movimento, menu móvel, fontes e trechos, aprofundamento, textos bíblicos, nova tentativa e histórico opcional. O histórico é desativado por padrão. Quando ativado, mantém até 60 mensagens no navegador; as quatro mais recentes são enviadas ao Gemini como contexto. Exporte ou apague no menu Histórico e privacidade. A leitura integrada mostra trechos curtos; o conteúdo completo abre na fonte original.

## Hospedagem

worker/index.js também exporta um Worker compatível com Cloudflare. GEMINI_API_KEY é segredo do servidor. GEMINI_MODEL é opcional (padrão gemini-2.5-flash). O servidor local atende somente na própria máquina. Para acesso público, configure autenticação e limites de requisições na hospedagem.


## Validação com Gemini real

A versão instalada em Conversas_Biblicas foi testada com a chave local, que permaneceu intacta. A pergunta sobre sofrimento retornou uma resposta com cinco fontes reais. O validador agora aceita referências agrupadas [1, 2] e intervalos [1–3], sem deixar de rejeitar índices inexistentes. São 19 testes automatizados. Em caso de falha transitória HTTP 5xx, a requisição ao Gemini é repetida uma vez.

Se a porta 3000 estiver ocupada, abra INICIAR-ALTERNATIVO.cmd e acesse http://localhost:3001. Não abra outra cópia se a porta 3001 já estiver em uso. Para voltar à porta 3000, encerre o processo antigo com Ctrl+C no terminal dele.


## Pesquisa e respostas acolhedoras

O chat mostra um indicador enquanto consulta, com animação discreta que respeita redução de movimento, avisos para leitores de tela e botão Cancelar. Os avisos indicam que a consulta está em andamento; não simulam texto gerado nem afirmam que uma etapa técnica específica já terminou. Falhas temporárias recebem no máximo duas tentativas no servidor por chamada ao Gemini e duas tentativas da consulta na interface. Uma nova geração pode corrigir citações inválidas usando os documentos já lidos. Falhas de configuração não recebem novas tentativas. O tempo limite total da interface é de cinco minutos; cancelar interrompe a espera do navegador, mas uma solicitação externa já enviada pode continuar no servidor. As respostas priorizam empatia, consolo fundamentado e respeito, sem culpar a pessoa por ansiedade ou sofrimento. São 22 testes automatizados.


## Troca automática de modelo

O modelo principal continua sendo GEMINI_MODEL. Se falhar por limite, indisponibilidade, modelo inexistente, resposta vazia ou falha de conexão, a chamada tenta Gemini 3.5 Flash e Gemini 2.5 Flash-Lite, nesta ordem, mantendo a pergunta, as instruções e os documentos. GEMINI_FALLBACK_MODELS pode definir uma lista separada por vírgulas. São no máximo três modelos únicos por chamada. Cada modelo tem sua disponibilidade, limites e cobrança próprios; não há garantia de contornar uma cota compartilhada. Falhas de autenticação e bloqueios de segurança não geram alternância. A sequência foi testada com falha real do primeiro modelo e resposta do Gemini 3.5 Flash. São 26 testes automatizados.
