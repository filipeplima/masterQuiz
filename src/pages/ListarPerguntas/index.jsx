import React, { useState } from "react";

import "./style.css";

import Header from "../../components/header";
import Accordion from "../../components/Accordion";

function ListarPerguntas({ backPage }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    setLoading(true);
    let account = JSON.parse(localStorage.getItem("user"));
    const response = await fetch(
      "http://masterquizapi.herokuapp.com/api/Questoes",
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE",
          "Access-Control-Allow-Headers":
            "Origin, X-Request-Width, Content-Type, Accept",
          Authorization: `Bearer ${account.token}`,
          "Content-Type": "application/json",
        },
      }
    ).then((response) => response.json());

    let myArry = [];
    for (let index = 0; index < response.length; index++) {
      let responseResposta = await fetchRespostas(response[index].id);
      myArry.push({ ...response[index], resposta: responseResposta });
    }

    console.log(myArry);

    setLoading(false);
    setList(myArry);
  };

  const fetchRespostas = async (id) => {
    let account = JSON.parse(localStorage.getItem("user"));
    const response = await fetch(
      `http://masterquizapi.herokuapp.com/api/Respostas/${id}`,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE",
          "Access-Control-Allow-Headers":
            "Origin, X-Request-Width, Content-Type, Accept",
          Authorization: `Bearer ${account.token}`,
          "Content-Type": "application/json",
        },
      }
    ).then((response) => response.json());
    return response;
  };

  React.useEffect(() => {
    fetchQuestions();
  }, []);

  const handleRemove = async (id) => {
    setLoading(true);
    let account = JSON.parse(localStorage.getItem("user"));
    await fetch(`http://masterquizapi.herokuapp.com/api/Questoes/${id}`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE",
        "Access-Control-Allow-Headers":
          "Origin, X-Request-Width, Content-Type, Accept",
        Authorization: `Bearer ${account.token}`,
        "Content-Type": "application/json",
      },
      method: "DELETE",
    })
      .then(() => alert("Item deletado com sucesso!"))
      .catch(() => alert("Erro ao deletar questão de ID: " + id));
    fetchQuestions();
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="w-100">
          <div className="d-flex justify-content-center">Carregando...</div>
        </div>
      </>
    );
  }

  return (
    <div>
      <Header />
      <div className="background-perguntas">
        <div className="card card-itens mt-4">
          {list.map(({ descricaoquestao, resposta, id }) => (
            <Accordion title={descricaoquestao} key={id}>
              {(resposta || []).map((respostaItem, index) => (
                <div key={respostaItem.id}>
                  <span
                    style={{
                      color: !respostaItem.idtcorreta ? "#50C878" : "",
                    }}
                  >
                    <strong> {index + 1} </strong> -
                    {respostaItem.descricaoresposta}
                  </span>
                </div>
              ))}
              <div className="actions">
                <span
                  role="button"
                  className="text-danger"
                  onClick={() => handleRemove(id)}
                >
                  Deletar
                </span>
              </div>
            </Accordion>
          ))}
        </div>
        <button
          type="button"
          className="btn btn-primary mt-3 ml-3"
          onClick={() => backPage()}
        >
          Voltar
        </button>
      </div>
    </div>
  );
}

export default ListarPerguntas;
