# OrgScanner App

## Introduction

**OrgScanner** is an application designed to fetch and display repositories and branch data from GitHub organizations in a structured, efficient way. With a clean and intuitive frontend and a simple backend, OrgScanner provides seamless access to GitHub data, making it easy to monitor organizational repositories and branches.

---

## Implementation Overview

### Backend

The backend was implemented using **NestJS** and **MongoDB**. I leveraged the github's **GraphQL** endpoint instead of the REST endpoints for fetching GitHub’s repositories, and I gained several advantages:
- **Efficient Data Fetching**: The GraphQL endpoint allowed me to request exactly the fields I needed, reducing response size and improving performance.
- **Single Query Multiple Resources**: With the GraphQL endpoint, I could fetch repositories and branches data in a single request, reducing the need for multiple api calls.

#### Technologies Used
- **NestJS** for backend API and application logic.
- **MongoDB** for data storage, allowing efficient query and persistence for when repository is checked.

### Frontend

The frontend was built using **React** and **TailwindCSS** for styling, with **ShadCN** for component styling and structure. This setup enabled the creation of a visually appealing UI to display organization repositories and branches clearly.

#### Technologies Used
- **React** for building the user interface.
- **TailwindCSS** for rapid, utility-first styling.
- **ShadCN** to provide consistent, styled components.

---

## Running the Application

Follow these steps to set up and run the OrgScanner app locally:

1. **Clone the Repository**
   ```bash
    git clone <repository-url>
    cd orgScanner

2. **Install Dependencies:** Navigate to each of the frontend and backend directories and install the dependencies:
   ```bash
    cd frontend
    npm install
    cd ../backend
    npm install

3. **Add environment variables:** In the root directory, create an .env file and include values for the following variables:
   ```bash
    GITHUB_TOKEN= your_github_token
    MONGO_URI= mongodb://db:27017/org-scanner
    PORT=5000

4. **To run Tests:** 
    - For the backend, `cd` into the backend folder and run `npm run test`
    - For the frontend, `cd` into the frontend folder and run `npm run test`

5. **Start the Application:** Once dependencies are installed, navigate back to the root directory and start the application using Docker:
   ```bash
    docker-compose up --build

6. **Access the application:** 
    - Nagigate to `http://localhost:3000` to get access to the frontend applcation.
    - To interact directly with the backend, go to `http://localhost:5000/swagger` to get access to the swagger documenation for the endpoints created.
