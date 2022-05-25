import React, { useState } from "react";

import "./style.css";

import Header from "../../components/header";

function ListarPerguntas({ backPage }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [selectedValue, setSelectedValue] = useState(0);
  const [respostaCorreta, setRespostaCorreta] = useState(0);

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

  const handleConfirm = () => {
    if (list[index].resposta[selectedValue].idtcorreta === 1) {
      alert("Resposta Correta!");
      setRespostaCorreta(respostaCorreta + 1);
    } else {
      alert("Resposta Errada!");
    }
    setIndex(index + 1);
  };

  React.useEffect(() => {
    fetchQuestions();
  }, []);

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
        <strong className="mt-2" style={{ marginLeft: "10px" }}>
          Questão: {index + 1}/{list.length}
        </strong>
        <br />
        <strong className="mt-2" style={{ marginLeft: "10px" }}>
          Respostas corretas: {respostaCorreta}/{list.length}
        </strong>
        <br />
        <div className="card card-itens mt-4">
          <div>
            {list.length - 1 > index ? (
              <div>
                <strong>Questão {index + 1}</strong>
                <br />
                <span className="mb-2">{list[index].descricaoquestao}</span>
                {(list[index].resposta || []).map((respostaItem, index) => (
                  <div key={respostaItem.id}>
                    <span
                      style={{
                        color:
                          respostaItem.idtcorreta == respostaItem.id
                            ? "#50C878"
                            : "",
                      }}
                    >
                      <div className="form-check mt-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="exampleRadios"
                          id="radio"
                          value={selectedValue === index}
                          onChange={() => setSelectedValue(index)}
                        />
                        <label className="form-check-label" htmlFor="radio">
                          <strong> {index + 1} </strong> -
                          {respostaItem.descricaoresposta}
                        </label>
                      </div>
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                Você acertou {respostaCorreta}/{list.length}!
              </div>
            )}
          </div>
        </div>
        <button
          type="button"
          className="btn btn-primary mt-3 ml-3"
          onClick={() => backPage()}
        >
          Voltar
        </button>
        {list.length - 1 > index ? (
          <button
            type="button"
            className="btn btn-primary mt-3 ml-3"
            onClick={() => handleConfirm()}
          >
            Confirmar
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default ListarPerguntas;
