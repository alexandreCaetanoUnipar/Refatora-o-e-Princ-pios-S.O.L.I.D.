
// 1. Classe de Banco de Dados Concreta
class BancoDeDadosMySQL {
    salvar(dados: any): void {
        console.log("Salvando dados no MySQL...");
    }
}

// --- 2. OPEN/CLOSED PRINCIPLE (OCP) ---
// uma interface para estratégias de desconto, permitindo novos tipos (como PREMIUM) 
// sem alterar o código existente [1].
interface ICalculadoraDesconto {
    calcular(valor: number): number;
}

class DescontoClienteComum implements ICalculadoraDesconto {
    calcular(valor: number): number { return valor * 0.05; }
}

class DescontoClientePremium implements ICalculadoraDesconto {
    calcular(valor: number): number { return valor * 0.15; }
}

// 2. Interface de tarefas do pedido
interface ITarefasPedido {
    processarPagamento(): void;
    gerarNotaFiscal(): void;
    imprimirEtiquetaFisica(): void;
}

// --- 1. SINGLE RESPONSIBILITY PRINCIPLE (SRP) ---
// O Serviço de Email e o Gerenciador de Pedidos isolam responsabilidades que antes estavam na classe Pedido [1].
class ServicoEmail {
    enviarConfirmacao(): void {
        console.log("Enviando e-mail de confirmação...");
    }
}

class GerenciadorDePedidos {
    constructor(
        private persistencia: IPersistencia,
        private email: ServicoEmail
    ) {}

    // O sistema agora depende de abstrações (IPersistencia) e não de classes concretas (DIP) [1].
    finalizarPedido(pedido: Pedido): void {
        this.persistencia.salvar(pedido);
        this.email.enviarConfirmacao();
        console.log("Pedido finalizado com sucesso!");
    }
}

// --- Exemplo de Uso ---
const meuBD = new BancoDeDadosMySQL();
const servicoEmail = new ServicoEmail();
const gerenciador = new GerenciadorDePedidos(meuBD, servicoEmail);

const novoPedidoDigital = new PedidoProdutoDigital(100, new DescontoClientePremium());
gerenciador.finalizarPedido(novoPedidoDigital);

// 4. Implementação para produtos digitais
class PedidoProdutoDigital extends Pedido implements ITarefasPedido {
   
    calcularFrete(): number {
        throw new Error("Erro: Produtos digitais não possuem frete.");
    }

    processarPagamento(): void {
        console.log("Pagamento processado online.");
    }

    gerarNotaFiscal(): void {
        console.log("Nota fiscal digital gerada.");
    }

    imprimirEtiquetaFisica(): void {
        throw new Error("Erro: Não é possível imprimir etiqueta para produto digital.");
    }
}
