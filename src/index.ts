
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

// --- 4. INTERFACE SEGREGATION PRINCIPLE (ISP) ---
// Segregamos a interface genérica ITarefasPedido em interfaces menores e específicas [1].
interface IProcessadorPagamento {
    processarPagamento(): void;
}

interface IGeradorNotaFiscal {
    gerarNotaFiscal(): void;
}

interface IEntregaFisica {
    calcularFrete(): number;
    imprimirEtiquetaFisica(): void;
}

// --- 3. LISKOV SUBSTITUTION PRINCIPLE (LSP) ---
// Criamos uma classe base para Pedido. Note que PedidoProdutoDigital não herdará 
// comportamentos de entrega física, evitando erros de exceção [1].
abstract class Pedido {
    constructor(
        public valorTotal: number,
        protected calculadoraDesconto: ICalculadoraDesconto
    ) {}

    aplicarDesconto(): number {
        return this.valorTotal - this.calculadoraDesconto.calcular(this.valorTotal);
    }
}

// Pedido Físico implementa todas as interfaces, incluindo entrega [1, 3].
class PedidoFisico extends Pedido implements IProcessadorPagamento, IGeradorNotaFiscal, IEntregaFisica {
    processarPagamento(): void { console.log("Processando pagamento físico..."); }
    gerarNotaFiscal(): void { console.log("Gerando NF para produto físico..."); }
    calcularFrete(): number { return 20.00; }
    imprimirEtiquetaFisica(): void { console.log("Imprimindo etiqueta para envio..."); }
}

// Pedido Digital NÃO implementa IEntregaFisica, respeitando o LSP e o ISP [1].
class PedidoProdutoDigital extends Pedido implements IProcessadorPagamento, IGeradorNotaFiscal {
    processarPagamento(): void { console.log("Processando pagamento digital..."); }
    gerarNotaFiscal(): void { console.log("Gerando NF-e para produto digital..."); }
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
