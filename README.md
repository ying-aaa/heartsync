# HeartSync：🚀 低代码平台，随心构建应用

## 项目简介

HeartSync 是一个低代码平台，旨在帮助开发者和非技术用户快速搭建和管理应用。我们的目标是让应用开发变得简单、灵活且高效，让每个人都能像平台寓意那样 **“随心，心之所想而去做”**，按照自己心中所想去构建应用。无论你是专业开发者，还是希望快速实现业务需求的业务人员，HeartSync 都能为你提供强大的支持。🚀

README中文版 | [README English edition](README.en.md)

## 项目进度

目前，HeartSync 的开发进度已完成约 10%。我们正在不断完善平台的功能和性能，致力于为用户提供更优质的体验。📈

## 技术栈

### 前端

- **[Angular 19](https://angular.io/)**：采用最新版本的 Angular 框架，确保平台的高性能和稳定性。🌐
- **[Angular Material](https://material.angular.io/)**：利用 Material Design 组件库，为用户提供美观且一致的界面体验。🎨
- **[Formly](https://formly.dev/)**：强大的表单库，支持动态表单生成和复杂表单逻辑的实现。📝

### 后端

- **[NestJS](https://nestjs.com/)**：基于 Node.js 的框架，提供高效、可扩展的后端服务。🌐
- **[Keycloak](https://www.keycloak.org/)**：用于身份验证和授权，保障平台的安全性。🛡️
- **[MinIO](https://min.io/)**：高性能的分布式对象存储，用于存储应用的静态资源和文件。💾

### 数据库

- **[PostgreSQL](https://www.postgresql.org/)**：强大的开源关系型数据库，支持复杂的数据查询和事务处理。📊

## 预览地址

你可以通过以下链接预览 HeartSync 平台：[https://wjy.apihub.net/](https://wjy.apihub.net/)。🌐

## 平台功能

### 多应用搭建 🚀

HeartSync 支持创建和管理多个应用，每个应用都可以独立配置和运行。用户可以根据自己的需求，快速搭建出满足业务需求的应用。

### 功能强大的仪表板 📊

应用内的菜单页面采用仪表板形式，用户可以通过拖拽和配置，将多个部件组合成个性化的仪表板。部件类型包括：

- **自定义代码页面**：支持用户编写自定义代码，实现复杂的业务逻辑。💻
- **可视化配置在线图表**：提供丰富的图表类型，用户可以通过可视化配置生成各种数据可视化图表。📊
- **3D 地图**：集成 3D 地图组件，支持地理信息的可视化展示。🌐
- **表单**：强大的表单功能，支持多种表单控件和复杂表单逻辑。📝
- **列表**：用于展示数据列表，支持分页、排序等功能。📜
- **详情**：展示数据的详细信息，支持自定义布局和样式。🔍

### 可视化配置与代码生成 ⚙️

HeartSync 不仅支持可视化配置，还能将可视化配置生成相关的代码。用户可以根据生成的代码进行二次开发，进一步扩展应用的功能。

### 灵活的数据绑定 🔗

平台支持多种数据绑定模式，用户可以选择将表单字段直接绑定到数据库表字段，也可以选择不直接绑定，而是通过提交时的自定义逻辑来处理数据。这种灵活的数据绑定方式，满足了不同用户的需求。

### 多种布局方式 🎨

HeartSync 提供了栅格、Flex、绝对定位三种布局方式，用户可以根据自己的喜好和需求，选择合适的布局方式，打造个性化的应用界面。

### 表单复用 🔗

支持表单复用功能，用户可以将常用的表单保存为模板，在其他应用中直接复用，提高开发效率。

## 平台优势

### 高效开发 🚀

通过低代码的方式，用户可以快速搭建应用，大大缩短开发周期，提高开发效率。

### 灵活性强 🔗

支持多种数据绑定模式、布局方式和表单复用等功能，满足不同用户的需求，适应各种复杂的业务场景。

### 可扩展性强 ⚙️

平台基于强大的技术栈构建，具有良好的可扩展性。用户可以根据自己的需求，进行二次开发和功能扩展。

### 安全可靠 🛡️

采用 Keycloak 进行身份验证和授权，保障平台的安全性。同时，后端基于 NestJS 框架，确保平台的稳定性和可靠性。

### 易用性强 🎨

提供可视化配置界面，用户无需编写大量代码，即可完成应用的搭建和配置。同时，平台还提供了详细的文档和示例，帮助用户快速上手。

## 启动指南

### 环境要求

- **Node.js**：需要 Node.js 16 或更高版本。建议使用 [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm) 来管理 Node.js 版本。
- **Angular CLI**：需要 Angular CLI 19 或更高版本。可以通过以下命令安装：
  ```bash
  npm install -g @angular/cli
  ```
- **PostgreSQL**：需要 PostgreSQL 14 或更高版本。可以通过 [PostgreSQL 官方网站](https://www.postgresql.org/download/) 下载安装。
- **MinIO**：需要 MinIO 服务器。可以通过 [MinIO 官方网站](https://min.io/download) 下载安装。
- **Keycloak**：需要 Keycloak 服务器。可以通过 [Keycloak 官方网站](https://www.keycloak.org/downloads) 下载安装。
- **Docker**：建议使用 Docker 来运行 MinIO 和 Keycloak，以简化部署过程。可以通过 [Docker 官方网站](https://www.docker.com/products/docker-desktop) 下载安装。

### 启动步骤

1. **所需最低node环境**

   ```bash
    nvm install 18.13
    nvm use 18.13
   ```
2. **克隆项目**

   ```bash
   git clone https://github.com/ying-aaa/HeartSync.git
   cd HeartSync
   ```
3. **安装依赖**

   ```bash
   npm install -g yarn
   yarn
   ```
4. **配置后端环境变量**

   - 创建 `.env` 文件，并配置以下环境变量：
     ```env
     # PostgreSQL 配置
     DB_HOST=localhost
     DB_PORT=5432
     DB_NAME=heart_sync
     DB_USER=your_db_user
     DB_PASSWORD=your_db_password

     # Keycloak 配置
     KEYCLOAK_URL=http://localhost:8080
     KEYCLOAK_REALM=your_realm
     KEYCLOAK_CLIENT_ID=your_client_id
     KEYCLOAK_CLIENT_SECRET=your_client_secret

     # MinIO 配置
     MINIO_ENDPOINT=http://localhost:9000
     MINIO_ACCESS_KEY=your_minio_access_key
     MINIO_SECRET_KEY=your_minio_secret_key
     ```
5. **启动后端服务**

   ```bash
   yarn start
   ```
6. **启动前端服务**

   ```bash
   yarn start
   ```
7. **启动 MinIO 和 Keycloak（可选）**

   - 如果你没有安装 MinIO 和 Keycloak，可以通过以下 Docker 命令启动它们：
     ```bash
     docker run -p 9000:9000 -e "MINIO_ACCESS_KEY=your_minio_access_key" -e "MINIO_SECRET_KEY=your_minio_secret_key" minio/minio server /data
     docker run -p 8080:8080 -e "KEYCLOAK_USER=your_keycloak_user" -e "KEYCLOAK_PASSWORD=your_keycloak_password" quay.io/keycloak/keycloak:latest start-dev
     ```
8. **访问平台**

   - 打开浏览器，访问 [http://localhost:4200](http://localhost:4200) 即可使用 HeartSync 平台。

## 未来展望

未来，HeartSync 将继续完善和优化平台的功能，可能会引入以下技术：

- **AI 技术**：利用 AI 技术，为用户提供智能的代码生成和优化建议，进一步提高开发效率。🤖
- **Serverless 架构**：采用 Serverless 架构，降低运维成本，提高平台的可扩展性。🌐
- **更多集成选项**：支持更多的第三方服务和 API 集成，丰富平台的功能和应用场景。🔗

## 贡献指南

我们欢迎所有对 HeartSync 感兴趣的开发者参与贡献。你可以通过以下方式参与：

- 提交问题和建议：在 Issues 中提交你发现的问题或建议，帮助我们改进平台。📝
- 提交代码：如果你有能力，可以直接提交代码，参与平台的开发。💻
- 编写文档：帮助我们完善文档，让更多的用户能够快速上手。📚

## 联系我们

如果你有任何问题或建议，可以通过以下方式联系我们：

- 邮箱：[775296271@qq.com](mailto:775296271@qq.com)
- GitHub：[https://github.com/ying-aaa/HeartSync](https://github.com/ying-aaa/HeartSync)

感谢你对 HeartSync 的关注和支持，让我们一起打造一个更强大的低代码平台！
