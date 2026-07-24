const {
  classifyTicket
} = require('../src/services/triagemService');

describe('Triagem Service', () => {
  test('deve classificar sistema indisponível como alta prioridade', () => {
    const result = classifyTicket(
      'Sistema fora do ar',
      'Não consigo acessar o painel de vendas.'
    );

    expect(result).toEqual({
      category: 'system_unavailable',
      priority: 'alta'
    });
  });

  describe('Triagem Service', () => {
  test('deve classificar problema de acesso', () => {
    const result = classifyTicket(
      'Dúvida',
      'Como altero minha senha?'
    );

    expect(result).toEqual({
      category: 'access',
      priority: 'media'
    });
  });

  test('deve classificar problema desconhecido como outro', () => {
    const result = classifyTicket(
      'Dúvida sobre relatório',
      'Como faço para exportar um relatório em PDF?'
    );

    expect(result).toEqual({
      category: 'outro',
      priority: 'media'
    });
  });
});
});