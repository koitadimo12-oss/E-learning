import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Mistral } from '@mistralai/mistralai';

@Injectable()
export class AiService {
  private mistral: Mistral;
  private readonly logger = new Logger(AiService.name);

  constructor(private configService: ConfigService) {
    const apiKey =
      this.configService.get<string>('MISTRAL_API_KEY') ||
      'mCk4hsDERIq8ziYpoNL5E1qFxRIOLPCD';
    this.mistral = new Mistral({ apiKey });
    this.logger.log('Mistral AI initialisé');
  }

  private async callMistral(
    prompt: string,
    json = false,
  ): Promise<any | null> {
    try {
      const res = await this.mistral.chat.complete({
        model: 'mistral-small-latest',
        messages: [{ role: 'user', content: prompt }],
        responseFormat: json ? { type: 'json_object' } : { type: 'text' },
        temperature: 0.7,
        maxTokens: 1200,
      });
      const content = res.choices?.[0]?.message?.content ?? null;
      if (!content) return null;
      if (json) {
        try {
          return JSON.parse(
            (content as string).replace(/```json|```/g, '').trim(),
          );
        } catch {
          this.logger.warn('JSON parse failed, returning null');
          return null;
        }
      }
      return content;
    } catch (e: any) {
      this.logger.error('Mistral API error: ' + (e?.message ?? e));
      return null;
    }
  }

  /* ──────────────────────── CHAT GLOBAL ──────────────────────── */
  async chat(input: { message: string; context?: string; lang?: string }) {
    const lang = input.lang || 'fr';
    const prompt = `Tu es un professeur expert bienveillant sur la plateforme d'apprentissage "Kaay Niou Diang".
Réponds de manière claire, précise et dynamique. Adapte ton niveau à l'étudiant.
Langue : ${lang}.
${input.context ? `Contexte du cours : ${input.context}` : ''}
Question : ${input.message}`;

    const res = await this.callMistral(prompt);
    return {
      response:
        res ?? "Je rencontre une difficulté technique. Veuillez réessayer.",
    };
  }

  /* ──────────────────────── EXPLICATION APPROFONDIE ──────────── */
  async lesson(input: {
    lang?: string;
    courseTitle?: string;
    lessonTitle?: string;
    youtubeUrl?: string;
  }) {
    const lang = input.lang || 'fr';
    const prompt = `Tu es un professeur expert. L'étudiant regarde le chapitre "${input.lessonTitle}" du cours "${input.courseTitle}".
Rédige une explication approfondie et très détaillée de ce chapitre en français.
RÈGLES IMPORTANTES :
- Minimum 17 phrases complètes
- Commence par présenter l'objectif du chapitre
- Explique les concepts théoriques avec des termes simples
- Donne au moins 2 exemples concrets et réels
- Explique comment appliquer ces concepts en pratique
- Termine par les points-clés à retenir
- NE génère PAS de JSON — réponds uniquement en texte structuré
Langue : ${lang}`;

    const res = await this.callMistral(prompt, false);
    return {
      response:
        res ??
        "L'explication n'a pas pu être générée. Vérifiez la connexion au backend.",
    };
  }

  /* ──────────────────────── EXPLIQUER SIMPLEMENT ─────────────── */
  async simplify(input: {
    topic: string;
    context?: string;
    lang?: string;
  }) {
    const prompt = `Explique "${input.topic}" de manière très simple, comme si tu parlais à un débutant.
Utilise une analogie du quotidien et donne un exemple concret.
${input.context ? `Contexte : ${input.context}` : ''}
Langue : ${input.lang || 'fr'}`;
    const res = await this.callMistral(prompt);
    return { response: res ?? "Explication indisponible." };
  }

  /* ──────────────────────── DONNER UN EXEMPLE ────────────────── */
  async example(input: { topic: string; context?: string; lang?: string }) {
    const prompt = `Donne un exemple très concret et pratique de "${input.topic}".
L'exemple doit être issu d'une situation réelle de la vie professionnelle ou quotidienne.
${input.context ? `Contexte : ${input.context}` : ''}
Langue : ${input.lang || 'fr'}`;
    const res = await this.callMistral(prompt);
    return { response: res ?? "Exemple indisponible." };
  }

