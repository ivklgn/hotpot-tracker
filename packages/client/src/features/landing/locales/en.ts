import type { LandingLocale } from './types';

export const enStrings: LandingLocale = {
  hero: {
    title: 'Hotpot ',
    titleHighlight: 'Tracker',
    subtitle:
      '"Cook it the way you want" Traditional agile boards are like restaurants with a chef—you don\'t control the process. Hotpot (',
    subtitleLink: 'hotpot',
    subtitleLinkUrl: 'https://en.wikipedia.org/wiki/Huoguo',
    subtitleEnd: '): cook your workflow your way.',
    ctaPrimary: 'Get started',
    ctaSecondary: 'Learn more',
    ctaWorkspace: 'Go to workspace',
  },
  authForm: {
    loggedInAccount: 'Account',
    signOut: 'Sign out',
    loginTitle: 'Log in or register with email',
  },
  intro: {
    title: 'Another Trello clone?',
    description:
      'Almost... but not quite. Besides simple primitives like boards and tasks, Hotpot offers built-in tools for team engagement.',
  },
  about: {
    title: 'Lovingly built by engineers',
    description:
      'In software development, there are approaches and tools that are useful for business too. Hotpot borrows ideas from Github/Gitlab to bring fresh thinking into team workflows.',
  },
  features: {
    moreBoards: {
      title: 'More boards',
      description: 'Create boards for specific projects/tasks instead of one large universal one.',
    },
    teamEngagement: {
      title: 'Team engagement',
      description: 'Assign team members to every stage (column) as reviewers',
    },
    simpleAttributes: {
      title: 'Simple attributes',
      description: 'Instead of preset fields in tasks—custom key-value attributes to express any meaning',
    },
    approvals: {
      title: 'Approvals',
      description: 'Block task progress between stages unless approved by peers',
    },
    commentsAreEvil: {
      title: 'Comments are evil',
      description: 'Instead, discuss specific ideas right in the document',
    },
    ai: {
      title: 'AI',
      description: 'The better your process is described, the more helpful AI can be',
    },
  },
  opportunities: {
    title: 'Fascinating opportunities',
  },
  screenshots: {
    attributes: {
      title: 'Instead of forced fields—define custom key-value pairs',
      description:
        'Due date, assignee, priority, and progress are task attributes inherited from the board, and using meaningful parameters ensures better AI reporting.',
    },
    reviewers: {
      title: 'Assign reviewers to verify tasks',
      description:
        'Columns represent workflow stages where tasks can be reviewed, with designated users required for approval and rules that block stage movement until approvals are granted.',
    },
    discussions: {
      title: 'Task-level discussions',
      description:
        'Create discussions within a task that must be resolved and closed, with the process integrated into approvals and reviews.',
    },
  },
  quote: {
    content:
      "Sometimes it's important to let go of the unnecessary. Hotpot Tracker keeps the familiar interface for the user but removes inefficient work organization methods.",
    author: 'Ivan K., Creator',
  },
  pricing: {
    title: 'Pricing',
    description: "We're currently in alpha, you can try the system for free",
    planName: 'Free Cloud',
    price: '$0',
    period: '/ month',
    subtitle: 'Perfect for small teams',
    freeForever: 'Free Forever',
    cta: 'Get started',
    limitsTitle: 'Limits:',
    teams: 'teams',
    membersPerTeam: 'members per team',
    boardsPerTeam: 'boards per team',
    tasksPerTeam: 'tasks per team',
    selfHosted: {
      title: 'Self-Hosted',
      badge: 'Open Source',
      price: 'Free',
      period: 'Forever',
      subtitle: 'Full control, no limits',
      cta: 'View on GitHub',
      features: ['Unlimited teams', 'Unlimited members', 'Unlimited boards', 'Unlimited tasks'],
    },
  },
  footer: {
    copyright: '© 2025 Hotpot Tracker. All rights reserved.',
    reportProblem: 'Report problem',
    blog: 'Blog',
    github: 'GitHub',
  },
};
