import React, { useState } from "react";

import "./style.css";

import Header from "../../components/header";

function ListarPerguntas({ backPage }) {
  const quatityQuestion = [
    "alternativaUm",
    "alternativaDois",
    "alternativaTres",
    "alternativaQuatro",
  ];

  const [formValues, setFormValues] = useState({
    descricaoquestao: "",
    alternativaUm: "",
    alternativaDois: "",
    alternativaTres: "",
    alternativaQuatro: "",
    respostaCorreta: 0,
  });

  const handleSubmit = async () => {
    let account = JSON.parse(localStorage.getItem("user"));
    const headerFetch = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE",
      "Access-Control-Allow-Headers":
        "Origin, X-Request-Width, Content-Type, Accept",
      Authorization: `Bearer ${account.token}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(
      "https://masterquizapi.herokuapp.com/api/Questoes",
      {
        headers: headerFetch,
        method: "POST",
        body: JSON.stringify({
          id: 0,
          descricaoquestao: formValues.descricaoquestao,
          idmateria: "1",
        }),
      }
    )
      .then((response) => response.json())
      .catch(() => alert("Erro ao cadastrar uma questão!"));

    const body = quatityQuestion.map((key, index) => ({
      descricaoresposta: formValues[key],
      idtcorreta: formValues.respostaCorreta == index ? 1 : 0,
      idquestao: response.id,
    }));

    await fetch("https://masterquizapi.herokuapp.com/api/Respostas", {
      headers: headerFetch,
      method: "POST",
      body: JSON.stringify(body),
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      alert("Erro ao cadastrar uma respostas!");
      throw new Error("Erro ao cadastrar uma respostas!");
    });
  };

  return (
    <div>
      <Header />
      <div className="background-perguntas">
        <div className="card card-itens mt-4">
          <div className="form-group mb-4">
            <label htmlFor="exampleFormControlTextarea1">
              Texto da Questão
            </label>
            <textarea
              value={formValues.descricaoquestao}
              onChange={(evt) =>
                setFormValues({
                  ...formValues,
                  descricaoquestao: evt.target.value,
                })
              }
              className="form-control"
              id="exampleFormControlTextarea1"
              placeholder={`Texto completo da questão`}
              rows="3"
            ></textarea>
          </div>
          {quatityQuestion.map((question, index) => (
            <div className="input-group mb-3" key={question}>
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1">
                  {index + 1}
                </span>
              </div>
              <input
                type="text"
                className="form-control"
                aria-label={`Alternativa ${index + 1}`}
                value={formValues[question]}
                onChange={(evt) =>
                  setFormValues({
                    ...formValues,
                    [question]: evt.target.value,
                  })
                }
              />
            </div>
          ))}
          <div className="form-group mb-4">
            <label htmlFor="exampleFormControlTextarea1">
              Resposta correta:
            </label>
            <select
              className="form-select"
              aria-label="Selecione a resposta correta"
              defaultValue={formValues.respostaCorreta}
              onChange={(evt) =>
                setFormValues({
                  ...formValues,
                  respostaCorreta: evt.target.value,
                })
              }
            >
              <option value="0">1</option>
              <option value="1">2</option>
              <option value="2">3</option>
              <option value="3">4</option>
              <option value="4">5</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          className="btn btn btn-outline-primary mt-3 mr-3"
          onClick={() => backPage()}
        >
          Voltar
        </button>
        <button
          type="button"
          className="btn btn-primary mt-3"
          onClick={() => handleSubmit()}
        >
          Confirmar
        </button>
      </div>
    </div>
  );
}

export default ListarPerguntas;
