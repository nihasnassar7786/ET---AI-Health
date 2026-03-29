# AI Health Project

## Setup Instructions
1. **Clone the repository:**  
   ```bash
   git clone https://github.com/nihasnassar7786/ET---AI-Health.git
   cd ET---AI-Health
   ```  
2. **Install Dependencies:**  
   Make sure you have `node.js` installed. Then run:  
   ```bash
   npm install
   ```  
3. **Run the Application:**  
   ```bash
   npm start
   ```

## Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Deployment:** Docker, AWS

## Project Structure
```
ET---AI-Health/
├── client/       # Frontend source code
├── server/       # Backend source code
├── Dockerfile     # Docker configuration
├── README.md      # Project documentation
└── package.json   # Project dependencies
```

## Deployment Guidance
1. **Containerization:** Make sure Docker is installed on your machine and build the Docker image:  
   ```bash
   docker build -t ai-health .
   ```  
2. **Running the Container:**  
   ```bash
   docker run -p 3000:3000 ai-health
   ```  
3. **Deploying to AWS:** Use AWS ECS to deploy the Docker container to the cloud.

## License
This project is licensed under the MIT License.