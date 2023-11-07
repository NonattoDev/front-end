import React, { useEffect } from "react";
import { Container, Row, Col, Nav, Tab } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faTable, faUserCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "./admin.module.css"; // Adicionando um arquivo de estilos separado
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Loading from "@/components/Loading/Loading";
import Clientes from "./clientes/clientes";
import Dashboard from "./dashboard/dashboard";
import CadastroProduto from "./cadastroproduto/cadastroproduto";
import socketIOClient from "socket.io-client";

const AdminPage: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      toast.warn("Você não está autenticado");
      router.push("/");
      return;
    },
  });

  const ENDPOINT = "http://192.168.1.6:3001"; // Substitua pelo seu servidor

  useEffect((): (() => void) => {
    //Socket I.O configurado para mudar o dashboard, de 1 em 1 minuto

    // Conecta ao servidor Socket.IO
    const socket = socketIOClient(ENDPOINT);

    // Define um ouvinte para o evento de atualização do status do PIX
    socket.on("variavelAtualizada", (data) => {
      console.log("Atualização do status do PIX recebida:", data);
    });

    // Limpa e desconecta ao desmontar o componente
    return () => {
      socket.off("variavelAtualizada");
      socket.disconnect();
    };
  }, []);

  if (status === "loading") return <Loading />;

  if (session?.user?.admin === false) {
    toast.warn("Você não está autorizado a acessar esta página");
    router.push("/");
    return;
  }

  return (
    <Container fluid>
      <Tab.Container id="left-tabs-example" defaultActiveKey="analise">
        <Row>
          <Col className={`${styles.sidebar} bg-light min-vh-100 d-flex flex-column align-items-center pt-3`}>
            <Nav className="flex-column w-100" variant="pills">
              <Nav.Item>
                <Nav.Link eventKey="home" href="/" className={styles["nav-item-spacing"]}>
                  <FontAwesomeIcon icon={faHouse} className={styles.icon} />
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="clientes" className={styles["nav-item-spacing"]}>
                  <FontAwesomeIcon icon={faUserCheck} className={styles.icon} />
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="analise" className={styles["nav-item-spacing"]}>
                  <FontAwesomeIcon icon={faTable} className={styles.icon} />
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="cadastroProduto" className={styles["nav-item-spacing"]}>
                  <FontAwesomeIcon icon={faPlus} className={styles.icon} />
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={11}>
            <Tab.Content>
              <Tab.Pane eventKey="clientes">
                <Clientes />
              </Tab.Pane>
              <Tab.Pane eventKey="analise">
                <Dashboard />
              </Tab.Pane>
              <Tab.Pane eventKey="cadastroProduto">
                <CadastroProduto />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default AdminPage;
