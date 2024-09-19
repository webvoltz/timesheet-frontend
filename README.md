# Timesheet

The Timesheet App is a project management application designed to streamline daily scheduling and updates for employees and team leaders. Built with React.js and Vite, this app allows employees to log their daily schedules and updates, while team leaders have the capability to review and approve these entries. The application integrates seamlessly with a headless WordPress backend, providing a robust and flexible content management solution. For enhanced security, the app includes a login system with 2FA OTP verification, ensuring secure access for all users.

## Key Features

1. Daily Schedule Logging: Employees can enter their daily schedules and updates efficiently.
2. Headless WordPress Integration: Leveraging a headless WordPress backend, the app provides a flexible content management experience.
3. Secure Login with 2FA OTP: Users log in using a secure two-factor authentication (2FA) system with OTP verification, enhancing the security of the application.

## Getting Started Locally

To get started with this KD_TIMESHEET, follow these steps:

First, Fork and Clone the repository Locally:

  ```bash
   git clone https://gitlab.webcase.me/Node-projects/timesheet/timesheet-app-react.git
  ```

Next, install the required Dependencies:

 ```bash
  cd timesheet-app-react
  npm install
```

Lastly, Get the required environment variable from the providers [ Reference: [.env.example](/.env.example)] :

```bash
    npm run start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technologies Used

1. React.js: For building the dynamic and interactive user interface.
2. Vite: A fast build tool for frontend development, offering quick setup and optimized performance.
3. NPM: Used for dependency management, making it easy to install and manage libraries and tools.
4. Headless WordPress: Serves as the backend for content management, providing a decoupled and API-driven architecture.
5. 2FA OTP Verification: Integrated for secure user authentication and access control.
6. TypeScript - Enhances JavaScript with static typing, used for type safety and better developer experience.
7. Tailwind CSS - Utility-first CSS framework for rapidly building custom designs.
8. Ant Design - UI component library providing elegant and consistent design elements.
9. Apollo Client - Integrated with GraphQL for managing data and state across the app.
10. GraphQL - For efficient data fetching and serving from the backend.
11. Redux Toolkit - For managing application state in a structured and efficient manner.

## Version

Node version : v20.14.0
React version: ^18.3.1
