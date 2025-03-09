import { fastify } from 'fastify'
import { DatabasePostgres } from './database_postgres.js'

const server = fastify()

const database = new DatabasePostgres()

// Rota POST para criar um curso
server.post('/cursos', async (request, reply) => {
    const { title, description, professor, duration } = request.body

    await database.curso_create({
        title,
        description,
        professor,
        duration,
    })

    return reply.status(201).send()
})

// Rota GET para listar cursos
server.get('/cursos', async (request) => {
    const search = request.query.search

    console.log(search)

    const cursos = await database.curso_list(search) // Passando 'search' para a consulta

    return cursos
})

// Rota PUT para atualizar um curso
server.put('/cursos/:curso_id', async (request, reply) => {
    const { title, description, professor, duration } = request.body
    const cursoID = request.params.curso_id


    await database.curso_update(cursoID, {
        title,
        description,
        professor,
        duration,
    })

    return reply.status(204).send() // Sucesso, sem conteúdo
})

// Rota DELETE para deletar um curso
server.delete('/cursos/:curso_id', async (request, reply) => {
    const cursoID = request.params.curso_id

    await database.curso_delete(cursoID)

    return reply.status(204).send() // Sucesso, sem conteúdo
})

// Inicia o servidor na porta 3333
server.listen({
    host: '0.0.0.0',
    port: process.env.PORT ?? 3333,
}, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Servidor rodando em ${address}`)
})