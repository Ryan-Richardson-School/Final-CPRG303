# Architecture Decision Records
Project: Orange Minds Trivia App  
Team: Oranges  

Team Members:
- Anagha Roy
- Ryan Richardson
- Jasmeen Garcha

---

# ADR 1 – Development Framework

## Context
The Orange Minds application will be a trivia app designed to run on Android devices. The development framework must support interactive user interfaces and efficient mobile development.

## Decision
React Native was selected as the development framework.

## Reasoning
React Native allows developers to build mobile applications using JavaScript and reusable components. It also has strong documentation and community support.

## Consequences
Development will be faster and easier due to reusable components, but the team must learn React Native’s component-based structure.

# ADR 2 – Navigation Strategy

## Context
The application includes several screens such as Home, Login, Quiz, Scores, Profile, Account Information, Settings, and Information pages.

## Decision
Stack Navigation combined with Tab Navigation.

## Reasoning
This allows users to move step-by-step through quizzes while also providing quick access to main sections of the app.

## Consequences
Users can navigate easily between quiz gameplay, score tracking, and profile management.

# ADR 3 – Hardware Integration

## Context
Mobile devices provide hardware features such as GPS, camera, and vibration.

## Decision
Use device vibration feedback.

## Reasoning
Vibration provides immediate feedback when answering trivia questions.

Examples:
- Short vibration for correct answers
- Longer vibration for incorrect answers

## Consequences
Improves user experience while remaining simple to implement.

# ADR 4 – Data Storage Strategy

## Context
The application must store trivia questions, categories, and scores.

## Decision
Use local storage.

## Reasoning
Local storage allows the application to run without internet access and simplifies development.

## Consequences
Trivia data must be packaged with the application.