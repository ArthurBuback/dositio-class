/** @type{import('fastify').FastifyPluginAsync<>} */
import createError from '@fastify/error';
export default async function categories(app, options) {
    const InvalidCategoryError = createError('InvalidCategoryError', 'Categoria Inválido.', 400);

    const categories = app.mongo.db.collection('categories');

    app.get('/categories', 
        {
            config: {
                logMe: true
            }
        }, 
        async (request, reply) => {
            return await categories.find().toArray();
        }
    );

    app.post('/categories', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' },
                    //qtd: { type: 'integer' }
                },
                required: ['name', 'qtd']
            }
        },
        config: {
            requireAuthentication: true
        }
    }, async (request, reply) => {
        let category = request.body;
        
        await categories.insertOne(category);

        return reply.code(201).send();
    });

    app.get('/categories/:id', async (request, reply) => {
        let id =  request.params.id;
        let category = await categories.findOne({_id: new app.mongo.ObjectId(id)});
        
        return category;
    });
    
    app.delete('/categories/:id', {
        config: {
            requireAuthentication: true
        }
    }, async (request, reply) => {
        let id =  request.params.id;
        
        await categories.deleteOne({_id: new app.mongo.ObjectId(id)});
        
        return reply.code(204).send();;
    });

    app.put('/categories/:id', {
        config: {
            requireAuthentication: true
        }
    }, async (request, reply) => {
        let id =  request.params.id;
        let category = request.body;
        
        await categories.updateOne({_id: new app.mongo.ObjectId(id)}, {
            $set: {
                name: category.name,
                qtd: category.qtd
            }
        });
        
        return reply.code(204).send();;
    });
}