<p align="center">
<img  src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo">
</p>

# Global Think Technology

## Index

1. [General description](#general)
2. [Project structure](#structure)
3. [Download and installation](#installation)
4. [Useful commands](#usefulCommands)
5. [Running the app](#runningTheApp)
6. [Unit tests](#tests)
7. [Endpoints](#endpoint)
8. [Documentation](#documentation) - [Diagram of sequence](#DiagramOfSequence)
9. [Swagger](#swagger)

   <a name="general"></a>

## General description

Project to process the information sent from the frontend and return a response.

<a name="structure"></a>

## Project structure

The project includes the following modularization:

Modules

- Controllers: responsible for processing received HTTP(S) requests and returning a response.
- models: responsible for defining the structure of the database tables.
- Services: definition of services for obtaining data.
- Dto: responsible for transferring data.

Providers

- Responsible for containing the business logic and accessing the database

Services

- Interfaces: definition of services for data management.

Config

- App settings

<a name="installation"></a>

## Download and installation

1 - Download the files and place them in a path of your choice.

2 - Create an .env file. Ask your technical leader for credentials.

3 - Run one of the following options in the root of the project depending on your operating system:

a) Windows:

```
  initialization.bat
```

b) Other environments:

```
 npm install
```

<a name="usefulCommands"></a>

## Useful commands

To generate a complete RESTful resource, including a module, a controller, a service, an entity and DTOs. The command also generates test files (.spec) for each of the components.

```
 nest g resource name
```

Generate a controller

```
 nest g controller name
```

Generate a service

```
 nest g  service name
```

Generate a module

```
 nest g  module  name
```

<a name="runningTheApp"></a>

## Running the app

### Development

```
 npm run start
```

### Watch mode

```
 npm run start:dev
```

### Production mode

```
 npm run start:prod
```

<a name="tests"></a>

## Unit tests

### Unit tests

```
 npm run test
```

### E2e tests

```
 npm run test:e2e
```

### Test coverage

```
 npm run test:cov
```

<a name="structure"></a>

## Endpoint

<a name="endpoint"></a>

Description of the endpoints available in the API.

MODULE USER

GET /api/module
Retorna una lista de modulos.

## Documentation

You can find different information in the documentation section located in this project at the address:

```
'src/documentation/'
```

<a name="DiagramOfSequence"></a>

## Diagram Of sequence

- [List all users](src/documentation/listAllUsers.jpg)

  <a name="swagger"></a>

## Swagger

Project to process the information sent from the frontend and return a response.

## Installation

```
'npm install --save @nestjs/swagger --force'
```

## Introduction

This API allows you to perform CRUD operations.

## Api Url

```
'url/agroApi'
```

## Activation

To activate Swagger, this should only be done in development or testing.
Modify the variable in the .env file.

```
ENVIRONMENT = 'development' | 'production' | 'testing'
```
