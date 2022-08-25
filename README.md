# E-commerce-Microservice
A Node.js and Express.js-powered ecommerce Microservice application. To connect the various services, RabbitMQ is used.

## Clone project

```bash
git clone https://github.com/Dev-Elie/E-commerce-Microservice.git
cd E-commerce-Microservice
```

## Install packages for all services
```bash
cd auth-service && npm install
cd product-service && npm install
cd order-service && npm install
```
Install packages for the `Auth middleware`, in the root of the project run:

`npm install`

To run RabbitMQ, execute:

`docker run -p 5672:5672 rabbitmq`

## NOTE: RabbitMQ must be up and running before starting the services.

To run each service, execute:

`npm run dev`


Have fun learning about Microservices.
