const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json()); 
app.use(cors());

const repositories = [];

// Mostra todos os repositorios
app.get("/repositories", (request, response, next) => {

  return response.json(repositories);
  
});

// Cria os repositorios
app.post("/repositories", (request, response) => {
  const {url, title, techs} = request.body;

 
  const repository = {
    id:uuid(),
    title,
    techs,
    url,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

// faz um upgrade
app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {url, title, techs} = request.body;

  const repositoryIndex = repositories.findIndex(repository => 
    repository.id === id
  );
    

  if (repositoryIndex === -1){
    return response.status(400).json({error: 'Repositorio não encontrado'})
  };


  const repository = {
    id,
    title,
    techs,
    url,
    likes: repositories[repositoryIndex].likes,
  };

  repositories[repositoryIndex]= repository

  return response.json(repository);
});

// deleta os repositorios 
app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;  

  // busca de repositorio
  const repositoryIndex = repositories.findIndex(repository => 
    repository.id === id
    );

  if (repositoryIndex >= 0){
    repositories.splice(repositoryIndex, 1)
  }else {
    return response.status(400).json({
      error: 'Repositorio não encontrado'
    });
  }

  return response.status(204).send();
});

// das likes no repositorio
app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => 
    repository.id === id
  );

  if (repositoryIndex === -1){
    return response.status(400).json({error: 'Repositorio não encontrado'})
  };

  repositories[repositoryIndex].likes++; //+=1

  return response.json(repositories[repositoryIndex]);

});

module.exports = app;

