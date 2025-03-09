import { sql } from "./db.js"
export class DatabasePostgres {
    async curso_list(search) {
        let cursos;

        if (search) {
            cursos = await sql`SELECT * FROM cursos WHERE title ILIKE ${'%' + search + '%'}`;
        } else {
            cursos = await sql`SELECT * FROM cursos`;
        }

        return cursos;
    }

    async curso_create(curso) {
        const { title, description, professor, duration } = curso;

        await sql`
            INSERT INTO cursos (title, description, professor, duration) 
            VALUES (${title}, ${description}, ${professor}, ${duration})
        `;
    }

    async curso_update(curso_id, curso) {
        const {title, description, professor, duration} = curso

        await sql`update cursos set title = ${title}, description = ${description}, professor = ${professor}, duration = ${duration} WHERE curso_id = ${curso_id}`
    }

    async curso_delete(curso_id) {

        await sql`delete from cursos WHERE curso_id = ${curso_id}`
    }
}