import { fastify } from 'fastify'
import fastifyView from '@fastify/view'
import ejs from 'ejs'
import path from 'path'
import { DatabasePostgres } from './database_postgres.js'
import fastifyFormbody from '@fastify/formbody';
import fastifyStatic from '@fastify/static';

const server = fastify() //

server.register(fastifyStatic, {
    root: path.join(process.cwd(), 'static'),
    prefix: '/static/',
});

server.register(fastifyFormbody);

// Registrando o EJS
server.register(fastifyView, {
    engine: { ejs },
    root: path.join(process.cwd(), 'views'),
    layout: false
})

const database = new DatabasePostgres()

// Rota GET para listar cursos
server.get('/', async (request, reply) => {
    const search = request.query.search
    const cursos = await database.curso_list(search)
    return reply.view('index.ejs', { cursos, search })
})

server.get('/cursos', async (request, reply) => {
    const search = request.query.search;
    const cursos = await database.curso_list(search);
    return reply.view('index.ejs', { cursos, search });
});

// Rota GET para o formulário de criação
server.get('/cursos/novo', async (request, reply) => {
    return reply.view('create.ejs')
})

// Rota POST para criar um curso
server.post('/cursos', async (request, reply) => {
    const { title, description, professor, duration } = request.body
    await database.curso_create({ title, description, professor, duration })
    return reply.redirect('/cursos')
})

// Rota GET para editar curso
server.get('/cursos/:curso_id/editar', async (request, reply) => {
    const cursoID = request.params.curso_id
    const [curso] = await database.curso_list() // ou uma função específica para pegar por ID
    return reply.view('edit.ejs', { curso })
})

// Rota POST para atualizar curso
server.post('/cursos/:curso_id', async (request, reply) => {
    const cursoID = request.params.curso_id
    const { title, description, professor, duration } = request.body
    await database.curso_update(cursoID, { title, description, professor, duration })
    return reply.redirect('/cursos')
})

// Rota POST para deletar curso
server.post('/cursos/:curso_id/delete', async (request, reply) => {
    const cursoID = request.params.curso_id
    await database.curso_delete(cursoID)
    return reply.redirect('/cursos')
})

// Inicia o servidor
server.listen({
    host: '0.0.0.0',
    port: process.env.PORT ?? 3333
}, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Servidor rodando em ${address}`)
})