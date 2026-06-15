import type { Course, User } from "../types";

export const seedUsers: User[] = [
  {
    id: "admin-1",
    name: "Super Admin",
    email: "admin@elearn.local",
    password: "admin123",
    role: "admin",
    xp: 0,
    level: 1,
    badges: [],
    status: "active",
  },
  {
    id: "trainer-1",
    name: "Amina Coach",
    email: "formateur@elearn.local",
    password: "trainer123",
    role: "formateur",
    xp: 120,
    level: 2,
    badges: ["Creator"],
    status: "active",
  },
  {
    id: "trainer-2",
    name: "Karim Mentor",
    email: "pending@elearn.local",
    password: "trainer123",
    role: "formateur",
    xp: 0,
    level: 1,
    badges: [],
    status: "pending",
  },
  {
    id: "student-1",
    name: "Sara Student",
    email: "etudiant@elearn.local",
    password: "student123",
    role: "etudiant",
    xp: 75,
    level: 1,
    badges: ["First Login"],
    status: "active",
  },
];

export const seedCourses: Course[] = [
  {
    id: "course-react",
    trainerId: "trainer-1",
    title: "React Moderne de A a Z",
    description: "Apprends les fondamentaux, hooks, routing et pratique React.",
    price: 0,
    published: true,
    rating: 4.5,
    ratingCount: 2,
    finalProject: "Construire un exercice final analytics complet.",
    modules: [
      {
        id: "m-react-1",
        title: "Bases React",
        chapters: [
          {
            id: "c-react-1-1",
            title: "Introduction React",
            contentType: "video",
            content: "Video: https://example.com/react-intro",
          },
          {
            id: "c-react-1-2",
            title: "JSX et composants",
            contentType: "text",
            content: "Le JSX permet de decrire l'UI avec une syntaxe declarative.",
          },
        ],
        quiz: {
          id: "q-react-1",
          moduleId: "m-react-1",
          timeLimitSec: 60,
          questions: [
            {
              id: "q1",
              prompt: "Quel hook gere l'etat local ?",
              options: ["useMemo", "useState", "useRef", "useId"],
              answerIndex: 1,
            },
            {
              id: "q2",
              prompt: "React est principalement une...",
              options: ["Librairie UI", "Base de donnees", "API backend", "ORM"],
              answerIndex: 0,
            },
          ],
        },
      },
      {
        id: "m-react-2",
        title: "Routing et architecture",
        chapters: [
          {
            id: "c-react-2-1",
            title: "React Router",
            contentType: "pdf",
            content: "PDF: react-router-guide.pdf",
          },
        ],
        quiz: {
          id: "q-react-2",
          moduleId: "m-react-2",
          timeLimitSec: 45,
          questions: [
            {
              id: "q3",
              prompt: "Quel composant definit les routes ?",
              options: ["RouteMap", "Routes", "RouterList", "RouteGroup"],
              answerIndex: 1,
            },
          ],
        },
      },
    ],
  },
  {
    id: "course-node",
    trainerId: "trainer-1",
    title: "Node.js API Masterclass",
    description: "Concevoir des APIs robustes et securisees.",
    price: 49,
    published: true,
    rating: 5,
    ratingCount: 1,
    finalProject: "Creer un exercice final API REST avec auth JWT et tests.",
    modules: [
      {
        id: "m-node-1",
        title: "Fundamentaux backend",
        chapters: [
          {
            id: "c-node-1-1",
            title: "Architecture d'une API",
            contentType: "text",
            content: "Controller, service, repository et separation des concerns.",
          },
        ],
        quiz: {
          id: "q-node-1",
          moduleId: "m-node-1",
          timeLimitSec: 40,
          questions: [
            {
              id: "q4",
              prompt: "HTTP 201 signifie ?",
              options: ["Error", "Created", "Not found", "Unauthorized"],
              answerIndex: 1,
            },
          ],
        },
      },
    ],
  },
];
