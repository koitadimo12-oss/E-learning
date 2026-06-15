import re
import random

file_path = "c:\\Users\\Dell\\Desktop\\e-learn\\plateform-cour-en-ligne\\src\\services\\coursService.ts"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Replace empty images with random Unsplash images
images = [
    '"https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop"',
    '"https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop"',
    '"https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop"',
    '"https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&auto=format&fit=crop"',
    '"https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&auto=format&fit=crop"',
    '"https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop"',
    '"https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop"'
]

def replace_image(match):
    return 'image: ' + random.choice(images)

content = re.sub(r'image:\s*""', replace_image, content)

# 2. Add university courses
uni_courses = """
  {
    id: 905,
    titre: "Harvard: Web Programming with Python and JavaScript",
    description: "Plongez dans le développement web moderne.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop",
    instructeur: "Brian Yu (Harvard)",
    categorie: "Developpement Web",
    badge: "Université",
    niveau: "Intermediaire",
    duree: "15h 00",
    chapitres: [{ id: 1, titre: "HTML & CSS", duree: "1h 30", videoYoutube: "https://www.youtube.com/embed/bMknfKXIFA8", contenu: ["HTML", "CSS"] }],
    quiz: creerQuizParCours("Harvard Web", "HTML", "CSS")
  },
  {
    id: 906,
    titre: "Harvard: Data Science Fundamentals",
    description: "Les bases de la Data Science.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop",
    instructeur: "Rafael Irizarry (Harvard)",
    categorie: "Data",
    badge: "Université",
    niveau: "Debutant",
    duree: "10h 00",
    chapitres: [{ id: 1, titre: "R Basics", duree: "1h 30", videoYoutube: "https://www.youtube.com/embed/TmhQCQr_DCA", contenu: ["R", "Vectors"] }],
    quiz: creerQuizParCours("Harvard Data", "R", "Vectors")
  },
  {
    id: 907,
    titre: "Harvard: Entrepreneurship in Emerging Economies",
    description: "Comprendre le business dans les marchés émergents.",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop",
    instructeur: "Tarun Khanna (Harvard)",
    categorie: "Soft Skills",
    badge: "Université",
    niveau: "Intermediaire",
    duree: "8h 00",
    chapitres: [{ id: 1, titre: "Contextualizing", duree: "1h 30", videoYoutube: "https://www.youtube.com/embed/TQMbvJNRpLE", contenu: ["Markets", "Business"] }],
    quiz: creerQuizParCours("Harvard Business", "Markets", "Strategy")
  },
  {
    id: 908,
    titre: "Harvard: Quantitative Methods for Biology",
    description: "Les mathématiques appliquées à la biologie.",
    image: "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?w=600&auto=format&fit=crop",
    instructeur: "Michael Brenner (Harvard)",
    categorie: "Science",
    badge: "Université",
    niveau: "Intermediaire",
    duree: "12h 00",
    chapitres: [{ id: 1, titre: "Introduction", duree: "1h 30", videoYoutube: "https://www.youtube.com/embed/FSyAehMdpyI", contenu: ["Maths", "Biology"] }],
    quiz: creerQuizParCours("Harvard Bio", "Maths", "Biology")
  },
  {
    id: 909,
    titre: "Harvard: AI with Python",
    description: "Introduction à l'IA avec Python.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop",
    instructeur: "David J. Malan (Harvard)",
    categorie: "Programmation",
    badge: "Université",
    niveau: "Intermediaire",
    duree: "14h 00",
    chapitres: [{ id: 1, titre: "Search", duree: "1h 30", videoYoutube: "https://www.youtube.com/embed/W6NZfCO5SIk", contenu: ["Search", "DFS", "BFS"] }],
    quiz: creerQuizParCours("Harvard AI", "Search", "DFS")
  },
  {
    id: 910,
    titre: "MIT: Introduction to Deep Learning",
    description: "Le fameux cours 6.S191 sur le Deep Learning.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop",
    instructeur: "Alexander Amini (MIT)",
    categorie: "Data",
    badge: "Université",
    niveau: "Intermediaire",
    duree: "20h 00",
    chapitres: [{ id: 1, titre: "Intro to Deep Learning", duree: "1h 30", videoYoutube: "https://www.youtube.com/embed/2ePf9rue1Ao", contenu: ["Neural Networks", "Deep Learning"] }],
    quiz: creerQuizParCours("MIT DL", "Neural Networks", "Deep Learning")
  },
  {
    id: 911,
    titre: "MIT: Circuits and Electronics",
    description: "Apprenez les bases de l'ingénierie électronique.",
    image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&auto=format&fit=crop",
    instructeur: "Anant Agarwal (MIT)",
    categorie: "Science",
    badge: "Université",
    niveau: "Debutant",
    duree: "18h 00",
    chapitres: [{ id: 1, titre: "Basic Circuit Analysis", duree: "1h 30", videoYoutube: "https://www.youtube.com/embed/b1t41Q3xRM8", contenu: ["Circuits", "KCL", "KVL"] }],
    quiz: creerQuizParCours("MIT Circuits", "KCL", "KVL")
  },
  {
    id: 912,
    titre: "Stanford: Algorithms: Design and Analysis",
    description: "Conception et analyse d'algorithmes.",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&auto=format&fit=crop",
    instructeur: "Tim Roughgarden (Stanford)",
    categorie: "Programmation",
    badge: "Université",
    niveau: "Intermediaire",
    duree: "22h 00",
    chapitres: [{ id: 1, titre: "Divide and Conquer", duree: "1h 30", videoYoutube: "https://www.youtube.com/embed/RBSGKlAvoiM", contenu: ["Divide and Conquer", "Sorting"] }],
    quiz: creerQuizParCours("Stanford Algo", "Divide", "Conquer")
  },
  {
    id: 913,
    titre: "Stanford: Databases",
    description: "Les bases de données relationnelles et SQL.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop",
    instructeur: "Jennifer Widom (Stanford)",
    categorie: "Data",
    badge: "Université",
    niveau: "Debutant",
    duree: "16h 00",
    chapitres: [{ id: 1, titre: "Relational Databases", duree: "1h 30", videoYoutube: "https://www.youtube.com/embed/HXV3zeQKqGY", contenu: ["SQL", "Relational Algebra"] }],
    quiz: creerQuizParCours("Stanford DB", "SQL", "Relations")
  },
  {
    id: 914,
    titre: "Oxford: Quantum Mechanics",
    description: "Introduction à la mécanique quantique.",
    image: "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=600&auto=format&fit=crop",
    instructeur: "James Binney (Oxford)",
    categorie: "Science",
    badge: "Université",
    niveau: "Intermediaire",
    duree: "15h 00",
    chapitres: [{ id: 1, titre: "Introduction to Quantum", duree: "1h 30", videoYoutube: "https://www.youtube.com/embed/kKKM8Y-u7ds", contenu: ["Quantum", "Mechanics"] }],
    quiz: creerQuizParCours("Oxford QM", "Quantum", "Mechanics")
  },
  {
    id: 915,
    titre: "Oxford: Critical Reasoning",
    description: "Développez votre esprit critique.",
    image: "https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?w=600&auto=format&fit=crop",
    instructeur: "Marianne Talbot (Oxford)",
    categorie: "Soft Skills",
    badge: "Université",
    niveau: "Debutant",
    duree: "10h 00",
    chapitres: [{ id: 1, titre: "Arguments", duree: "1h 30", videoYoutube: "https://www.youtube.com/embed/HAnw168huqA", contenu: ["Logic", "Reasoning"] }],
    quiz: creerQuizParCours("Oxford Reasoning", "Logic", "Arguments")
  }
"""

content = content.replace("];\n\nfunction genererCoursSupplementaires", uni_courses + "\n];\n\nfunction genererCoursSupplementaires")

# also update the random generator to use unsplash
content = content.replace('image: "",', 'image: "' + random.choice(images) + '",')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated coursService.ts successfully!")
