export interface LandingLocale {
  hero: {
    title: string;
    titleHighlight: string;
    subtitle: string;
    subtitleLink: string;
    subtitleLinkUrl: string;
    subtitleEnd: string;
    ctaPrimary: string;
    ctaSecondary: string;
    ctaWorkspace: string;
  };
  authForm: {
    loggedInAccount: string;
    signOut: string;
    loginTitle: string;
  };
  intro: {
    title: string;
    description: string;
  };
  about: {
    title: string;
    description: string;
  };
  features: {
    moreBoards: {
      title: string;
      description: string;
    };
    teamEngagement: {
      title: string;
      description: string;
    };
    simpleAttributes: {
      title: string;
      description: string;
    };
    approvals: {
      title: string;
      description: string;
    };
    commentsAreEvil: {
      title: string;
      description: string;
    };
    ai: {
      title: string;
      description: string;
    };
  };
  opportunities: {
    title: string;
  };
  screenshots: {
    attributes: {
      title: string;
      description: string;
    };
    reviewers: {
      title: string;
      description: string;
    };
    discussions: {
      title: string;
      description: string;
    };
  };
  quote: {
    content: string;
    author: string;
  };
  pricing: {
    title: string;
    description: string;
    planName: string;
    price: string;
    period: string;
    subtitle: string;
    freeForever: string;
    cta: string;
    limitsTitle: string;
    teams: string;
    membersPerTeam: string;
    boardsPerTeam: string;
    tasksPerTeam: string;
    selfHosted: {
      title: string;
      badge: string;
      price: string;
      period: string;
      subtitle: string;
      cta: string;
      features: string[];
    };
  };
  footer: {
    copyright: string;
    reportProblem: string;
    blog: string;
    github: string;
  };
}
