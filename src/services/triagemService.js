function classifyTicket(title, description) {
  const text = `${title} ${description}`.toLowerCase();

  let category = 'outro';
  let priority = 'media';

  if (
    text.includes('fora do ar') ||
    text.includes('indisponível') ||
    text.includes('não consigo acessar')
  ) {
    category = 'system_unavailable';
    priority = 'alta';
  }

  if (
    text.includes('senha') ||
    text.includes('login') ||
    text.includes('acesso')
  ) {
    category = 'access';
    priority = 'media';
  }

  if (
    text.includes('erro') ||
    text.includes('falha') ||
    text.includes('bug')
  ) {
    category = 'technical_problem';
    priority = 'media';
  }

  if (
    text.includes('urgente') ||
    text.includes('produção parada') ||
    text.includes('todos os usuários')
  ) {
    priority = 'critico';
  }

  return {
    category,
    priority
  };
}

module.exports = {
  classifyTicket
};