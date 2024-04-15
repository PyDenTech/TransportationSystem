CREATE DATABASE pyexpress;
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    senha VARCHAR(100) NOT NULL,
    codigo_instituicao VARCHAR(20) NOT NULL,
    setor VARCHAR(50),
    funcao VARCHAR(50),
    nome_completo VARCHAR(100),
    numero VARCHAR(15),
    CONSTRAINT unique_email UNIQUE (email),
    CONSTRAINT unique_usuario UNIQUE (usuario)
);

CREATE TABLE enderecos (
    id SERIAL PRIMARY KEY,
    logradouro VARCHAR(100),
    numero VARCHAR(10),
    complemento VARCHAR(100),
    bairro VARCHAR(50),
    cep VARCHAR(9)
);

CREATE TABLE rotas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100)
);

CREATE TABLE fornecedores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    cnpj VARCHAR(18),
    telefone VARCHAR(20),
    email VARCHAR(100),
    endereco_id INT,
    FOREIGN KEY (endereco_id) REFERENCES enderecos(id)
);

CREATE TABLE escolas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    codigo_inep VARCHAR(20),
    latitude NUMERIC(9, 6),
    longitude NUMERIC(9, 6),
    endereco_id INT,
    FOREIGN KEY (endereco_id) REFERENCES enderecos(id)
);

CREATE TABLE alunos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    cpf VARCHAR(14),
    data_nascimento DATE,
    telefone_responsavel VARCHAR(20),
    grau_parentesco VARCHAR(50),
    sexo VARCHAR(20),
    cor_aluno VARCHAR(20),
    deficiencia_caminhar BOOLEAN,
    deficiencia_ouvir BOOLEAN,
    deficiencia_enxergar BOOLEAN,
    deficiencia_mental BOOLEAN,
    escola_id INT,
    rota_id INT,
    turno_estudo VARCHAR(20),
    nivel_ensino VARCHAR(20),
    endereco_id INT,
    FOREIGN KEY (escola_id) REFERENCES escolas(id),
    FOREIGN KEY (rota_id) REFERENCES rotas(id),
    FOREIGN KEY (endereco_id) REFERENCES enderecos(id)
);

CREATE TABLE pontos_parada (
    id SERIAL PRIMARY KEY,
    rota_id INT,
    latitude NUMERIC(9, 6),
    longitude NUMERIC(9, 6),
    endereco_id INT,
    FOREIGN KEY (rota_id) REFERENCES rotas(id),
    FOREIGN KEY (endereco_id) REFERENCES enderecos(id)
);

CREATE TABLE bairros (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100)
);

CREATE TABLE escolas_bairros (
    id SERIAL PRIMARY KEY,
    escola_id INT REFERENCES escolas(id),
    bairro_id INT REFERENCES bairros(id)
);

CREATE TABLE rotas_fornecedores (
    id SERIAL PRIMARY KEY,
    rota_id INT REFERENCES rotas(id),
    fornecedor_id INT REFERENCES fornecedores(id)
);

CREATE TABLE cidades (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE instituicoes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cidade_id INT,
    FOREIGN KEY (cidade_id) REFERENCES cidades(id)
);
