const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const port = 3000;

app.use(session({
    secret: 'D4n1l0-210997',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuração do banco de dados
const dbPool = new Pool({
    connectionString: 'postgres://zafiwlyc:Z3W2f2IuplKeDcHLD6_7_ChzYOiI17oV@isabelle.db.elephantsql.com/zafiwlyc',
});

dbPool.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados', err.stack);
    } else {
        console.log('Conectado ao banco de dados');
    }
});

// Configuração para servir arquivos estáticos na pasta 'public' de MainPage
app.use(express.static(path.join(__dirname, 'MainPage', 'public')));
app.use(express.static(path.join(__dirname, 'Dashboard', 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'MainPage', 'views', 'index.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'MainPage', 'views', 'index.html'));
});

app.get('/blog.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'MainPage', 'views', 'blog.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'MainPage', 'views', 'login.html'));
});
app.get('/dashboard-escolar.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Dashboard', 'views', 'pages', 'dashboard-escolar.html'));
});
app.get('/cadastrar-rotas-form.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Dashboard', 'views', 'pages', 'cadastrar-rotas-form.html'));
});
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'Dashboard', 'views', 'pages', 'admin.html'));
});
app.get('/admin/dashboard', (req, res) => {
    if (req.session.admin) {
        res.sendFile(path.join(__dirname, 'Dashboard', 'views', 'pages', 'admin-dashboard.html'));
    } else {
        res.status(403).send("Acesso negado. Por favor, faça login como administrador.");
    }
});

app.get('/usuarios', async (req, res) => {
    try {
        const result = await dbPool.query('SELECT id, nome, email, init FROM usuarios');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/admin/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const queryResult = await dbPool.query('SELECT * FROM usuarios WHERE email = $1 AND role = $2', [email, 'admin']);
        if (queryResult.rows.length > 0) {
            const user = queryResult.rows[0];
            if (await bcrypt.compare(senha, user.password)) {
                req.session.admin = user;
                res.redirect('/admin/dashboard'); // Redirecione para o dashboard administrativo
            } else {
                res.status(401).send('Senha incorreta');
            }
        } else {
            res.status(404).send('Conta administrativa não encontrada');
        }
    } catch (error) {
        console.error('Erro de login', error);
        res.status(500).send('Erro ao processar o login');
    }
});

// Atualiza o estado de ativação do usuário
function isAdmin(req, res, next) {
    console.log("Verificando status de administração:", req.session.admin);
    if (req.session.admin && req.session.admin.role === 'admin') {
        next();
    } else {
        console.log("Acesso negado para:", req.session.admin);
        res.status(403).json({ message: 'Acesso negado' });
    }
}


app.post('/update-user-init/:userId', isAdmin, async (req, res) => {
    const { userId } = req.params;
    const { init } = req.body;
    try {
        await dbPool.query('UPDATE usuarios SET init = $1 WHERE id = $2', [init, userId]);
        res.json({ message: 'Status do usuário atualizado com sucesso.' });
    } catch (error) {
        console.error('Erro ao atualizar status do usuário:', error);
        res.status(500).json({ message: 'Erro ao atualizar status do usuário.' });
    }
});

// Excluir usuário
app.delete('/delete-user/:userId', isAdmin, async (req, res) => {
    const { userId } = req.params;
    try {
        await dbPool.query('DELETE FROM usuarios WHERE id = $1', [userId]);
        res.json({ message: 'Usuário excluído com sucesso.' });
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        res.status(500).json({ message: 'Erro ao excluir usuário.' });
    }
});

const saltRounds = 10;

// Rotas
app.post('/cadastrar-usuario', async (req, res) => {
    const { nome_completo, cpf, telefone, email_institucional, senha, estado, municipio, cod_cidade, cod_estado } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(senha, saltRounds);

        const novoUsuario = await dbPool.query(
            'INSERT INTO usuarios (nome, cpf, telefone, email, password, estado, cidade, cod_cidade, cod_estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [nome_completo, cpf, telefone, email_institucional, hashedPassword, estado, municipio, cod_cidade, cod_estado]  // Use a senha hasheada aqui
        );
        res.json(novoUsuario.rows[0]);
    } catch (error) {
        console.error('Erro ao inserir novo usuário:', error);
        res.status(500).json({ error: error.message });
    }
});