  /* ──────────────────────── RÉSUMÉ COURS ─────────────────────── */
  async summary(input: { text?: string; title?: string; lang?: string }) {
    const prompt = `Résume ce cours de manière structurée.
Titre : ${input.title || 'Cours'}
Texte : ${(input.text ?? '').substring(0, 5000)}
Retourne UNIQUEMENT ce JSON valide :
{
  "title": "Titre du cours",
  "summary": "Résumé en 2-3 phrases",
  "bullets": ["Point clé 1", "Point clé 2", "Point clé 3"]
}`;
    const res = await this.callMistral(prompt, true);
    return res ?? { title: input.title, summary: 'Résumé indisponible', bullets: [] };
  }

  /* ──────────────────────── CONSEILS APRÈS QUIZ ──────────────── */
  async advice(input: { lastScore?: number; topic?: string; lang?: string; answers?: any }) {
    const score = input.lastScore ?? 0;
    const niveau = score >= 80 ? 'excellent' : score >= 60 ? 'correct' : score >= 40 ? 'moyen' : 'faible';
    const prompt = `L'étudiant vient de terminer un exercice sur "${input.topic || 'apprentissage'}" avec un score de ${score}% (niveau : ${niveau}).
Analyse ses performances et donne un feedback personnalisé, motivant et actionnable.
Retourne UNIQUEMENT ce JSON valide :
{
  "message": "Feedback personnalisé (2-3 phrases motivantes sur ses performances)",
  "strengths": ["Point fort 1", "Point fort 2"],
  "weaknesses": ["Point à améliorer 1"],
  "actions": ["Conseil concret 1", "Conseil concret 2"],
  "recommendedCourses": [
    { "title": "Cours recommandé", "reason": "Pourquoi ce cours l'aidera" }
  ]
}`;
    const res = await this.callMistral(prompt, true);
    return (
      res ?? {
        message: 'Continuez vos efforts !',
        strengths: [],
        weaknesses: [],
        actions: [],
        recommendedCourses: [],
      }
    );
  }

  /* ──────────────────────── RECOMMANDATIONS ──────────────────── */
  async recommend(input: { lastScore?: number; domains?: string[] }) {
    const prompt = `L'étudiant s'intéresse à ces domaines : ${(input.domains ?? []).join(', ')}.
Retourne UNIQUEMENT ce JSON valide :
{
  "recommendations": [
    { "domain": "Nom du domaine", "reason": "Pourquoi ce domaine lui convient" }
  ]
}`;
    const res = await this.callMistral(prompt, true);
    return res ?? { recommendations: [] };
  }

  /* ──────────────────────── QUIZ GÉNÉRÉ PAR IA ───────────────── */
  async quiz(input: {
    lang?: string;
    topic?: string;
    count?: number;
    difficulty?: number;
  }) {
    const n = input.count ?? 3;
    const prompt = `Génère un quiz de ${n} questions sur "${input.topic || 'apprentissage'}". Difficulté : ${input.difficulty ?? 1}/3.
Les questions doivent être variées et pédagogiques.
Retourne UNIQUEMENT ce JSON valide :
{
  "questions": [
    {
      "prompt": "Énoncé de la question",
      "options": ["Réponse A", "Réponse B", "Réponse C", "Réponse D"],
      "correctIndex": 0,
      "explanation": "Explication courte de la bonne réponse"
    }
  ]
}`;
    const res = await this.callMistral(prompt, true);
    return res ?? { questions: [] };
  }

