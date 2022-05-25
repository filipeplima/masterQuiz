import React from "react";

import "bootstrap/dist/css/bootstrap.css";

import "./App.css";

import CadastrarPergunta from "./pages/CadastrarPergunta";
import ListarPerguntas from "./pages/ListarPerguntas";
import Quiz from "./pages/Quiz";

function App() {
  const [isProfessor, setIsProfessor] = React.useState(false);
  const [page, setPage] = React.useState();

  const colors = ["#2b23cc", "#2d266f", "#F96900", "#D62828"];

  const handleBack = () => {
    setPage(undefined);
  };

  const authLogin = async () => {
    let account = JSON.parse(localStorage.getItem("user"));
    // if (account.type === "aluno") {
    //   const result = await fetch(
    //     "http://masterquizapi.herokuapp.com/api/Quiz/1",
    //     {
    //       headers: {
    //         "Access-Control-Allow-Origin": "*",
    //         "Access-Control-Allow-Credentials": "true",
    //         "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE",
    //         "Access-Control-Allow-Headers":
    //           "Origin, X-Request-Width, Content-Type, Accept",
    //         Authorization: `Bearer ${account.token}`,
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   ).then((response) => response.json());
    //   console.log(result);
    //   const newArry = result.filter((item) => !!item.descricaoquestao);
    //   setQuizes(newArry);
    // }
    setIsProfessor(account.type === "professor");
  };

  React.useEffect(() => {
    authLogin();
  }, []);

  const handleProfessor = () => (
    <div className="Menu">
      <h3>Portal do Professor</h3>
      <div className="d-flex justify-content-center">
        <div>
          <div
            className="card-content-option"
            style={{ backgroundColor: colors[1] }}
            onClick={() => setPage(<CadastrarPergunta backPage={handleBack} />)}
          >
            Cadastrar Perguntas
          </div>
        </div>
        <div
          className="card-content-option"
          style={{ backgroundColor: colors[2] }}
          onClick={() => setPage(<ListarPerguntas backPage={handleBack} />)}
        >
          Listar Perguntas
        </div>
      </div>
    </div>
  );

  const handleAluno = () => (
    <div className="Menu">
      <h3>Portal do Aluno</h3>
      <div className="d-flex justify-content-center flex-wrap">
        <div>
          <div
            className="card-content-option"
            style={{ backgroundColor: colors[3] }}
            onClick={() => setPage(<Quiz backPage={handleBack} />)}
          >
            Realizar Quiz
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="App">
      {!page ? <>{isProfessor ? handleProfessor() : handleAluno()}</> : null}
      {page}
    </div>
  );
}

export default App;
