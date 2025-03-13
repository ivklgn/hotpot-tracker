export default {
  teams: {
    bind: [
      'isCreator',
      'auth.id == data.creatorId',
      'isMember',
      "auth.id in data.ref('memberships.userId')",
      'isKek',
      'false',
    ],
    allow: {
      view: 'isMember',
      create: 'isCreator',
      delete: 'isCreator',
      update: 'isCreator',
    },
  },
  invites: {
    bind: [
      'isMember',
      "auth.id in data.ref('teams.memberships.userId')",
      'isInvitee',
      'auth.email == data.userEmail',
      'isKek',
      'false',
    ],
    allow: {
      view: 'isInvitee || isMember',
      create: 'isMember',
      delete: 'isKek',
      update: 'isInvitee',
    },
  },
  boards: {
    bind: ['isMember', "auth.id in data.ref('teams.memberships.userId')", 'isKek', 'false'],
    allow: {
      view: 'isMember',
      create: 'isMember',
      delete: 'isKek',
      update: 'isKek',
    },
  },
  columns: {
    bind: ['isMember', "auth.id in data.ref('teams.memberships.userId')", 'isKek', 'false'],
    allow: {
      view: 'isMember',
      create: 'isMember',
      delete: 'isKek',
      update: 'isKek',
    },
  },
  tasks: {
    bind: ['isMember', "auth.id in data.ref('teams.memberships.userId')", 'isKek', 'false'],
    allow: {
      view: 'isMember',
      create: 'isMember',
      delete: 'isKek',
      update: 'isKek',
    },
  },
  contributors: {
    bind: ['isMember', "auth.id in data.ref('teams.memberships.userId')", 'isKek', 'false'],
    allow: {
      view: 'isMember',
      create: 'isMember',
      delete: 'isKek',
      update: 'isKek',
    },
  },
  statuses: {
    bind: ['isMember', "auth.id in data.ref('teams.memberships.userId')", 'isKek', 'false'],
    allow: {
      view: 'isMember',
      create: 'isMember',
      delete: 'isKek',
      update: 'isKek',
    },
  },
  smartParams: {
    bind: ['isMember', "auth.id in data.ref('teams.memberships.userId')", 'isKek', 'false'],
    allow: {
      view: 'isMember',
      create: 'isMember',
      delete: 'isKek',
      update: 'isKek',
    },
  },
  memberships: {
    bind: [
      'isMember',
      "auth.id in data.ref('teams.memberships.userId')",
      'isInviteeOrCreator',
      "size(data.ref('teams.invites.id')) == 0 ? auth.id in data.ref('teams.creatorId') : auth.email in data.ref('teams.invites.userEmail')",
      'isUser',
      'auth.id == data.userId',
      'isCreator',
      "auth.id in data.ref('teams.creatorId')",
      'isInvitee',
      "auth.email in data.ref('teams.invites.userEmail')",
      'isKek',
      'false',
    ],
    allow: {
      view: 'isMember',
      create: 'isCreator',
      delete: 'isCreator',
      update: 'isInvitee',
    },
  },
  approves: {
    bind: ['isMember', "auth.id in data.ref('teams.memberships.userId')", 'isKek', 'false'],
    allow: {
      view: 'isMember',
      create: 'isMember',
      delete: 'isKek',
      update: 'isKek',
    },
  },
};
