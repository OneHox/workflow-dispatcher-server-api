// test/test.js
const chaiHttp = require("chai-http");
const app = require("../index");
const chai = require("chai");

chai.use(chaiHttp);
const expect = chai.expect;

describe("Express App", () => {

  it("should manifest a workflow", (done) => {
    chai
      .request(app)
      .post("/manifest")
      .send({
        group: "c1",
        token: "gh-abdsdc",
        watch: "ci-auth,ci-base",
        workflowRef: "main",
        workflowId: "ci-watcher.yml",
        repository: "xcodeclazz/xcodeclazz-microservices",
      })
      .end((err, res) => {
        expect(res.status).to.eq(200);
        done();
      });
  });

  it("should vote for a workflow", (done) => {
    chai
      .request(app)
      .post("/vote")
      .send({
        group: "c1",
        finished: "true",
        workflow: "ci-auth",
      })
      .end((err, res) => {
        expect(res.body).have.property("message");
        done();
      });
  });

  it("should vote for a workflow", (done) => {
    chai
      .request(app)
      .post("/vote")
      .send({
        group: "c1",
        finished: "true",
        workflow: "ci-base",
      })
      .end((err, res) => {
        expect(res.body).have.property("message");
        done();
      });
  });
});