  /* ──────────────────────── MINI-JEU ────────────────────────── */
  async game(input: {
    lang?: string;
    topic?: string;
    lastScore?: number;
    level?: number;
  }) {
    // Sujets informatiques uniquement
    const CS_TOPICS = [
      'JavaScript', 'Python', 'algorithmes et structures de données',
      'HTML & CSS', 'bases de données SQL', 'réseaux informatiques',
      'sécurité informatique', 'React.js', 'Git et contrôle de version',
      'programmation orientée objet', 'Linux et ligne de commande',
      'TypeScript', 'architecture logicielle', 'API REST et HTTP',
    ];
    const topic = input.topic && input.topic !== 'apprentissage'
      ? input.topic
      : CS_TOPICS[Math.floor(Math.random() * CS_TOPICS.length)];
    const level = input.level ?? 1;

    // Alterner les types de jeux
    const rand = Math.random();
    const type = rand < 0.5 ? 'timed-quiz' : rand < 0.75 ? 'fill-code' : 'logic-puzzle';

    if (type === 'timed-quiz') {
      const prompt = `Tu es un expert en informatique et programmation. Génère un quiz chronométré de 4 questions sur "${topic}" (niveau ${level}/3).
Les questions doivent être techniques, précises et éducatives sur ce sujet informatique.
Retourne UNIQUEMENT ce JSON valide :
{
  "type": "timed-quiz",
  "title": "Speed Quiz - ${topic}",
  "rules": "Répondez le plus vite possible ! Chaque seconde compte.",
  "difficulty": ${level},
  "reward": { "xp": ${level * 30 + 20}, "badge": null },
  "payload": {
    "seconds": 60,
    "questions": [
      {
        "prompt": "Question technique sur ${topic} ?",
        "options": ["Réponse A", "Réponse B", "Réponse C", "Réponse D"],
        "correctIndex": 0,
        "explanation": "Explication courte de la bonne réponse"
      }
    ]
  }
}`;
      const res = await this.callMistral(prompt, true);
      if (res) return res;
    }

    if (type === 'fill-code') {
      const prompt = `Tu es expert en programmation. Génère un défi de complétion de code ${topic} (niveau ${level}/3).
Retourne UNIQUEMENT ce JSON valide :
{
  "type": "fill-code",
  "title": "Challenge Code - ${topic}",
  "rules": "Complétez le code pour que la fonction retourne le bon résultat.",
  "difficulty": ${level},
  "reward": { "xp": ${level * 25 + 15}, "badge": null },
  "payload": {
    "prompt": "Complétez ce code ${topic}",
    "snippet": "// Code avec ___ à compléter\nfunction exemple(x) {\n  return ___;\n}",
    "choices": ["option correcte", "option fausse 1", "option fausse 2", "option fausse 3"],
    "correct": "option correcte"
  }
}`;
      const res = await this.callMistral(prompt, true);
      if (res) return res;
    }

    // logic-puzzle par défaut
    const prompt = `Tu es expert en informatique. Génère un puzzle logique informatique sur "${topic}" (niveau ${level}/3).
Retourne UNIQUEMENT ce JSON valide :
{
  "type": "logic-puzzle",
  "title": "Puzzle Logique - ${topic}",
  "rules": "Analysez et trouvez la réponse correcte.",
  "difficulty": ${level},
  "reward": { "xp": ${level * 20 + 10}, "badge": null },
  "payload": {
    "prompt": "Problème logique ${topic}",
    "statement": "Énoncé du problème technique...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0
  }
}`;
    const res = await this.callMistral(prompt, true);
    return res ?? {
      type: 'timed-quiz',
      title: `Quiz ${topic}`,
      rules: 'Répondez aux questions suivantes.',
      difficulty: 1,
      reward: { xp: 20, badge: null },
      payload: {
        seconds: 60,
        questions: [
          {
            prompt: 'Quel est le rôle d\'un compilateur ?',
            options: [
              'Traduire le code source en code machine',
              'Exécuter du code ligne par ligne',
              'Compresser les fichiers',
              'Analyser les logs',
            ],
            correctIndex: 0,
            explanation: 'Un compilateur traduit le code source (ex: C) en code machine exécutable.',
          },
        ],
      },
    };
  }

  /* ──────────────────────── JEU DU JOUR ─────────────────────── */
  async dailyGame(input: { coursesTitles: string[]; level: number; lang?: string }) {
    const CS_TOPICS = [
      'JavaScript', 'Python', 'SQL', 'Réseaux', 'Sécurité informatique',
      'Algorithmes', 'React', 'Git', 'Linux', 'TypeScript', 'API REST',
    ];
    // Préférer les sujets liés aux cours suivis, sinon choisir un sujet CS aléatoire
    const courseTopics = input.coursesTitles.filter(t =>
      CS_TOPICS.some(cs => t.toLowerCase().includes(cs.toLowerCase()))
    );
    const topic = courseTopics.length > 0
      ? courseTopics[0]
      : CS_TOPICS[Math.floor(Math.random() * CS_TOPICS.length)];

    const prompt = `Génère une carte "Jeu du Jour" informatique pour un étudiant de niveau ${input.level}/5.
Sujet imposé : ${topic}
Retourne UNIQUEMENT ce JSON valide :
{
  "title": "Titre accrocheur du jeu du jour",
  "description": "Description courte et motivante (1 phrase)",
  "topic": "${topic}",
  "difficulty": ${Math.min(3, Math.max(1, input.level))},
  "xp": ${input.level * 30 + 20},
  "emoji": "🎮"
}`;
    const res = await this.callMistral(prompt, true);
    return (
      res ?? {
        title: `Défi ${topic} du Jour`,
        description: 'Testez vos connaissances et gagnez des XP !',
        topic,
        difficulty: 1,
        xp: 50,
        emoji: '🎮',
      }
    );
  }
}
