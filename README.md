# Conversas Bíblicas

Um espaço para ouvir, aprender e conversar.

Assistente virtual independente que combina Google Gemini com pesquisa e leitura de publicações públicas do jw.org e seus subdomínios. O objetivo é oferecer uma conversa acolhedora, com explicações fundamentadas e fontes que a pessoa possa conferir.

## Conheça o projeto

[Abrir demonstração](https://conversas-biblicas.vercel.app)

Site publicado na Vercel com Gemini configurado. Pesquisa e resposta com fontes verificadas em produção em 15/10/2026.

## O que ele faz

- Pesquisa assuntos no serviço público usado pelo jw.org e lê os artigos encontrados.
- Responde em português com um tom natural, respeitoso e acolhedor, na perspectiva das Testemunhas de Jeová.
- Mostra referências clicáveis e trechos das páginas consultadas.
- Permite aprofundar a explicação ou explorar textos bíblicos.
- Alterna entre modelos Gemini quando um deles falha ou está indisponível.
- Mostra o andamento da pesquisa e permite cancelar a espera.
- Oferece tema claro e escuro conforme o sistema, texto ampliado, alto contraste e redução de movimento.
- Permite salvar o histórico no navegador, exportar ou apagar a conversa. Salvar é opcional e vem desativado.

## Como funciona

Pergunta → busca de artigos → validação dos endereços → leitura das páginas → resposta com Gemini → fontes para consulta.

O conteúdo religioso é recuperado de páginas HTTPS de jw.org e seus subdomínios. A busca utiliza dois endereços públicos específicos de b.jw-cdn.org, indicados na própria página de busca. O Google Search do Gemini funciona como alternativa quando necessário.

A aplicação valida o domínio de cada fonte e seus redirecionamentos. Também confere se os números das referências correspondem a fontes existentes. Isso não garante que toda afirmação esteja correta: a interpretação e o contexto das citações precisam ser conferidos na publicação original.

## Tecnologias

JavaScript, HTML, CSS, Node.js, Google Gemini API e um backend compatível com Cloudflare Workers. A aplicação não precisa de framework de interface nem de pacotes externos para executar localmente.

## Executar localmente

Requisito: Node.js 22 ou superior.

1. Copie .env.example para .env.
2. Preencha GEMINI_API_KEY com sua chave.
3. Execute npm start.
4. Abra http://localhost:3000.

No Windows, também é possível usar INICIAR.cmd. Se a porta estiver ocupada, INICIAR-ALTERNATIVO.cmd inicia na porta 3001.

Nunca publique .env ou sua chave. Na hospedagem, configure GEMINI_API_KEY como segredo do servidor.

Variáveis opcionais: GEMINI_MODEL e GEMINI_FALLBACK_MODELS (lista separada por vírgulas). A sequência padrão preserva o modelo principal configurado e tenta Gemini 3.5 Flash e Gemini 2.5 Flash-Lite como alternativas. Disponibilidade, cotas e cobrança dependem da conta Google utilizada.

## Verificação

Execute npm test. Há 26 testes automatizados cobrindo leitura, pesquisa, fontes, redirecionamentos, alternância de modelos, falhas e sintaxe do código da interface.

Execute npm run diagnose para testar busca e leitura de páginas reais sem usar o Gemini.

Também foram realizados testes reais de pesquisa, leitura e geração com Gemini. Não há certificação formal de acessibilidade ou garantia de exatidão das respostas.

## Privacidade

Perguntas e contexto recente são enviados ao Google Gemini. O histórico opcional fica neste navegador; a aplicação não mantém um banco de conversas. A hospedagem e os serviços externos podem processar dados técnicos das requisições conforme suas políticas. Evite enviar dados pessoais sensíveis.

## Sobre o projeto

Este é um projeto independente, sem vínculo oficial com jw.org ou com a organização das Testemunhas de Jeová. O assistente se identifica como virtual e não representa um porta-voz religioso. O conteúdo original pertence aos seus respectivos titulares.