// Rota para buscar todos os estados
app.get('/estados', async (req, res) => {
    try {
        const resultado = await dbPool.query('SELECT codigo_uf, nome FROM ibge_estados ORDER BY nome');
        res.json(resultado.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota para buscar municípios baseado no código do estado
app.get('/municipios/:estadoCodigo', async (req, res) => {
    try {
        const estadoCodigo = req.params.estadoCodigo;
        const resultado = await dbPool.query('SELECT codigo_ibge, nome FROM ibge_municipios WHERE codigo_uf = $1 ORDER BY nome', [estadoCodigo]);
        res.json(resultado.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/entrar', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const usuarioData = await dbPool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (usuarioData.rows.length > 0) {
            const user = usuarioData.rows[0];
            const senhaValida = await bcrypt.compare(senha, user.password);
            if (senhaValida && user.init) {
                req.session.user = {
                    id: user.id,
                    nome: user.nome,
                    role: user.role,
                    cidade: user.cidade
                };
                req.session.isAuthenticated = true;
                res.json({ success: true, user: req.session.user });
            } else {
                res.status(401).json({ success: false, message: 'Erro de login.' });
            }
        }
    } catch (error) {
        console.error('Erro ao processar o login', error);
        res.status(500).json({ error: 'Erro no servidor ao tentar entrar.' });
    }
});
app.get('/api/usuario/sessao', (req, res) => {
    if (req.session.user && req.session.isAuthenticated) {
        res.json({ isAuthenticated: true, user: req.session.user });
    } else {
        res.json({ isAuthenticated: false });
    }
});

app.post('/update-user-role/:userId', async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;
    try {
        await dbPool.query('UPDATE usuarios SET role = $1 WHERE id = $2', [role, userId]);
        res.json({ success: true, message: 'Papel atualizado com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/cadastrar-rota', async (req, res) => {
    const { tipoRota, nomeRota, veiculo, motoristas, monitores, horarios, dificuldades } = req.body;

    try {
        // Iniciar transação
        await dbPool.query('BEGIN');

        // Inserir dados na tabela principal 'Rotas'
        const insertRotaQuery = 'INSERT INTO Rotas (tipo, nome) VALUES ($1, $2) RETURNING id_rota';
        const rotaResult = await dbPool.query(insertRotaQuery, [tipoRota, nomeRota]);
        const idRota = rotaResult.rows[0].id_rota;

        // Inserir veículo relacionado à rota, se houver
        if (veiculo) {
            const insertVeiculoRotaQuery = 'INSERT INTO RotaPossuiVeiculo (id_rota, id_veiculo) VALUES ($1, $2)';
            await dbPool.query(insertVeiculoRotaQuery, [idRota, veiculo]);
        }

        // Inserir motoristas relacionados à rota
        if (motoristas && motoristas.length > 0) {
            motoristas.forEach(async motoristaId => {
                const insertMotoristaRotaQuery = 'INSERT INTO RotaDirigidaPorMotorista (id_rota, id_motorista) VALUES ($1, $2)';
                await dbPool.query(insertMotoristaRotaQuery, [idRota, motoristaId]);
            });
        }

        // Inserir monitores relacionados à rota
        if (monitores && monitores.length > 0) {
            monitores.forEach(async monitorId => {
                const insertMonitorRotaQuery = 'INSERT INTO RotaAtendeAluno (id_rota, id_aluno) VALUES ($1, $2)';
                await dbPool.query(insertMonitorRotaQuery, [idRota, monitorId]);
            });
        }

        // Inserir horários de funcionamento
        horarios.forEach(async horario => {
            const fieldMap = {
                manha: 'turno_matutino',
                tarde: 'turno_vespertino',
                noite: 'turno_noturno'
            };
            const updateHorarioQuery = `UPDATE Rotas SET ${fieldMap[horario]} = TRUE WHERE id_rota = $1`;
            await dbPool.query(updateHorarioQuery, [idRota]);
        });

        // Inserir dificuldades de acesso
        dificuldades.forEach(async dificuldade => {
            const fieldMap = {
                porteira: 'da_porteira',
                mataBurro: 'da_mataburro',
                colchete: 'da_colchete',
                atoleiro: 'da_atoleiro',
                ponteRustica: 'da_ponterustica'
            };
            const updateDificuldadeQuery = `UPDATE Rotas SET ${fieldMap[dificuldade]} = TRUE WHERE id_rota = $1`;
            await dbPool.query(updateDificuldadeQuery, [idRota]);
        });

        // Commit da transação
        await dbPool.query('COMMIT');
        res.send('Rota cadastrada com sucesso!');
    } catch (error) {
        // Rollback em caso de erro
        await dbPool.query('ROLLBACK');
        console.error('Erro ao cadastrar rota:', error);
        res.status(500).send('Erro ao cadastrar rota.');
    }
});


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
