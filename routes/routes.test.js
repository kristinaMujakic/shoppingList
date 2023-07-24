process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
let items = require('../fakeDb');

let item = { name: 'milk', price: 15 };

beforeEach(async () => {
    items.push(item);
});

afterEach(async () => {
    items = [];
});


describe('GET/items', function () {
    test('Gets a list of items', async function () {
        const response = await request(app).get('/items');
        const { items } = response.body;
        expect(response.statusCode).toBe(200);
        expect(items).toHaveLength(1);
    });
});



describe('GET/items/:name', function () {
    test('Gets an item based on its name', async function () {
        const response = await request(app).get(`/items/${item.name}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.item).toEqual(item);
    });

    test('No item 404', async function () {
        const response = await request(app).get('/items/0');
        expect(response.statusCode).toBe(404);
    });
});


describe('POST /items', function () {
    test('Make new item', async function () {
        const response = await request(app)
            .post('/items')
            .send({
                name: 'Butter',
                price: 10
            });
        expect(response.statusCode).toBe(200);
        expect(response.body.item).toHaveProperty('name');
        expect(response.body.item).toHaveProperty('price');
        expect(response.body.item.name).toEqual('Butter');
        expect(response.body.item.price).toEqual(10);
    });
});


describe('PATCH/items/:name', function () {
    test('Update specific item', async function () {
        const response = await request(app)
            .patch(`/items/${item.name}`)
            .send({
                name: 'Bread'
            });
        expect(response.statusCode).toBe(200);
        expect(response.body.item).toEqual({
            name: 'Bread'
        });
    });

    test('No item - 404', async function () {
        const response = await request(app).patch('/items/0');
        expect(response.statusCode).toBe(404);
    });
});

describe('DELETE /items/:name', function () {
    test('Delete specific item', async function () {
        const response = await request(app)
            .delete(`/items/${item.name}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: 'Deleted' });
    });
});
