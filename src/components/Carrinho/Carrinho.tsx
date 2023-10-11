import { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import styles from "./Carrinho.module.css";
import { useCarrinhoContext } from "../../context/CarrinhoContext";
import { Form } from "react-bootstrap";

function Carrinho() {
  const { produtosNoCarrinho, handleRemoverProduto, valorMinimoFreteGratis, handleAtualizarQuantidadeProduto } = useCarrinhoContext();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const calcularTotalCompra = () => {
    let total = 0;
    produtosNoCarrinho.forEach((produto) => {
      total += produto.Quantidade * produto.Preco1;
    });
    return total;
  };

  const calcularQuantidadeTotal = () => {
    let quantidadeTotal = 0;
    produtosNoCarrinho.forEach((produto) => {
      quantidadeTotal += produto.Quantidade;
    });
    return quantidadeTotal;
  };

  const calcularValorFrete = () => {
    const totalCompra = calcularTotalCompra();
    if (totalCompra < valorMinimoFreteGratis) {
      return 100; // Valor fixo para o frete quando o valor mínimo não for atingido
    } else {
      return 0; // Frete grátis quando o valor mínimo for atingido
    }
  };

  const calcularTotalCompraComFrete = () => {
    const totalCompra = calcularTotalCompra();
    const valorFrete = calcularValorFrete();
    return totalCompra + valorFrete;
  };

  const atualizarQuantidadeProduto = (CodPro: number, novaQuantidade: number) => {
    handleAtualizarQuantidadeProduto(CodPro, novaQuantidade);
  };

  return (
    <>
      <div className={styles.BotaoCarrinho} data-count={calcularQuantidadeTotal()}>
        <svg
          onClick={handleShow}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
          style={{ width: "40px", height: "40px", color: "blue" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
          />
        </svg>
      </div>

      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Carrinho</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className={styles.itensCarrinho}>
            {produtosNoCarrinho.length === 0 ? (
              <div className={styles.carrinhoVazio}>Você ainda não tem itens no carrinho, inicie as compras</div>
            ) : (
              produtosNoCarrinho.map((produto) => (
                <div className={styles.itemCarrinho} key={produto.CodPro}>
                  <img src={`/fotosProdutos/${produto.Caminho}`} alt={produto.Produto} className={styles.imagemProduto} />
                  <div className={styles.detalhesProduto}>
                    <div className={styles.detalhesProdutoRow}>
                      <p>{produto.Produto}</p>
                      <button className={styles.botaoRemover} onClick={() => handleRemoverProduto(produto.CodPro)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className={styles.detalhesProdutoRow}>
                      <p>R$ {produto.Preco1.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                      <Form.Control
                        type="number"
                        value={produto.Quantidade || 0}
                        onChange={(e) => {
                          const quantidade = e.target.value === "" ? 1 : parseInt(e.target.value);
                          const valorMaximo = produto.Estoque;
                          const novaQuantidade = quantidade > valorMaximo ? valorMaximo : quantidade;
                          atualizarQuantidadeProduto(produto.CodPro, novaQuantidade);
                        }}
                        className={styles.inputQuantidade}
                        min={1}
                        max={produto.Estoque}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {produtosNoCarrinho.length > 0 && (
            <div className={styles.resumoCarrinho}>
              <h6>
                Quantidade total de itens no carrinho: <strong>{calcularQuantidadeTotal()}</strong>
              </h6>
              <h6>
                Total da compra: <strong>R$ {calcularTotalCompra().toLocaleString("pt-br")}</strong>
              </h6>
              <h6>
                Valor do frete: <strong>R$ {calcularValorFrete().toLocaleString("pt-br")}</strong>
              </h6>
              <h6>
                Total da compra com frete: <strong>R$ {calcularTotalCompraComFrete().toLocaleString("pt-br")}</strong>
              </h6>
              <Button variant="primary" className={styles.botaoFinalizarCompra}>
                Finalizar Compra
              </Button>
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Carrinho;
