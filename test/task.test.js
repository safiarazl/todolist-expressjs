import supertest from "supertest";
import {web} from "../config/web.js";
import {createTestUser, getTestUser, removeTestUser, removeAllTestTask, createTestTask, getTestTask} from "./test-util.js";

describe('POST /api/task/create', function () {
    beforeEach(async () => {
        await createTestUser();

    });
    afterEach(async () => {
        await removeAllTestTask();
        await removeTestUser();
    });

    it('should can create new task', async () => {
        const result = await supertest(web)
            .post('/api/task/create')
            .set('Authorization','test')
            .send({
               title: 'lakukan test',
               description: 'melakukan test dengan benar',
               completed: false 
            });

        expect(result.status).toBe(200);
        expect(result.body.data.title).toBe("lakukan test");
        expect(result.body.data.description).toBe("melakukan test dengan benar");
        expect(result.body.data.completed).toBe(false);
        expect(result.body.data.username).toBe("test");
    });

    it('should reject if request not valid', async () => {
        const result = await supertest(web)
            .post('/api/task/create')
            .set('Authorization','test')
            .send({
               title: ''
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
}); // 1

describe('GET /api/task/:taskid', function () {
    beforeEach(async () => {
        await createTestUser();
        await createTestTask();
    })
    afterEach(async () => {
        await removeAllTestTask();
        await removeTestUser();
    })

    it('should can get task', async () => {
        const testTask = await getTestTask();

        const result = await supertest(web)
            .get(`/api/task/${testTask.id}`)
            .set('Authorization', 'test');
        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(testContact.id);
        expect(result.body.data.first_name).toBe(testContact.first_name);
        expect(result.body.data.last_name).toBe(testContact.last_name);
        expect(result.body.data.email).toBe(testContact.email);
        expect(result.body.data.phone).toBe(testContact.phone);
    })
})