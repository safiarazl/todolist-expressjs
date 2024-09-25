import supertest from "supertest";
import { web } from "../config/web.js";
import {
  createTestUser,
  removeTestUser,
  removeAllTestTask,
  createTestTask,
  getTestTask,
  createManyTestTask,
} from "./test-util.js";

describe("POST /api/task/create", function () {
  beforeEach(async () => {
    await createTestUser();
  });
  afterEach(async () => {
    await removeAllTestTask();
    await removeTestUser();
  });

  it("should can create new task", async () => {
    const result = await supertest(web)
      .post("/api/task/create")
      .set("Authorization", "test")
      .send({
        title: "lakukan test",
        description: "melakukan test dengan benar",
        completed: false,
      });

    expect(result.status).toBe(200);
    expect(result.body.data.title).toBe("lakukan test");
    expect(result.body.data.description).toBe("melakukan test dengan benar");
    expect(result.body.data.completed).toBe(false);
    expect(result.body.data.username).toBe("test");
  });

  it("should reject if request not valid", async () => {
    const result = await supertest(web)
      .post("/api/task/create")
      .set("Authorization", "test")
      .send({
        title: "",
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
}); // 1

describe("GET /api/task/:taskid", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestTask();
  });
  afterEach(async () => {
    await removeAllTestTask();
    await removeTestUser();
  });

  it("should can get task", async () => {
    const testTask = await getTestTask();

    const result = await supertest(web)
      .get(`/api/task/${testTask.id}`)
      .set("Authorization", "test");
    expect(result.status).toBe(200);
    expect(result.body.data.title).toBe(testTask.title);
    expect(result.body.data.description).toBe(testTask.description);
    expect(result.body.data.completed).toBe(testTask.completed);
    expect(result.body.data.username).toBe(testTask.username);
  });

  it("should return 404 if task not found", async () => {
    const testTask = await getTestTask();

    const result = await supertest(web)
      .get(`/api/task/${testTask.id + 200}`)
      .set("Authorization", "test");
    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe("PUT /api/task/:taskid", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestTask();
  });
  afterEach(async () => {
    await removeAllTestTask();
    await removeTestUser();
  });

  it("should can get update task", async () => {
    const testTask = await getTestTask();
    const result = await supertest(web)
      .put(`/api/task/${testTask.id}`)
      .set("Authorization", "test")
      .send({
        title: "lakukan test kedua",
        description: "melakukan test kedua dengan benar",
        completed: false,
      });
    expect(result.status).toBe(200);
    expect(result.body.data.title).toBe("lakukan test kedua");
    expect(result.body.data.description).toBe(
      "melakukan test kedua dengan benar"
    );
    expect(result.body.data.completed).toBe(false);
    expect(result.body.data.username).toBe(testTask.username);
  });

  it("should reject if task not found", async () => {
    const result = await supertest(web)
      .put(`/api/task/1234`)
      .set("Authorization", "test")
      .send({
        title: "lakukan test kedua",
        description: "melakukan test kedua dengan benar",
        completed: false,
      });
    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe("DELETE /api/task/:taskid", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestTask();
  });
  afterEach(async () => {
    await removeAllTestTask();
    await removeTestUser();
  });

  it("should can delete task", async () => {
    const testTask = await getTestTask();
    const result = await supertest(web)
      .delete(`/api/task/${testTask.id}`)
      .set("Authorization", "test");
    expect(result.status).toBe(200);
    expect(result.body.data.title).toBe(testTask.title);
    expect(result.body.data.description).toBe(testTask.description);
    expect(result.body.data.completed).toBe(testTask.completed);
    expect(result.body.data.username).toBe(testTask.username);
    expect(result.body.data.isDeleted).toBe(true);
  });

  it("should reject if task not found", async () => {
    const result = await supertest(web)
      .delete(`/api/task/1234`)
      .set("Authorization", "test");
    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/task/", function () {
  beforeEach(async () => {
    await createTestUser();
    await createManyTestTask();
  });
  afterEach(async () => {
    await removeAllTestTask();
    await removeTestUser();
  });

  it("should can get all task without query", async () => {
    const result = await supertest(web)
      .get(`/api/task/`)
      .set("Authorization", "test");
    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.totalPages).toBe(2);
    expect(result.body.paging.totalItems).toBe(15);
  });

  it("should can search to page 2", async () => {
    const result = await supertest(web)
      .get(`/api/task/`)
      .query({
        page: 2,
      })
      .set("Authorization", "test");
    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(5);
    expect(result.body.paging.page).toBe(2);
    expect(result.body.paging.totalPages).toBe(2);
    expect(result.body.paging.totalItems).toBe(15);
  });

  it("should can search with title", async () => {
    const result = await supertest(web)
      .get(`/api/task/`)
      .query({
        title: "test 1",
      })
      .set("Authorization", "test");
    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(6);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.totalPages).toBe(1);
    expect(result.body.paging.totalItems).toBe(6);
  });

  it("should can search with description", async () => {
    const result = await supertest(web)
      .get(`/api/task/`)
      .query({
        description: "test 1",
      })
      .set("Authorization", "test");
    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(6);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.totalPages).toBe(1);
    expect(result.body.paging.totalItems).toBe(6);
  });

  it("should can search with task completed or not", async () => {
    const result = await supertest(web)
      .get(`/api/task/`)
      .query({
        completed: "false",
      })
      .set("Authorization", "test");
    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.totalPages).toBe(2);
    expect(result.body.paging.totalItems).toBe(15);
  });
});
