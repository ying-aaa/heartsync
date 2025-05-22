# HeartSync Platform Documentation

## Project Introduction

HeartSync is a low-code platform designed to help developers and non-technical users quickly build and manage applications. Our goal is to make application development simple, flexible, and efficient, allowing everyone to build applications as they envision. Whether you are a professional developer or a business user looking to quickly implement business requirements, HeartSync provides powerful support.🚀

[README中文版](README.md) | README English edition

## Project Progress

Currently, the development of HeartSync is about 10% complete. We are continuously improving the platform's functionality and performance to provide a better experience for users.📈

## Technology Stack

### Frontend

- **[Angular 19](https://angular.io/)**: The latest version of the Angular framework ensures high performance and stability for the platform.🌐
- **[Angular Material](https://material.angular.io/)**: Utilizing the Material Design component library to provide a visually appealing and consistent user interface.🎨
- **[Formly](https://formly.dev/)**: A powerful form library that supports dynamic form generation and complex form logic.📝

### Backend

- **[NestJS](https://nestjs.com/)**: A Node.js framework that provides efficient and scalable backend services.🌐
- **[Keycloak](https://www.keycloak.org/)**: Used for authentication and authorization to ensure the security of the platform.🛡️
- **[MinIO](https://min.io/)**: High-performance distributed object storage for storing application static resources and files.💾

### Database

- **[PostgreSQL](https://www.postgresql.org/)**: A powerful open-source relational database system that supports complex data queries and transaction processing.📊

## Preview Address

You can preview the HeartSync platform through the following link: [https://wjy.apihub.net/](https://wjy.apihub.net/).🌐

## Platform Features

### Multi-Application Setup 🚀

HeartSync supports the creation and management of multiple applications, each of which can be independently configured and run. Users can quickly build applications that meet their business needs.

### Powerful Dashboard 📊

The application's menu page is designed as a dashboard, where users can drag and drop components to create a personalized dashboard. The components include:

- **Custom Code Pages**: Support for users to write custom code to implement complex business logic.💻
- **Visual Configuration for Online Charts**: Provides a variety of chart types, allowing users to generate data visualization charts through visual configuration.📊
- **3D Maps**: Integrated 3D map components for geographic information visualization.🌐
- **Forms**: Powerful form functionality with support for various form controls and complex form logic.📝
- **Lists**: For displaying data lists with features like pagination and sorting.📜
- **Details**: Displaying detailed information of data with support for custom layout and styling.🔍

### Visual Configuration and Code Generation ⚙️

HeartSync not only supports visual configuration but also generates related code from the visual configuration. Users can further extend the application's functionality by modifying the generated code.

### Flexible Data Binding 🔗

The platform supports multiple data binding modes, allowing users to choose whether to directly bind form fields to database table fields or handle data through custom logic during submission. This flexible data binding meets the needs of different users.

### Multiple Layout Options 🎨

HeartSync provides three layout options: grid, Flex, and absolute positioning. Users can choose the layout method that best suits their preferences and needs to create a personalized application interface.

### Form Reusability 🔗

Supports form reusability, allowing users to save commonly used forms as templates and reuse them in other applications to improve development efficiency.

## Platform Advantages

### Efficient Development 🚀

Using a low-code approach, users can quickly build applications, significantly reducing development cycles and improving efficiency.

### High Flexibility 🔗

Supports multiple data binding modes, layout options, and form reusability, meeting the needs of different users and adapting to various complex business scenarios.

### Strong Scalability ⚙️

Built on a robust technology stack, the platform is highly scalable. Users can perform secondary development and functional extensions based on their needs.

### Security and Reliability 🛡️

Using Keycloak for authentication and authorization ensures platform security. The backend, based on the NestJS framework, ensures the stability and reliability of the platform.

### User-Friendly 🎨

Provides a visual configuration interface, allowing users to build and configure applications without writing extensive code. The platform also offers detailed documentation and examples to help users get started quickly.

## Getting Started Guide

### Environment Requirements

- **Node.js**: Node.js version 16 or higher is required. It is recommended to use [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm) to manage Node.js versions.
- **Angular CLI**: Angular CLI version 19 or higher is required. You can install it using the following command:
  ```bash
  npm install -g @angular/cli
  ```
- **PostgreSQL**: PostgreSQL version 14 or higher is required. You can download and install it from the [PostgreSQL official website](https://www.postgresql.org/download/).
- **MinIO**: MinIO server is required. You can download and install it from the [MinIO official website](https://min.io/download).
- **Keycloak**: Keycloak server is required. You can download and install it from the [Keycloak official website](https://www.keycloak.org/downloads).
- **Docker**: It is recommended to use Docker to run MinIO and Keycloak to simplify the deployment process. You can download and install it from the [Docker official website](https://www.docker.com/products/docker-desktop).

### Start-Up Steps

1. **Minimum Required Node Environment**

   ```bash
   nvm install 18.13
   nvm use 18.13
   ```
2. **Clone the Project**

   ```bash
   git clone https://github.com/ying-aaa/HeartSync.git
   cd HeartSync
   ```
3. **Install Dependencies**

   ```bash
   npm install -g yarn
   yarn
   ```
4. **Configure Backend Environment Variables**

   - Create a `.env` file and configure the following environment variables:
     ```env
     # PostgreSQL Configuration
     DB_HOST=localhost
     DB_PORT=5432
     DB_NAME=heart_sync
     DB_USER=your_db_user
     DB_PASSWORD=your_db_password

     # Keycloak Configuration
     KEYCLOAK_URL=http://localhost:8080
     KEYCLOAK_REALM=your_realm
     KEYCLOAK_CLIENT_ID=your_client_id
     KEYCLOAK_CLIENT_SECRET=your_client_secret

     # MinIO Configuration
     MINIO_ENDPOINT=http://localhost:9000
     MINIO_ACCESS_KEY=your_minio_access_key
     MINIO_SECRET_KEY=your_minio_secret_key
     ```
5. **Start the Backend Service**

   ```bash
   yarn start
   ```
6. **Start the Frontend Service**

   ```bash
   yarn start
   ```
7. **Start MinIO and Keycloak (Optional)**

   - If you have not installed MinIO and Keycloak, you can start them using the following Docker commands:
     ```bash
     docker run -p 9000:9000 -e "MINIO_ACCESS_KEY=your_minio_access_key" -e "MINIO_SECRET_KEY=your_minio_secret_key" minio/minio server /data
     docker run -p 8080:8080 -e "KEYCLOAK_USER=your_keycloak_user" -e "KEYCLOAK_PASSWORD=your_keycloak_password" quay.io/keycloak/keycloak:latest start-dev
     ```
8. **Access the Platform**

   - Open your browser and visit [http://localhost:4200](http://localhost:4200) to use the HeartSync platform.

## Future Outlook

In the future, HeartSync will continue to improve and optimize the platform's functionality. We may introduce the following technologies:

- **AI Technology**: Utilizing AI to provide smart code generation and optimization suggestions to further enhance development efficiency.🤖
- **Serverless Architecture**: Adopting a Serverless architecture to reduce operational costs and improve platform scalability.🌐
- **More Integration Options**: Supporting more third-party services and API integrations to enrich the platform's functionality and application scenarios.🔗

## Contribution Guidelines

We welcome all developers interested in HeartSync to contribute. You can participate in the following ways:

- Submit issues and suggestions: Report any issues or suggestions you find in the Issues section to help us improve the platform.📝
- Submit code: If you have the capability, you can directly submit code to participate in the platform's development.💻
- Write documentation: Help us improve the documentation to make it easier for more users to get started quickly.📚

## Contact Us

If you have any questions or suggestions, you can contact us through the following methods:

- Email: [775296271@qq.com](mailto:775296271@qq.com)
- GitHub: [https://github.com/ying-aaa/HeartSync](https://github.com/ying-aaa/HeartSync)

Thank you for
