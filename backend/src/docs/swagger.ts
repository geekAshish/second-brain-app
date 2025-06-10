import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "My API",
    description: "Description",
  },
  host: "localhost:9001",
};

const outputFile = "./swagger.json";
const routes = ["./src/app.ts"];

swaggerAutogen()(outputFile, routes, doc);
